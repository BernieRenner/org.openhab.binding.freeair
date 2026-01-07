# FreeAir Binding

This binding integrates bluMartin FreeAir ventilation systems with openHAB via the FreeAir Connect cloud service.
It allows monitoring of temperatures, humidity, CO2, air pressure, fan speeds, filter status, and control of ventilation modes.

This is an example of items in a sitemap:

![Sitemap Sample](sitemap.sample.png)

## Prerequisites

### FreeAir Connect Registration

Your freeAir 100 device must be registered at [https://www.freeair-connect.de](https://www.freeair-connect.de) before using this binding.
The serial number and password from your FreeAir Connect account are required to configure the binding.

### Java Cryptography Extension (JCE) Unlimited Strength Policy

**Important:** FreeAir devices with firmware version 2.14 and higher use AES-256 encryption.
Java requires the unlimited strength cryptography policy to be enabled for AES-256 to work.

#### Docker Installation

If running openHAB in Docker, set the environment variable:

```
CRYPTO_POLICY=unlimited
```

Example docker-compose.yml:

```yaml
services:
  openhab:
    image: openhab/openhab:latest
    environment:
      - CRYPTO_POLICY=unlimited
```

#### Manual/Package Installation

For Java 8u161+ and Java 11+, unlimited cryptography is enabled by default.
If you encounter "Illegal key size" errors, edit `$JAVA_HOME/conf/security/java.security` and ensure:

```
crypto.policy=unlimited
```

## Supported Things

- `device`: FreeAir ventilation device connected via FreeAir Connect cloud

Tested with firmware versions:

- 2.9.0 (AES-128 encryption)
- 2.14.0 (AES-256 encryption)
- 2.22.0 (AES-256 encryption)

## Discovery

Auto-discovery is not supported.
Devices must be configured manually using the serial number and password from your FreeAir Connect account.

## Thing Configuration

| Name            | Type    | Description                                  | Default | Required |
|-----------------|---------|----------------------------------------------|---------|----------|
| serialNumber    | text    | Serial number of the FreeAir device          | N/A     | yes      |
| password        | text    | Password for the FreeAir Connect account     | N/A     | yes      |
| refreshInterval | integer | Interval to poll data from the cloud (sec)   | 600     | no       |

## Channels

Channels are organized into groups for easier navigation.

### Temperature Group

| Channel                       | Type               | Description                          |
|-------------------------------|--------------------|--------------------------------------|
| temperature#tempOutdoor       | Number:Temperature | Outdoor air temperature              |
| temperature#tempSupply        | Number:Temperature | Supply air temperature               |
| temperature#tempExtract       | Number:Temperature | Extract air temperature              |
| temperature#tempExhaust       | Number:Temperature | Exhaust air temperature              |
| temperature#tempVirtSupExit   | Number:Temperature | Virtual supply exit temperature      |

### Humidity Group

| Channel                       | Type                 | Description                        |
|-------------------------------|----------------------|------------------------------------|
| humidity#humidityOutdoor      | Number:Dimensionless | Outdoor relative humidity (%)      |
| humidity#humidityExtract      | Number:Dimensionless | Extract air relative humidity (%)  |

### Air Quality Group

| Channel                       | Type             | Description                          |
|-------------------------------|------------------|--------------------------------------|
| airQuality#co2Extract         | Number:Dimensionless | CO2 level in extract air (ppm)   |
| airQuality#airPressure        | Number:Pressure  | Atmospheric pressure (hPa)           |

### Ventilation Group

| Channel                       | Type   | Description                          |
|-------------------------------|--------|--------------------------------------|
| ventilation#fanSpeed          | Number | Fan speed level (0-10)               |
| ventilation#fanSpeedSupply    | Number | Supply fan speed (RPM)               |
| ventilation#fanSpeedExtract   | Number | Extract fan speed (RPM)              |
| ventilation#airFlow           | Number | Current air flow (m³/h)              |
| ventilation#airFlowAvg        | Number | Average air flow (m³/h)              |
| ventilation#ventPosExtract    | Number | Extract vent position (0-31)         |
| ventilation#ventPosBath       | Number | Bathroom vent position (0-31)        |
| ventilation#ventPosSupply     | Number | Supply vent position (0-31)          |
| ventilation#ventPosBypass     | Number | Bypass vent position (0-31)          |

### Filter Group

| Channel                              | Type        | Description                          |
|--------------------------------------|-------------|--------------------------------------|
| filter#filterSupplyFull              | Switch      | Supply filter is full (ON/OFF)       |
| filter#filterExtractFull             | Switch      | Extract filter is full (ON/OFF)      |
| filter#filterStatusSupply            | Number      | Supply filter status (1-4 scale)     |
| filter#filterStatusExtract           | Number      | Extract filter status (1-4 scale)    |
| filter#filterStatusSupplyDescription | String      | Supply filter condition description  |
| filter#filterStatusExtractDescription| String      | Extract filter condition description |
| filter#filterHours                   | Number:Time | Filter operating hours               |

**Filter Status values:**

| Value | Label    | Description                                    |
|-------|----------|------------------------------------------------|
| 1     | New      | Filter is clean (~0-40% of expected RPM range) |
| 2     | Light    | Filter is lightly used (~40-70% of range)      |
| 3     | Moderate | Filter is moderately dirty (~70-95% of range)  |
| 4     | Full     | Filter needs replacement (>95% of range)       |

Note: Filter status is calculated from fan RPM. When the fan is off or at very low speed,
the status cannot be determined and will show as UNDEF. The `filterSupplyFull` and
`filterExtractFull` switches provide direct device flags that are always available.

### Control Group

| Channel                       | Type   | Read/Write | Description                    |
|-------------------------------|--------|------------|--------------------------------|
| control#comfortLevel          | Number | RW         | Comfort level setting (1-5)    |
| control#operationMode         | String | RW         | Operation mode (see below)     |
| control#controlAuto           | String | R          | Current automatic control mode |

**Operation Mode values:**

- `comfort` - Normal comfort mode
- `sleep` - Sleep/quiet mode
- `turbo` - High ventilation mode
- `turbo_cool` - Turbo cooling mode

**Auto Control Mode values (read-only):**

- `min_ventilation` - Minimum ventilation
- `humidity_reduction_rel` - Humidity reduction (relative)
- `humidity_reduction_abs` - Humidity reduction (absolute)
- `active_cooling` - Active cooling
- `co2_reduction` - CO2 reduction
- `water_insertion` - Water insertion
- `outdoor_temp_lt_22_degc` - Outdoor temp < -22°C
- `humidity_input` - Humidity input

### Features Group

| Channel                       | Type   | Description                          |
|-------------------------------|--------|--------------------------------------|
| features#humidityReductionMode| Switch | Humidity reduction mode active       |
| features#summerCooling        | Switch | Summer cooling active                |
| features#deicing              | Switch | Deicing/defrost active               |

### Diagnostics Group

| Channel                       | Type        | Description                          |
|-------------------------------|-------------|--------------------------------------|
| diagnostics#errorState        | Number      | Device error state code              |
| diagnostics#errorText         | String      | Human-readable error description     |
| diagnostics#operatingHours    | Number:Time | Total operating hours                |
| diagnostics#rssi              | Number      | Wireless signal strength (dBm)       |
| diagnostics#lastUpdated       | DateTime    | When device last sent data to cloud  |
| diagnostics#lastFetched       | DateTime    | When data was last fetched by binding|

### Efficiency Group

| Channel                       | Type                 | Description                    |
|-------------------------------|----------------------|--------------------------------|
| efficiency#energySavings      | Number:Power         | Calculated energy savings (W)  |
| efficiency#heatRecovery       | Number:Dimensionless | Heat recovery efficiency (%)   |

## Full Example

### Thing Configuration

```java
Thing freeair:device:livingroom "FreeAir Living Room" [serialNumber="12345", password="MyPassword", refreshInterval=300]
```

### Item Configuration

```java
// Temperature
Number:Temperature FreeAir_TempOutdoor "Outdoor Temperature [%.1f °C]" {channel="freeair:device:livingroom:temperature#tempOutdoor"}
Number:Temperature FreeAir_TempSupply "Supply Temperature [%.1f °C]" {channel="freeair:device:livingroom:temperature#tempSupply"}
Number:Temperature FreeAir_TempExtract "Extract Temperature [%.1f °C]" {channel="freeair:device:livingroom:temperature#tempExtract"}

// Humidity
Number:Dimensionless FreeAir_HumidityOutdoor "Outdoor Humidity [%.0f %%]" {channel="freeair:device:livingroom:humidity#humidityOutdoor"}
Number:Dimensionless FreeAir_HumidityExtract "Extract Humidity [%.0f %%]" {channel="freeair:device:livingroom:humidity#humidityExtract"}

// Air Quality
Number:Dimensionless FreeAir_CO2 "CO2 Level [%.0f ppm]" {channel="freeair:device:livingroom:airQuality#co2Extract"}
Number:Pressure FreeAir_Pressure "Air Pressure [%.0f hPa]" {channel="freeair:device:livingroom:airQuality#airPressure"}

// Fan
Number FreeAir_FanSpeed "Fan Speed Level [%d]" {channel="freeair:device:livingroom:ventilation#fanSpeed"}
Number FreeAir_FanSupplyRPM "Supply Fan [%.0f rpm]" {channel="freeair:device:livingroom:ventilation#fanSpeedSupply"}
Number FreeAir_FanExtractRPM "Extract Fan [%.0f rpm]" {channel="freeair:device:livingroom:ventilation#fanSpeedExtract"}

// Filter
Switch FreeAir_FilterSupplyFull "Supply Filter Full" {channel="freeair:device:livingroom:filter#filterSupplyFull"}
Switch FreeAir_FilterExtractFull "Extract Filter Full" {channel="freeair:device:livingroom:filter#filterExtractFull"}
Number FreeAir_FilterStatusSupply "Supply Filter Status [%s]" {channel="freeair:device:livingroom:filter#filterStatusSupply"}
Number FreeAir_FilterStatusExtract "Extract Filter Status [%s]" {channel="freeair:device:livingroom:filter#filterStatusExtract"}
String FreeAir_FilterSupplyDesc "Supply Filter [%s]" {channel="freeair:device:livingroom:filter#filterStatusSupplyDescription"}
String FreeAir_FilterExtractDesc "Extract Filter [%s]" {channel="freeair:device:livingroom:filter#filterStatusExtractDescription"}
Number:Time FreeAir_FilterHours "Filter Hours [%.0f h]" {channel="freeair:device:livingroom:filter#filterHours"}

// Control
Number FreeAir_ComfortLevel "Comfort Level [%d]" {channel="freeair:device:livingroom:control#comfortLevel"}
String FreeAir_OperationMode "Operation Mode [%s]" {channel="freeair:device:livingroom:control#operationMode"}

// Diagnostics
Number FreeAir_ErrorState "Error State [%d]" {channel="freeair:device:livingroom:diagnostics#errorState"}
String FreeAir_ErrorText "Error [%s]" {channel="freeair:device:livingroom:diagnostics#errorText"}
Number:Time FreeAir_OperatingHours "Operating Hours [%.0f h]" {channel="freeair:device:livingroom:diagnostics#operatingHours"}
Number FreeAir_RSSI "Signal Strength [%d dBm]" {channel="freeair:device:livingroom:diagnostics#rssi"}
DateTime FreeAir_LastUpdated "Last Cloud Update [%1$tY-%1$tm-%1$td %1$tH:%1$tM]" {channel="freeair:device:livingroom:diagnostics#lastUpdated"}
DateTime FreeAir_LastFetched "Last Fetch [%1$tY-%1$tm-%1$td %1$tH:%1$tM]" {channel="freeair:device:livingroom:diagnostics#lastFetched"}

// Efficiency
Number:Power FreeAir_EnergySavings "Energy Savings [%.0f W]" {channel="freeair:device:livingroom:efficiency#energySavings"}
Number:Dimensionless FreeAir_HeatRecovery "Heat Recovery [%.0f %%]" {channel="freeair:device:livingroom:efficiency#heatRecovery"}
```

### Sitemap Configuration

```perl
sitemap freeair label="FreeAir Ventilation" {
    Frame label="Temperature" {
        Text item=FreeAir_TempOutdoor
        Text item=FreeAir_TempSupply
        Text item=FreeAir_TempExtract
    }
    Frame label="Humidity & Air Quality" {
        Text item=FreeAir_HumidityOutdoor
        Text item=FreeAir_HumidityExtract
        Text item=FreeAir_CO2
        Text item=FreeAir_Pressure
    }
    Frame label="Ventilation" {
        Text item=FreeAir_FanSpeed
        Text item=FreeAir_FanSupplyRPM
        Text item=FreeAir_FanExtractRPM
    }
    Frame label="Filter Status" {
        Text item=FreeAir_FilterSupplyFull
        Text item=FreeAir_FilterExtractFull
        Text item=FreeAir_FilterStatusSupply
        Text item=FreeAir_FilterStatusExtract
        Text item=FreeAir_FilterSupplyDesc
        Text item=FreeAir_FilterExtractDesc
        Text item=FreeAir_FilterHours
    }
    Frame label="Control" {
        Setpoint item=FreeAir_ComfortLevel minValue=1 maxValue=5 step=1
        Selection item=FreeAir_OperationMode mappings=["comfort"="Comfort", "sleep"="Sleep", "turbo"="Turbo", "turbo_cool"="Turbo Cool"]
    }
    Frame label="Diagnostics" {
        Text item=FreeAir_ErrorState
        Text item=FreeAir_ErrorText
        Text item=FreeAir_OperatingHours
        Text item=FreeAir_RSSI
        Text item=FreeAir_LastUpdated
        Text item=FreeAir_LastFetched
    }
    Frame label="Efficiency" {
        Text item=FreeAir_EnergySavings
        Text item=FreeAir_HeatRecovery
    }
}
```


## Troubleshooting

### "Illegal key size" error

This error occurs when Java's cryptography policy restricts key sizes.
FreeAir devices with firmware 2.14+ require AES-256 encryption.

**Solution:** Enable unlimited cryptography policy (see Prerequisites section above).

### Device goes OFFLINE with "Failed to parse device data"

Check the openHAB logs for detailed error messages.
Common causes:

- Incorrect password
- Network connectivity issues to freeair-connect.de
- Encryption key size issue (see above)

### Device shows UNKNOWN status

The binding is attempting to connect.
If it stays in UNKNOWN state, check:

- Serial number is correct
- Password is correct
- Internet connectivity
