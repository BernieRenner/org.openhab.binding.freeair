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
 * Run with: mvn exec:java -Dexec.mainClass="org.openhab.binding.freeair.internal.FreeairConsoleTest" -Dexec.args="SERIAL PASSWORD"
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

            printSection("Device Info");
            printValue("Firmware Version", data.getVersion());
            printValue("FA100 Version", data.getVersionFa100());
            printValue("Board Version", data.getBoardVersion());
            printValue("Timestamp", data.getTimestamp());

            printSection("Temperature Sensors");
            printValue("Outdoor", formatTemp(data.getTempOutdoor()));
            printValue("Supply", formatTemp(data.getTempSupply()));
            printValue("Extract", formatTemp(data.getTempExtract()));
            printValue("Exhaust", formatTemp(data.getTempExhaust()));
            printValue("Virtual Supply Exit", formatTemp(data.getTempVirtSupExit()));

            printSection("Humidity Sensors");
            printValue("Outdoor", data.getHumidityOutdoor() + " %");
            printValue("Extract", data.getHumidityExtract() + " %");

            printSection("Air Quality");
            printValue("CO2 Extract", data.getCo2Extract() + " ppm");
            printValue("Air Pressure", data.getAirPressure() + " hPa");

            printSection("Ventilation");
            printValue("Fan Speed Level", data.getFanSpeed() + " (0-10)");
            printValue("Supply Fan RPM", data.getFanSpeedSupply() + " rpm");
            printValue("Extract Fan RPM", data.getFanSpeedExtract() + " rpm");
            printValue("Air Flow", data.getAirFlow() + " m³/h");
            printValue("Air Flow Avg", data.getAirFlowAvg() + " m³/h");

            printSection("Vent Positions (0-31)");
            printValue("Extract", String.valueOf(data.getVentPosExtract()));
            printValue("Bath", String.valueOf(data.getVentPosBath()));
            printValue("Supply", String.valueOf(data.getVentPosSupply()));
            printValue("Bypass", String.valueOf(data.getVentPosBypass()));

            printSection("Filter Status");
            printValue("Supply Filter Full", data.isFilterSupplyFull() ? "YES" : "No");
            printValue("Extract Filter Full", data.isFilterExtractFull() ? "YES" : "No");
            printValue("Supply Filter Status", formatFilterStatus(data.getFilterStatusSupply()));
            printValue("Extract Filter Status", formatFilterStatus(data.getFilterStatusExtract()));
            printValue("Filter Hours", data.getFilterHours() + " h");

            printSection("Control");
            printValue("Comfort Level", data.getComfortLevel() + " (1-5)");
            printValue("Operation Mode", data.getOperationModeString() + " (" + data.getOperationMode() + ")");
            printValue("Control Auto", data.getControlAutoString() + " (" + data.getControlAuto() + ")");

            printSection("Features");
            printValue("Humidity Reduction", data.isHumidityReductionMode() ? "ON" : "Off");
            printValue("Summer Cooling", data.isSummerCooling() ? "ON" : "Off");
            printValue("Deicing", data.isDeicing() ? "ON" : "Off");

            printSection("Diagnostics");
            printValue("Error State", data.getErrorState() + (data.getErrorState() == 0 ? " (OK)" : " (ERROR!)"));
            printValue("Operating Hours", data.getOperatingHours() + " h");
            printValue("RSSI", data.getRssi() + " dBm");

            printSection("Efficiency");
            printValue("Energy Savings", data.getEnergySavings() + " W");
            printValue("Heat Recovery", data.getHeatRecovery() + " %");

            System.out.println();
            System.out.println("===========================================");
            System.out.println("Test completed successfully!");
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
        System.out.println("--- " + title + " ---");
    }

    private static void printValue(String label, String value) {
        System.out.printf("  %-25s %s%n", label + ":", value);
    }

    private static void printValue(String label, int value) {
        printValue(label, String.valueOf(value));
    }

    private static String formatTemp(double temp) {
        return String.format("%.1f °C", temp);
    }

    private static String formatFilterStatus(Integer status) {
        if (status == null) {
            return "N/A";
        }
        String[] labels = {"Empty", "Low", "Medium", "High", "Full"};
        return status + "/4 (" + (status < labels.length ? labels[status] : "?") + ")";
    }
}
