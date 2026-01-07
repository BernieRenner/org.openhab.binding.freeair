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

import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.eclipse.jdt.annotation.NonNullByDefault;
import org.eclipse.jdt.annotation.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * The {@link FreeairDataParser} parses and decrypts data from the FreeAir API.
 *
 * @author Bernie Renner - Initial contribution
 */
@NonNullByDefault
public class FreeairDataParser {

    private final Logger logger = LoggerFactory.getLogger(FreeairDataParser.class);

    private final String password;

    // Filter RPM lookup tables for supply filter
    private static final int[][] FILTER_RPMS_SUPPLY = {
            { 20, 870, 1510 },
            { 30, 1000, 1640 },
            { 40, 1230, 1870 },
            { 50, 1460, 2100 },
            { 60, 1690, 2410 },
            { 70, 1910, 2630 },
            { 85, 2230, 2950 },
            { 100, 2540, 3260 },
            { 0, 0, 0 }
    };

    // Filter RPM lookup tables for extract filter
    private static final int[][] FILTER_RPMS_EXTRACT = {
            { 20, 920, 1560 },
            { 30, 1040, 1680 },
            { 40, 1260, 1900 },
            { 50, 1480, 2200 },
            { 60, 1700, 2420 },
            { 70, 1910, 2710 },
            { 85, 2210, 2930 },
            { 100, 2480, 3200 },
            { 0, 0, 0 }
    };

    public FreeairDataParser(String password) {
        this.password = password;
    }

    public @Nullable FreeairDeviceData parse(String rawResponse) {
        try {
            // Split response: <encrypted_data>timestamp<YYYY-MM-DD HH:MM:SS>timestamp<version>timestamp<version_fa100>timestamp...
            String[] parts = rawResponse.split("timestamp");
            logger.debug("Split response into {} parts by 'timestamp'", parts.length);
            if (parts.length < 4) {
                logger.warn("Invalid response format: expected 4 parts separated by 'timestamp', got {}",
                        parts.length);
                return null;
            }

            String encryptedData = parts[0];
            String timestamp = parts[1];
            String version = parts[2];
            String versionFa100 = parts[3];

            logger.debug("Parsed: timestamp='{}', version='{}', versionFa100='{}'",
                    timestamp, version, versionFa100.length() > 20 ? versionFa100.substring(0, 20) + "..." : versionFa100);

            // Decrypt the data
            byte[] decrypted = decrypt(encryptedData, version);
            if (decrypted == null) {
                return null;
            }

            // Parse the decrypted binary data
            return parseData(decrypted, timestamp, version, versionFa100);
        } catch (Exception e) {
            logger.error("Failed to parse FreeAir data: {}", e.getMessage());
            return null;
        }
    }

    private @Nullable byte[] decrypt(String encryptedBase64, String version) {
        try {
            // Handle URL-safe base64 and special character replacements (like JS handleSpecialCharactersBack)
            String base64 = encryptedBase64;
            if (base64.startsWith("\n")) {
                base64 = base64.substring(1);
            }
            base64 = base64.replace("-", "+").replace("_", "/").replace(";", "=");

            logger.trace("Encrypted base64 ({} chars): {}", base64.length(),
                    base64.length() > 100 ? base64.substring(0, 100) + "..." : base64);
            byte[] encryptedData = Base64.getDecoder().decode(base64);
            logger.trace("Encrypted data: {} bytes", encryptedData.length);

            // Determine IV and key size based on version
            String[] versionNumbers = version.split("x");
            int major = Integer.parseInt(versionNumbers[0]);
            int minor = Integer.parseInt(versionNumbers[1]);

            byte[] iv;
            int keySize;

            if (major == 2 && (minor <= 13 || minor == 20 || minor == 21)) {
                iv = hexStringToByteArray("000102030405060708090a0b0c0d0e0f");
                keySize = 16;
            } else {
                iv = hexStringToByteArray("30313233343536373839303132333435");
                keySize = 32;
            }

            // Pad password with zeros to required size
            String paddedPassword = password;
            while (paddedPassword.length() < keySize) {
                paddedPassword += "0";
            }
            paddedPassword = paddedPassword.substring(0, keySize);
            byte[] key = paddedPassword.getBytes(StandardCharsets.UTF_8);

            logger.debug("Using {}-bit AES encryption (version: {}, key length: {} bytes)",
                    keySize * 8, version, key.length);

            // Log max allowed key length for debugging
            int maxKeyLen = Cipher.getMaxAllowedKeyLength("AES");
            logger.debug("Max allowed AES key length: {} bits", maxKeyLen);

            // Decrypt using AES/CBC (Rijndael with 128-bit block size is AES)
            Cipher cipher = Cipher.getInstance("AES/CBC/NoPadding");
            SecretKeySpec secretKey = new SecretKeySpec(key, "AES");
            IvParameterSpec ivSpec = new IvParameterSpec(iv);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, ivSpec);

            return cipher.doFinal(encryptedData);
        } catch (GeneralSecurityException e) {
            logger.error("Decryption failed: {} (Java: {})",
                    e.getMessage(), System.getProperty("java.version"));
            return null;
        }
    }

    private FreeairDeviceData parseData(byte[] data, String timestamp, String version, String versionFa100) {
        FreeairDeviceData deviceData = new FreeairDeviceData();

        logger.trace("Parsing decrypted data ({} bytes)", data.length);

        // Metadata
        deviceData.setTimestamp(timestamp);
        deviceData.setVersion(version.replace("x", "."));
        deviceData.setVersionFa100(versionFa100.replace("x", "."));

        // Direct byte reads (humidity is stored directly)
        deviceData.setHumidityOutdoor(data[0] & 0xFF);
        deviceData.setHumidityExtract(data[1] & 0xFF);
        deviceData.setBoardVersion(data[22] & 0xFF);

        // Temperature values use lowPlusHigh combining:
        // - Low byte: 7 bits from a full byte (positions 2-6)
        // - High byte: 4 bits from LSB side of bytes 29-33
        // Result is 11-bit signed, divided by 8

        // TempSupply: low=byte[2], high=4 LSB bits of byte[29]
        int tempSupplyRaw = lowPlusHigh(data[2] & 0xFF, getLowBits(data[29] & 0xFF, 4));
        deviceData.setTempSupply(asSigned(tempSupplyRaw, 11) / 8.0);

        // TempOutdoor: low=byte[3], high=4 LSB bits of byte[32]
        int tempOutdoorRaw = lowPlusHigh(data[3] & 0xFF, getLowBits(data[32] & 0xFF, 4));
        deviceData.setTempOutdoor(asSigned(tempOutdoorRaw, 11) / 8.0);

        // TempExhaust: low=byte[4], high=4 LSB bits of byte[31]
        int tempExhaustRaw = lowPlusHigh(data[4] & 0xFF, getLowBits(data[31] & 0xFF, 4));
        deviceData.setTempExhaust(asSigned(tempExhaustRaw, 11) / 8.0);

        // TempExtract: low=byte[5], high=4 LSB bits of byte[30]
        int tempExtractRaw = lowPlusHigh(data[5] & 0xFF, getLowBits(data[30] & 0xFF, 4));
        deviceData.setTempExtract(asSigned(tempExtractRaw, 11) / 8.0);

        // TempVirtSupExit: low=byte[6], high=4 LSB bits of byte[33]
        int tempVirtSupExitRaw = lowPlusHigh(data[6] & 0xFF, getLowBits(data[33] & 0xFF, 4));
        deviceData.setTempVirtSupExit(asSigned(tempVirtSupExitRaw, 11) / 8.0);

        // CO2: low=byte[13] (7 bits), high=1 bit from byte[36] bit 5
        int co2High = (data[36] & 0xFF) >> 5 & 0x01;
        int co2Raw = lowPlusHigh(data[13] & 0xFF, co2High);
        deviceData.setCo2Extract(co2Raw * 16);

        // Pressure: 5 MSB bits from byte[39], 4 LSB bits from byte[34]
        int pressure5MSB = getLowBits(data[39] & 0xFF, 5);
        int pressure4LSB = getLowBits(data[34] & 0xFF, 4);
        int pressureRaw = (pressure5MSB << 4) | pressure4LSB;
        deviceData.setAirPressure(700 + pressureRaw);

        // Control values - extracted from middle bits
        // ComfortLevel: bits 4-6 (3 bits) of byte[29]
        int comfortLevelRaw = (data[29] & 0xFF) >> 4 & 0x07;
        deviceData.setComfortLevel(comfortLevelRaw + 1);

        // OperationMode (State): bits 4-6 (3 bits) of byte[30]
        int operationMode = (data[30] & 0xFF) >> 4 & 0x07;
        deviceData.setOperationMode(operationMode);

        // ControlAuto: bits 4-6 (3 bits) of byte[31]
        int controlAuto = (data[31] & 0xFF) >> 4 & 0x07;
        deviceData.setControlAuto(controlAuto);

        // Fan/Ventilation
        // FanSpeed: 4 LSB bits of byte[38]
        int fanSpeed = getLowBits(data[38] & 0xFF, 4);
        deviceData.setFanSpeed(fanSpeed);

        // FanSupplyRPM: low=byte[9], high=5 LSB bits of byte[37]
        int fanSpeedSupply = lowPlusHigh(data[9] & 0xFF, getLowBits(data[37] & 0xFF, 5));
        deviceData.setFanSpeedSupply(fanSpeedSupply);

        // FanExtractRPM: low=byte[7], high=5 LSB bits of byte[36]
        int fanSpeedExtract = lowPlusHigh(data[7] & 0xFF, getLowBits(data[36] & 0xFF, 5));
        deviceData.setFanSpeedExtract(fanSpeedExtract);

        // AirFlowAvg: 5 LSB bits of byte[35]
        int airFlowAvg = getLowBits(data[35] & 0xFF, 5);
        deviceData.setAirFlowAvg(airFlowAvg);

        // Air flow calculation
        int airFlow = (fanSpeed > 2) ? fanSpeed * 10 : airFlowAvg;
        deviceData.setAirFlow(airFlow);

        // Vent positions - 5 LSB bits of each byte
        deviceData.setVentPosExtract(getLowBits(data[26] & 0xFF, 5));
        deviceData.setVentPosBath(getLowBits(data[27] & 0xFF, 5));
        deviceData.setVentPosSupply(getLowBits(data[25] & 0xFF, 5));
        deviceData.setVentPosBypass(getLowBits(data[28] & 0xFF, 5));

        // Filter status - individual bits from byte[34]
        deviceData.setFilterSupplyFull(((data[34] & 0xFF) >> 5 & 0x01) == 1);
        deviceData.setFilterExtractFull(((data[34] & 0xFF) >> 6 & 0x01) == 1);

        // Filter hours: uses 3 bytes with super high bits
        int filterHoursSuperHigh = (data[40] & 0xFF) >> 4 & 0x03;
        int filterHours = lowPlusHighSuper(data[16] & 0xFF, data[17] & 0xFF, filterHoursSuperHigh);
        deviceData.setFilterHours(filterHours);

        // Calculate filter status from RPM, but respect the device's "full" flag
        Integer supplyStatus = calculateFilterStatus(fanSpeedSupply, fanSpeed, FILTER_RPMS_SUPPLY);
        if (deviceData.isFilterSupplyFull()) {
            supplyStatus = 4; // Device says it's full, override calculated value
        }
        deviceData.setFilterStatusSupply(supplyStatus);

        Integer extractStatus = calculateFilterStatus(fanSpeedExtract, fanSpeed, FILTER_RPMS_EXTRACT);
        if (deviceData.isFilterExtractFull()) {
            extractStatus = 4; // Device says it's full, override calculated value
        }
        deviceData.setFilterStatusExtract(extractStatus);

        // Feature flags - individual bits
        deviceData.setHumidityReductionMode(((data[37] & 0xFF) >> 5 & 0x01) == 1);
        deviceData.setSummerCooling(((data[37] & 0xFF) >> 6 & 0x01) == 1);
        deviceData.setDeicing(((data[23] & 0xFF) >> 6 & 0x01) == 1);

        // Diagnostics
        // ErrorState: 5 LSB bits of byte[24]
        deviceData.setErrorState(getLowBits(data[24] & 0xFF, 5));

        // ErrorFileNbr: 6 LSB bits of byte[23]
        deviceData.setErrorFileNbr(getLowBits(data[23] & 0xFF, 6));

        // ErrorLineNbr: complex extraction from bytes[39,10,11]
        // 2 bits from byte[39] bits 5-6, then 7 bits from byte[10], then 7 bits from byte[11]
        int errorLineHigh = (data[39] & 0xFF) >> 5 & 0x03;
        int errorLineMid = data[10] & 0x7F;
        int errorLineLow = data[11] & 0x7F;
        deviceData.setErrorLineNbr((errorLineHigh << 14) | (errorLineMid << 7) | errorLineLow);

        // ErrorCode: 1 bit from byte[40] bit 6, then 7 bits from byte[12]
        int errorCodeHigh = (data[40] & 0xFF) >> 6 & 0x01;
        int errorCodeLow = data[12] & 0x7F;
        deviceData.setErrorCode((errorCodeHigh << 7) | errorCodeLow);

        // Operating hours: uses 3 bytes with super high bits
        int operatingHoursSuperHigh = getLowBits(data[40] & 0xFF, 4);
        int operatingHours = lowPlusHighSuper(data[14] & 0xFF, data[15] & 0xFF, operatingHoursSuperHigh);
        deviceData.setOperatingHours(operatingHours);

        // RSSI: full byte at position 47, signed (Python reference uses byte[47] always)
        int rssiRaw = (47 < data.length) ? (data[47] & 0xFF) : 0;
        deviceData.setRssi(asSigned(rssiRaw, 8));

        // Efficiency calculations
        double tempExtract = deviceData.getTempExtract();
        double tempOutdoor = deviceData.getTempOutdoor();
        double tempSupply = deviceData.getTempSupply();

        if (tempExtract - tempOutdoor < 2) {
            deviceData.setEnergySavings(0);
        } else {
            deviceData.setEnergySavings((int) Math.round((airFlow * (tempSupply - tempOutdoor)) / 3 + 0.5));
        }

        if (airFlow == 0 || tempExtract - tempOutdoor < 2) {
            deviceData.setHeatRecovery(100);
        } else {
            double recovery = 100 * (1 - (tempExtract - tempSupply) / (tempExtract - tempOutdoor));
            deviceData.setHeatRecovery((int) Math.round(recovery + 0.5));
        }

        return deviceData;
    }

    /**
     * Get the N lowest bits from a byte value as-is (not reversed).
     */
    private int getLowBits(int byteVal, int numBits) {
        return byteVal & ((1 << numBits) - 1);
    }

    /**
     * Combine low byte (7 bits) and high bits into a value.
     * Matches JavaScript lowPlusHigh function.
     *
     * Low byte contributes its 7 LSB bits (positions 0-6).
     * High bits are shifted to positions 7+.
     */
    private int lowPlusHigh(int lowByte, int highBits) {
        int lowValue = lowByte & 0x7F;
        return (highBits << 7) | lowValue;
    }

    /**
     * Combine low, high, and super-high bytes for larger values.
     */
    private int lowPlusHighSuper(int low, int high, int superHigh) {
        // Each contributes 7 bits
        int lowBits = low & 0x7F;
        int highBits = high & 0x7F;
        return (superHigh << 14) | (highBits << 7) | lowBits;
    }

    /**
     * Convert unsigned value to signed using two's complement.
     */
    private int asSigned(int value, int bits) {
        int maxUnsigned = 1 << bits;
        if (value >= maxUnsigned / 2) {
            return value - maxUnsigned;
        }
        return value;
    }

    /**
     * Calculate filter status based on fan RPM and lookup table.
     * Returns 1-4 scale (1=new, 4=full) or null if not determinable.
     * Note: When RPM is below baseline threshold, we cannot determine filter status
     * (the original JS returns 100 as a sentinel value for this case).
     */
    private @Nullable Integer calculateFilterStatus(int fanRpm, int fanSpeed, int[][] filterRpms) {
        int fanSpeedPercent = fanSpeed * 10;

        for (int[] entry : filterRpms) {
            if (entry[0] < fanSpeedPercent) {
                continue;
            }

            int diff = entry[2] - entry[1];
            if (fanRpm < entry[1] - diff / 2) {
                // RPM too low to determine filter status (JS returns 100 here)
                return null;
            }
            if (fanRpm < entry[1] + diff * 0.4) {
                return 1;
            }
            if (fanRpm < entry[1] + diff * 0.7) {
                return 2;
            }
            if (fanRpm < entry[1] + diff * 0.95) {
                return 3;
            }
            return 4;
        }

        return null;
    }

    private byte[] hexStringToByteArray(String hex) {
        int len = hex.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(hex.charAt(i), 16) << 4)
                    + Character.digit(hex.charAt(i + 1), 16));
        }
        return data;
    }
}
