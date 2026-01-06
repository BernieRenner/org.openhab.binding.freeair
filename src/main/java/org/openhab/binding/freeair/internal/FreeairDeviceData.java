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

import org.eclipse.jdt.annotation.NonNullByDefault;
import org.eclipse.jdt.annotation.Nullable;

/**
 * The {@link FreeairDeviceData} class holds the parsed data from the FreeAir device.
 *
 * @author Bernie Renner - Initial contribution
 */
@NonNullByDefault
public class FreeairDeviceData {

    // Temperature sensors (in °C)
    private double tempOutdoor;
    private double tempSupply;
    private double tempExtract;
    private double tempExhaust;
    private double tempVirtSupExit;

    // Humidity sensors (in %)
    private int humidityOutdoor;
    private int humidityExtract;

    // Air quality
    private int co2Extract;
    private int airPressure;

    // Fan/Ventilation
    private int fanSpeed;
    private int fanSpeedSupply;
    private int fanSpeedExtract;
    private int airFlow;
    private int airFlowAvg;

    // Vent positions (0-31)
    private int ventPosExtract;
    private int ventPosBath;
    private int ventPosSupply;
    private int ventPosBypass;

    // Filter status
    private boolean filterSupplyFull;
    private boolean filterExtractFull;
    private @Nullable Integer filterStatusSupply;
    private @Nullable Integer filterStatusExtract;
    private int filterHours;

    // Control/Status
    private int comfortLevel;
    private int operationMode;
    private int controlAuto;

    // Features (binary)
    private boolean humidityReductionMode;
    private boolean summerCooling;
    private boolean deicing;

    // Diagnostics
    private int errorState;
    private int errorFileNbr;
    private int errorLineNbr;
    private int errorCode;
    private String errorTextEn = "";
    private String errorTextDe = "";
    private int operatingHours;
    private int rssi;

    // Efficiency
    private int energySavings;
    private int heatRecovery;

    // Human readable error information
    private @Nullable String errorText;

    // Device info
    private String timestamp = "";
    private String version = "";
    private String versionFa100 = "";
    private int boardVersion;

    // Getters and setters

    public double getTempOutdoor() {
        return tempOutdoor;
    }

    public void setTempOutdoor(double tempOutdoor) {
        this.tempOutdoor = tempOutdoor;
    }

    public double getTempSupply() {
        return tempSupply;
    }

    public void setTempSupply(double tempSupply) {
        this.tempSupply = tempSupply;
    }

    public double getTempExtract() {
        return tempExtract;
    }

    public void setTempExtract(double tempExtract) {
        this.tempExtract = tempExtract;
    }

    public double getTempExhaust() {
        return tempExhaust;
    }

    public void setTempExhaust(double tempExhaust) {
        this.tempExhaust = tempExhaust;
    }

    public double getTempVirtSupExit() {
        return tempVirtSupExit;
    }

    public void setTempVirtSupExit(double tempVirtSupExit) {
        this.tempVirtSupExit = tempVirtSupExit;
    }

    public int getHumidityOutdoor() {
        return humidityOutdoor;
    }

    public void setHumidityOutdoor(int humidityOutdoor) {
        this.humidityOutdoor = humidityOutdoor;
    }

    public int getHumidityExtract() {
        return humidityExtract;
    }

    public void setHumidityExtract(int humidityExtract) {
        this.humidityExtract = humidityExtract;
    }

    public int getCo2Extract() {
        return co2Extract;
    }

    public void setCo2Extract(int co2Extract) {
        this.co2Extract = co2Extract;
    }

    public int getAirPressure() {
        return airPressure;
    }

    public void setAirPressure(int airPressure) {
        this.airPressure = airPressure;
    }

    public int getFanSpeed() {
        return fanSpeed;
    }

    public void setFanSpeed(int fanSpeed) {
        this.fanSpeed = fanSpeed;
    }

    public int getFanSpeedSupply() {
        return fanSpeedSupply;
    }

    public void setFanSpeedSupply(int fanSpeedSupply) {
        this.fanSpeedSupply = fanSpeedSupply;
    }

    public int getFanSpeedExtract() {
        return fanSpeedExtract;
    }

    public void setFanSpeedExtract(int fanSpeedExtract) {
        this.fanSpeedExtract = fanSpeedExtract;
    }

    public int getAirFlow() {
        return airFlow;
    }

    public void setAirFlow(int airFlow) {
        this.airFlow = airFlow;
    }

    public int getAirFlowAvg() {
        return airFlowAvg;
    }

    public void setAirFlowAvg(int airFlowAvg) {
        this.airFlowAvg = airFlowAvg;
    }

    public int getVentPosExtract() {
        return ventPosExtract;
    }

    public void setVentPosExtract(int ventPosExtract) {
        this.ventPosExtract = ventPosExtract;
    }

    public int getVentPosBath() {
        return ventPosBath;
    }

    public void setVentPosBath(int ventPosBath) {
        this.ventPosBath = ventPosBath;
    }

    public int getVentPosSupply() {
        return ventPosSupply;
    }

    public void setVentPosSupply(int ventPosSupply) {
        this.ventPosSupply = ventPosSupply;
    }

    public int getVentPosBypass() {
        return ventPosBypass;
    }

    public void setVentPosBypass(int ventPosBypass) {
        this.ventPosBypass = ventPosBypass;
    }

    public boolean isFilterSupplyFull() {
        return filterSupplyFull;
    }

    public void setFilterSupplyFull(boolean filterSupplyFull) {
        this.filterSupplyFull = filterSupplyFull;
    }

    public boolean isFilterExtractFull() {
        return filterExtractFull;
    }

    public void setFilterExtractFull(boolean filterExtractFull) {
        this.filterExtractFull = filterExtractFull;
    }

    public @Nullable Integer getFilterStatusSupply() {
        return filterStatusSupply;
    }

    public void setFilterStatusSupply(@Nullable Integer filterStatusSupply) {
        this.filterStatusSupply = filterStatusSupply;
    }

    public @Nullable Integer getFilterStatusExtract() {
        return filterStatusExtract;
    }

    public void setFilterStatusExtract(@Nullable Integer filterStatusExtract) {
        this.filterStatusExtract = filterStatusExtract;
    }

    public int getFilterHours() {
        return filterHours;
    }

    public void setFilterHours(int filterHours) {
        this.filterHours = filterHours;
    }

    public int getComfortLevel() {
        return comfortLevel;
    }

    public void setComfortLevel(int comfortLevel) {
        this.comfortLevel = comfortLevel;
    }

    public int getOperationMode() {
        return operationMode;
    }

    public void setOperationMode(int operationMode) {
        this.operationMode = operationMode;
    }

    public int getControlAuto() {
        return controlAuto;
    }

    public void setControlAuto(int controlAuto) {
        this.controlAuto = controlAuto;
    }

    public boolean isHumidityReductionMode() {
        return humidityReductionMode;
    }

    public void setHumidityReductionMode(boolean humidityReductionMode) {
        this.humidityReductionMode = humidityReductionMode;
    }

    public boolean isSummerCooling() {
        return summerCooling;
    }

    public void setSummerCooling(boolean summerCooling) {
        this.summerCooling = summerCooling;
    }

    public boolean isDeicing() {
        return deicing;
    }

    public void setDeicing(boolean deicing) {
        this.deicing = deicing;
    }

    public int getErrorState() {
        return errorState;
    }

    public void setErrorState(int errorState) {
        this.errorState = errorState;
    }

    public int getErrorFileNbr() {
        return errorFileNbr;
    }

    public void setErrorFileNbr(int errorFileNbr) {
        this.errorFileNbr = errorFileNbr;
    }

    public int getErrorLineNbr() {
        return errorLineNbr;
    }

    public void setErrorLineNbr(int errorLineNbr) {
        this.errorLineNbr = errorLineNbr;
    }

    public int getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(int errorCode) {
        this.errorCode = errorCode;
    }

    public String getErrorTextEn() {
        return errorTextEn;
    }

    public void setErrorTextEn(String errorTextEn) {
        this.errorTextEn = errorTextEn;
    }

    public String getErrorTextDe() {
        return errorTextDe;
    }

    public void setErrorTextDe(String errorTextDe) {
        this.errorTextDe = errorTextDe;
    }

    public int getOperatingHours() {
        return operatingHours;
    }

    public void setOperatingHours(int operatingHours) {
        this.operatingHours = operatingHours;
    }

    public int getRssi() {
        return rssi;
    }

    public void setRssi(int rssi) {
        this.rssi = rssi;
    }

    public int getEnergySavings() {
        return energySavings;
    }

    public void setEnergySavings(int energySavings) {
        this.energySavings = energySavings;
    }

    public int getHeatRecovery() {
        return heatRecovery;
    }

    public void setHeatRecovery(int heatRecovery) {
        this.heatRecovery = heatRecovery;
    }

    public @Nullable String getErrorText() {
        return errorText;
    }

    public void setErrorText(@Nullable String errorText) {
        this.errorText = errorText;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getVersionFa100() {
        return versionFa100;
    }

    public void setVersionFa100(String versionFa100) {
        this.versionFa100 = versionFa100;
    }

    public int getBoardVersion() {
        return boardVersion;
    }

    public void setBoardVersion(int boardVersion) {
        this.boardVersion = boardVersion;
    }

    public String getOperationModeString() {
        return FreeairBindingConstants.OPERATION_MODE_MAP.getOrDefault(operationMode, "unknown");
    }

    public String getControlAutoString() {
        return FreeairBindingConstants.CONTROL_AUTO_MAP.getOrDefault(controlAuto, "unknown");
    }
}
