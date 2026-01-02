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

/**
 * Console test application for FreeAir Connect API.
 *
 * Run with: mvn exec:java -Dexec.mainClass="org.openhab.binding.freeair.internal.FreeairConsoleTest"
 * -Dexec.args="SERIAL PASSWORD"
 * Or compile and run directly.
 *
 * @author Bernie Renner - Initial contribution
 */
public class FreeairConsoleTest {

    public static void main(String[] args) {
        if (args.length < 2) {
            System.out.println("Usage: FreeairConsoleTest <serialNumber> <password>");
            System.out.println("Example: FreeairConsoleTest 123456 mypassword");
            System.exit(1);
        }

        String serialNumber = args[0];
        String password = args[1];

        System.out.println("===========================================");
        System.out.println("FreeAir Connect API Test");
        System.out.println("openHAB Binding Channel Reference");
        System.out.println("===========================================");
        System.out.println("Serial Number: " + serialNumber);
        System.out.println("Password: " + "*".repeat(password.length()));
        System.out.println();

        try {
            FreeairApiClient client = new FreeairApiClient(serialNumber, password);

            System.out.println("Fetching data from FreeAir Connect...");
            System.out.println();

            FreeairDeviceData data = client.fetchData();

            if (data == null) {
                System.err.println("ERROR: Failed to fetch or parse data");
                System.exit(1);
            }

            // Thing Properties
            printSection("Thing Properties");
            printProperty("firmwareVersion", data.getVersion());
            printProperty("versionFa100", data.getVersionFa100());
            printProperty("boardVersion", String.valueOf(data.getBoardVersion()));
            printValue("Timestamp", data.getTimestamp());

            // Channel Group: temperature
            printChannelGroup("temperature");
            printChannel("tempOutdoor", formatTemp(data.getTempOutdoor()), "Number:Temperature");
            printChannel("tempSupply", formatTemp(data.getTempSupply()), "Number:Temperature");
            printChannel("tempExtract", formatTemp(data.getTempExtract()), "Number:Temperature");
            printChannel("tempExhaust", formatTemp(data.getTempExhaust()), "Number:Temperature");
            printChannel("tempVirtSupExit", formatTemp(data.getTempVirtSupExit()), "Number:Temperature");

            // Channel Group: humidity
            printChannelGroup("humidity");
            printChannel("humidityOutdoor", data.getHumidityOutdoor() + " %", "Number:Dimensionless");
            printChannel("humidityExtract", data.getHumidityExtract() + " %", "Number:Dimensionless");

            // Channel Group: airQuality
            printChannelGroup("airQuality");
            printChannel("co2Extract", data.getCo2Extract() + " ppm", "Number:Dimensionless");
            printChannel("airPressure", data.getAirPressure() + " hPa", "Number:Pressure");

            // Channel Group: ventilation
            printChannelGroup("ventilation");
            printChannel("fanSpeed", data.getFanSpeed() + " (level 0-10)", "Number");
            printChannel("fanSpeedSupply", data.getFanSpeedSupply() + " rpm", "Number");
            printChannel("fanSpeedExtract", data.getFanSpeedExtract() + " rpm", "Number");
            printChannel("airFlow", data.getAirFlow() + " m³/h", "Number");
            printChannel("airFlowAvg", data.getAirFlowAvg() + " m³/h", "Number");
            printChannel("ventPosExtract", data.getVentPosExtract() + " (0-31)", "Number");
            printChannel("ventPosBath", data.getVentPosBath() + " (0-31)", "Number");
            printChannel("ventPosSupply", data.getVentPosSupply() + " (0-31)", "Number");
            printChannel("ventPosBypass", data.getVentPosBypass() + " (0-31)", "Number");

            // Channel Group: filter
            printChannelGroup("filter");
            printChannel("filterSupplyFull", data.isFilterSupplyFull() ? "ON" : "OFF", "Switch");
            printChannel("filterExtractFull", data.isFilterExtractFull() ? "ON" : "OFF", "Switch");
            printChannel("filterStatusSupply", formatFilterStatus(data.getFilterStatusSupply()), "Number");
            printChannel("filterStatusExtract", formatFilterStatus(data.getFilterStatusExtract()), "Number");
            printChannel("filterHours", data.getFilterHours() + " h", "Number:Time");

            // Channel Group: control
            printChannelGroup("control");
            printChannel("comfortLevel", data.getComfortLevel() + " (1-5)", "Number");
            printChannel("operationMode",
                    data.getOperationModeString() + " (code: " + data.getOperationMode() + ")", "String");
            printChannel("controlAuto", data.getControlAutoString() + " (code: " + data.getControlAuto() + ")",
                    "String");

            // Channel Group: features
            printChannelGroup("features");
            printChannel("humidityReductionMode", data.isHumidityReductionMode() ? "ON" : "OFF", "Switch");
            printChannel("summerCooling", data.isSummerCooling() ? "ON" : "OFF", "Switch");
            printChannel("deicing", data.isDeicing() ? "ON" : "OFF", "Switch");

            // Channel Group: diagnostics
            printChannelGroup("diagnostics");
            printChannel("errorState", data.getErrorState() + (data.getErrorState() == 0 ? " (OK)" : " (ERROR!)"),
                    "Number");
            printChannel("operatingHours", data.getOperatingHours() + " h", "Number:Time");
            printChannel("rssi", data.getRssi() + " dBm", "Number:Power");

            // Channel Group: efficiency
            printChannelGroup("efficiency");
            printChannel("energySavings", data.getEnergySavings() + " W", "Number:Power");
            printChannel("heatRecovery", data.getHeatRecovery() + " %", "Number:Dimensionless");

            System.out.println();
            System.out.println("===========================================");
            System.out.println("Test completed successfully!");
            System.out.println("Total Channels: 25");
            System.out.println("===========================================");

        } catch (FreeairCommunicationException e) {
            System.err.println();
            System.err.println("ERROR: Communication failed");
            System.err.println("Message: " + e.getMessage());
            if (e.getCause() != null) {
                System.err.println("Cause: " + e.getCause().getMessage());
            }
            System.exit(1);
        } catch (Exception e) {
            System.err.println();
            System.err.println("ERROR: Unexpected error");
            e.printStackTrace();
            System.exit(1);
        }
    }

    private static void printSection(String title) {
        System.out.println();
        System.out.println("### " + title + " ###");
    }

    private static void printChannelGroup(String groupName) {
        System.out.println();
        System.out.println("--- Channel Group: " + groupName + " ---");
    }

    private static void printChannel(String channelId, String value, String itemType) {
        System.out.printf("  %-25s %-25s [%s]%n", channelId + ":", value, itemType);
    }

    private static void printValue(String label, String value) {
        System.out.printf("  %-25s %s%n", label + ":", value);
    }

    private static void printProperty(String name, String value) {
        System.out.printf("  %-25s %s%n", name + ":", value);
    }

    private static String formatTemp(double temp) {
        return String.format("%.1f °C", temp);
    }

    private static String formatFilterStatus(Integer status) {
        if (status == null) {
            return "N/A";
        }
        String[] labels = { "Empty", "Low", "Medium", "High", "Full" };
        return status + "/4 (" + (status < labels.length ? labels[status] : "?") + ")";
    }
}
