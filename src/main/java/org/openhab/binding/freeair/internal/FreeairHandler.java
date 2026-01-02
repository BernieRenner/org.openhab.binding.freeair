/*
 * Copyright (c) 2010-2025 Contributors to the openHAB project
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0
 *
 * SPDX-License-Identifier: EPL-2.0
 */
package org.openhab.binding.freeair.internal;

import static org.openhab.binding.freeair.internal.FreeairBindingConstants.*;

import java.util.Map;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

import org.eclipse.jdt.annotation.NonNullByDefault;
import org.eclipse.jdt.annotation.Nullable;
import org.openhab.core.library.types.DecimalType;
import org.openhab.core.library.types.OnOffType;
import org.openhab.core.library.types.QuantityType;
import org.openhab.core.library.types.StringType;
import org.openhab.core.library.unit.MetricPrefix;
import org.openhab.core.library.unit.SIUnits;
import org.openhab.core.library.unit.Units;
import org.openhab.core.thing.ChannelUID;
import org.openhab.core.thing.Thing;
import org.openhab.core.thing.ThingStatus;
import org.openhab.core.thing.ThingStatusDetail;
import org.openhab.core.thing.binding.BaseThingHandler;
import org.openhab.core.types.Command;
import org.openhab.core.types.RefreshType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * The {@link FreeairHandler} is responsible for handling commands, which are
 * sent to one of the channels.
 *
 * @author Bernie Renner - Initial contribution
 */
@NonNullByDefault
public class FreeairHandler extends BaseThingHandler {

    private final Logger logger = LoggerFactory.getLogger(FreeairHandler.class);

    private @Nullable FreeairConfiguration config;
    private @Nullable FreeairApiClient apiClient;
    private @Nullable ScheduledFuture<?> pollingJob;

    public FreeairHandler(Thing thing) {
        super(thing);
    }

    @Override
    public void handleCommand(ChannelUID channelUID, Command command) {
        String channelId = channelUID.getId();

        if (command instanceof RefreshType) {
            scheduler.execute(this::pollDevice);
            return;
        }

        FreeairApiClient client = apiClient;
        if (client == null) {
            logger.warn("Cannot handle command - API client not initialized");
            return;
        }

        try {
            switch (channelId) {
                case CHANNEL_COMFORT_LEVEL:
                    if (command instanceof DecimalType decimalCommand) {
                        client.setComfortLevel(decimalCommand.intValue());
                        scheduler.schedule(this::pollDevice, 2, TimeUnit.SECONDS);
                    }
                    break;

                case CHANNEL_OPERATION_MODE:
                    if (command instanceof StringType stringCommand) {
                        String mode = stringCommand.toString();
                        Integer modeCode = OPERATION_MODE_SELECTION.get(mode);
                        if (modeCode != null) {
                            client.setOperationMode(modeCode);
                            scheduler.schedule(this::pollDevice, 2, TimeUnit.SECONDS);
                        } else {
                            logger.warn("Unknown operation mode: {}", mode);
                        }
                    }
                    break;

                default:
                    logger.debug("Channel {} does not support commands", channelId);
            }
        } catch (FreeairCommunicationException e) {
            logger.warn("Failed to send command to device: {}", e.getMessage());
            updateStatus(ThingStatus.OFFLINE, ThingStatusDetail.COMMUNICATION_ERROR, e.getMessage());
        }
    }

    @Override
    public void initialize() {
        config = getConfigAs(FreeairConfiguration.class);

        FreeairConfiguration localConfig = config;
        if (localConfig == null || localConfig.serialNumber.isEmpty()) {
            updateStatus(ThingStatus.OFFLINE, ThingStatusDetail.CONFIGURATION_ERROR,
                    "Serial number is required");
            return;
        }

        if (localConfig.password.isEmpty()) {
            updateStatus(ThingStatus.OFFLINE, ThingStatusDetail.CONFIGURATION_ERROR,
                    "Password is required");
            return;
        }

        apiClient = new FreeairApiClient(localConfig.serialNumber, localConfig.password);

        updateStatus(ThingStatus.UNKNOWN);

        // Start background initialization and polling
        scheduler.execute(this::initializeAndStartPolling);
    }

    private void initializeAndStartPolling() {
        if (pollDevice()) {
            startPolling();
        } else {
            // First poll failed, schedule a retry after 30 seconds
            int retryDelay = 30;
            logger.debug("Initial connection failed, scheduling retry in {} seconds", retryDelay);
            scheduler.schedule(this::initializeAndStartPolling, retryDelay, TimeUnit.SECONDS);
        }
    }

    @Override
    public void dispose() {
        stopPolling();
        apiClient = null;
        super.dispose();
    }

    private void startPolling() {
        stopPolling();

        FreeairConfiguration localConfig = config;
        int interval = (localConfig != null) ? localConfig.refreshInterval : 600;

        pollingJob = scheduler.scheduleWithFixedDelay(this::pollDevice, interval, interval, TimeUnit.SECONDS);
        logger.debug("Started polling with interval {} seconds", interval);
    }

    private void stopPolling() {
        ScheduledFuture<?> job = pollingJob;
        if (job != null) {
            job.cancel(true);
            pollingJob = null;
        }
    }

    private boolean pollDevice() {
        FreeairApiClient client = apiClient;
        if (client == null) {
            return false;
        }

        try {
            FreeairDeviceData data = client.fetchData();
            if (data != null) {
                updateChannels(data);
                updateProperties(data);
                updateStatus(ThingStatus.ONLINE);
                return true;
            } else {
                updateStatus(ThingStatus.OFFLINE, ThingStatusDetail.COMMUNICATION_ERROR,
                        "Failed to parse device data");
                return false;
            }
        } catch (FreeairCommunicationException e) {
            logger.warn("Failed to poll device: {}", e.getMessage());
            updateStatus(ThingStatus.OFFLINE, ThingStatusDetail.COMMUNICATION_ERROR, e.getMessage());
            return false;
        }
    }

    private void updateChannels(FreeairDeviceData data) {
        // Temperature channels
        updateState(CHANNEL_TEMP_OUTDOOR, new QuantityType<>(data.getTempOutdoor(), SIUnits.CELSIUS));
        updateState(CHANNEL_TEMP_SUPPLY, new QuantityType<>(data.getTempSupply(), SIUnits.CELSIUS));
        updateState(CHANNEL_TEMP_EXTRACT, new QuantityType<>(data.getTempExtract(), SIUnits.CELSIUS));
        updateState(CHANNEL_TEMP_EXHAUST, new QuantityType<>(data.getTempExhaust(), SIUnits.CELSIUS));
        updateState(CHANNEL_TEMP_VIRT_SUP_EXIT, new QuantityType<>(data.getTempVirtSupExit(), SIUnits.CELSIUS));

        // Humidity channels
        updateState(CHANNEL_HUMIDITY_OUTDOOR, new QuantityType<>(data.getHumidityOutdoor(), Units.PERCENT));
        updateState(CHANNEL_HUMIDITY_EXTRACT, new QuantityType<>(data.getHumidityExtract(), Units.PERCENT));

        // Air quality channels
        updateState(CHANNEL_CO2_EXTRACT, new QuantityType<>(data.getCo2Extract(), Units.PARTS_PER_MILLION));
        updateState(CHANNEL_AIR_PRESSURE, new QuantityType<>(data.getAirPressure(), MetricPrefix.HECTO(SIUnits.PASCAL)));

        // Fan/Ventilation channels
        updateState(CHANNEL_FAN_SPEED, new DecimalType(data.getFanSpeed()));
        updateState(CHANNEL_FAN_SPEED_SUPPLY, new DecimalType(data.getFanSpeedSupply()));
        updateState(CHANNEL_FAN_SPEED_EXTRACT, new DecimalType(data.getFanSpeedExtract()));
        updateState(CHANNEL_AIR_FLOW, new DecimalType(data.getAirFlow()));
        updateState(CHANNEL_AIR_FLOW_AVG, new DecimalType(data.getAirFlowAvg()));

        // Vent position channels
        updateState(CHANNEL_VENT_POS_EXTRACT, new DecimalType(data.getVentPosExtract()));
        updateState(CHANNEL_VENT_POS_BATH, new DecimalType(data.getVentPosBath()));
        updateState(CHANNEL_VENT_POS_SUPPLY, new DecimalType(data.getVentPosSupply()));
        updateState(CHANNEL_VENT_POS_BYPASS, new DecimalType(data.getVentPosBypass()));

        // Filter status channels
        updateState(CHANNEL_FILTER_SUPPLY_FULL, OnOffType.from(data.isFilterSupplyFull()));
        updateState(CHANNEL_FILTER_EXTRACT_FULL, OnOffType.from(data.isFilterExtractFull()));

        Integer filterStatusSupply = data.getFilterStatusSupply();
        if (filterStatusSupply != null) {
            updateState(CHANNEL_FILTER_STATUS_SUPPLY, new DecimalType(filterStatusSupply));
        }

        Integer filterStatusExtract = data.getFilterStatusExtract();
        if (filterStatusExtract != null) {
            updateState(CHANNEL_FILTER_STATUS_EXTRACT, new DecimalType(filterStatusExtract));
        }

        updateState(CHANNEL_FILTER_HOURS, new QuantityType<>(data.getFilterHours(), Units.HOUR));

        // Control/Status channels
        updateState(CHANNEL_COMFORT_LEVEL, new DecimalType(data.getComfortLevel()));
        updateState(CHANNEL_OPERATION_MODE, new StringType(data.getOperationModeString()));
        updateState(CHANNEL_CONTROL_AUTO, new StringType(data.getControlAutoString()));

        // Feature channels
        updateState(CHANNEL_HUMIDITY_REDUCTION_MODE, OnOffType.from(data.isHumidityReductionMode()));
        updateState(CHANNEL_SUMMER_COOLING, OnOffType.from(data.isSummerCooling()));
        updateState(CHANNEL_DEICING, OnOffType.from(data.isDeicing()));

        // Diagnostic channels
        updateState(CHANNEL_ERROR_STATE, new DecimalType(data.getErrorState()));
        updateState(CHANNEL_OPERATING_HOURS, new QuantityType<>(data.getOperatingHours(), Units.HOUR));
        updateState(CHANNEL_RSSI, new QuantityType<>(data.getRssi(), Units.DECIBEL_MILLIWATTS));

        // Efficiency channels
        updateState(CHANNEL_ENERGY_SAVINGS, new QuantityType<>(data.getEnergySavings(), Units.WATT));
        updateState(CHANNEL_HEAT_RECOVERY, new QuantityType<>(data.getHeatRecovery(), Units.PERCENT));
    }

    private void updateProperties(FreeairDeviceData data) {
        Map<String, String> properties = Map.of(
                Thing.PROPERTY_FIRMWARE_VERSION, data.getVersion(),
                "versionFa100", data.getVersionFa100(),
                "boardVersion", String.valueOf(data.getBoardVersion()));

        updateProperties(properties);
    }
}
