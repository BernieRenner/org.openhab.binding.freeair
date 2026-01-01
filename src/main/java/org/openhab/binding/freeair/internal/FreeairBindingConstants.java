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

import java.util.Map;

import org.eclipse.jdt.annotation.NonNullByDefault;
import org.openhab.core.thing.ThingTypeUID;

/**
 * The {@link FreeairBindingConstants} class defines common constants, which are
 * used across the whole binding.
 *
 * @author Bernie Renner - Initial contribution
 */
@NonNullByDefault
public class FreeairBindingConstants {

    private static final String BINDING_ID = "freeair";

    // List of all Thing Type UIDs
    public static final ThingTypeUID THING_TYPE_DEVICE = new ThingTypeUID(BINDING_ID, "device");

    // API Constants
    public static final String BASE_URL = "https://www.freeair-connect.de/";
    public static final String LOGIN_URL = BASE_URL + "index.php";
    public static final String DATA_URL = BASE_URL + "getDataHexAjax.php";
    public static final String ERROR_URL = BASE_URL + "getErrorTextLong.php";
    public static final String CONTROL_URL = BASE_URL + "bf.php";

    // Channel Group IDs
    public static final String GROUP_TEMPERATURE = "temperature";
    public static final String GROUP_HUMIDITY = "humidity";
    public static final String GROUP_AIR_QUALITY = "airQuality";
    public static final String GROUP_VENTILATION = "ventilation";
    public static final String GROUP_FILTER = "filter";
    public static final String GROUP_CONTROL = "control";
    public static final String GROUP_FEATURES = "features";
    public static final String GROUP_DIAGNOSTICS = "diagnostics";
    public static final String GROUP_EFFICIENCY = "efficiency";

    // Channel IDs - Temperature sensors (with group prefix)
    public static final String CHANNEL_TEMP_OUTDOOR = GROUP_TEMPERATURE + "#tempOutdoor";
    public static final String CHANNEL_TEMP_SUPPLY = GROUP_TEMPERATURE + "#tempSupply";
    public static final String CHANNEL_TEMP_EXTRACT = GROUP_TEMPERATURE + "#tempExtract";
    public static final String CHANNEL_TEMP_EXHAUST = GROUP_TEMPERATURE + "#tempExhaust";
    public static final String CHANNEL_TEMP_VIRT_SUP_EXIT = GROUP_TEMPERATURE + "#tempVirtSupExit";

    // Channel IDs - Humidity sensors (with group prefix)
    public static final String CHANNEL_HUMIDITY_OUTDOOR = GROUP_HUMIDITY + "#humidityOutdoor";
    public static final String CHANNEL_HUMIDITY_EXTRACT = GROUP_HUMIDITY + "#humidityExtract";

    // Channel IDs - Air quality (with group prefix)
    public static final String CHANNEL_CO2_EXTRACT = GROUP_AIR_QUALITY + "#co2Extract";
    public static final String CHANNEL_AIR_PRESSURE = GROUP_AIR_QUALITY + "#airPressure";

    // Channel IDs - Fan/Ventilation (with group prefix)
    public static final String CHANNEL_FAN_SPEED = GROUP_VENTILATION + "#fanSpeed";
    public static final String CHANNEL_FAN_SPEED_SUPPLY = GROUP_VENTILATION + "#fanSpeedSupply";
    public static final String CHANNEL_FAN_SPEED_EXTRACT = GROUP_VENTILATION + "#fanSpeedExtract";
    public static final String CHANNEL_AIR_FLOW = GROUP_VENTILATION + "#airFlow";
    public static final String CHANNEL_AIR_FLOW_AVG = GROUP_VENTILATION + "#airFlowAvg";

    // Channel IDs - Vent positions (with group prefix)
    public static final String CHANNEL_VENT_POS_EXTRACT = GROUP_VENTILATION + "#ventPosExtract";
    public static final String CHANNEL_VENT_POS_BATH = GROUP_VENTILATION + "#ventPosBath";
    public static final String CHANNEL_VENT_POS_SUPPLY = GROUP_VENTILATION + "#ventPosSupply";
    public static final String CHANNEL_VENT_POS_BYPASS = GROUP_VENTILATION + "#ventPosBypass";

    // Channel IDs - Filter status (with group prefix)
    public static final String CHANNEL_FILTER_SUPPLY_FULL = GROUP_FILTER + "#filterSupplyFull";
    public static final String CHANNEL_FILTER_EXTRACT_FULL = GROUP_FILTER + "#filterExtractFull";
    public static final String CHANNEL_FILTER_STATUS_SUPPLY = GROUP_FILTER + "#filterStatusSupply";
    public static final String CHANNEL_FILTER_STATUS_EXTRACT = GROUP_FILTER + "#filterStatusExtract";
    public static final String CHANNEL_FILTER_HOURS = GROUP_FILTER + "#filterHours";

    // Channel IDs - Control/Status (with group prefix)
    public static final String CHANNEL_COMFORT_LEVEL = GROUP_CONTROL + "#comfortLevel";
    public static final String CHANNEL_OPERATION_MODE = GROUP_CONTROL + "#operationMode";
    public static final String CHANNEL_CONTROL_AUTO = GROUP_CONTROL + "#controlAuto";

    // Channel IDs - Features (with group prefix)
    public static final String CHANNEL_HUMIDITY_REDUCTION_MODE = GROUP_FEATURES + "#humidityReductionMode";
    public static final String CHANNEL_SUMMER_COOLING = GROUP_FEATURES + "#summerCooling";
    public static final String CHANNEL_DEICING = GROUP_FEATURES + "#deicing";

    // Channel IDs - Diagnostics (with group prefix)
    public static final String CHANNEL_ERROR_STATE = GROUP_DIAGNOSTICS + "#errorState";
    public static final String CHANNEL_OPERATING_HOURS = GROUP_DIAGNOSTICS + "#operatingHours";
    public static final String CHANNEL_RSSI = GROUP_DIAGNOSTICS + "#rssi";

    // Channel IDs - Efficiency (with group prefix)
    public static final String CHANNEL_ENERGY_SAVINGS = GROUP_EFFICIENCY + "#energySavings";
    public static final String CHANNEL_HEAT_RECOVERY = GROUP_EFFICIENCY + "#heatRecovery";

    // Operation mode mappings (code -> name)
    public static final Map<Integer, String> OPERATION_MODE_MAP = Map.of(
            0, "comfort",
            1, "comfort",
            2, "sleep",
            3, "turbo",
            4, "turbo_cool",
            5, "service",
            6, "test",
            7, "manufacturer"
    );

    // Control auto mode mappings (code -> name)
    public static final Map<Integer, String> CONTROL_AUTO_MAP = Map.of(
            0, "min_ventilation",
            1, "humidity_reduction_rel",
            2, "humidity_reduction_abs",
            3, "active_cooling",
            4, "co2_reduction",
            5, "water_insertion",
            6, "outdoor_temp_lt_22_degc",
            7, "humidity_input"
    );

    // Operation mode selection (name -> code for sending commands)
    public static final Map<String, Integer> OPERATION_MODE_SELECTION = Map.of(
            "comfort", 1,
            "sleep", 2,
            "turbo", 3,
            "turbo_cool", 4
    );
}
