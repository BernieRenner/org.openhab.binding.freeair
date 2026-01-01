# FreeAir Connect Binding

This binding connects bluMartin FreeAir ventilation systems through the FreeAir Connect cloud service.
It reads temperatures, humidity, CO2, pressure, ventilation details, filter status, feature flags, diagnostics, and efficiency metrics, and lets you set comfort level and operation mode.

## Features
- Cloud connection to `https://www.freeair-connect.de/` using the device serial number and password.
- Configurable polling interval (default 600 seconds) with automatic channel updates.
- Channel groups for temperature, humidity, air quality, ventilation, filter, control, features, diagnostics, and efficiency.
- Command support for comfort level (1-5) and operation mode (comfort, sleep, turbo, turbo_cool).

## Requirements
- Active FreeAir Connect account.
- FreeAir device serial number and password (same credentials used in the FreeAir Connect web UI).
- Internet connectivity from the openHAB host to the FreeAir Connect endpoints.

## Supported Things
- `freeair:device` - a FreeAir ventilation unit reached via the cloud API.

## Discovery
Auto-discovery is not available.
Create the thing manually.

## Thing Configuration

| Parameter       | Type            | Required | Description                                                         |
|-----------------|-----------------|----------|---------------------------------------------------------------------|
| serialNumber    | text            | yes      | Device serial number shown in FreeAir Connect.                      |
| password        | text            | yes      | FreeAir Connect password for the device.                            |
| refreshInterval | integer (s)     | no       | Polling interval in seconds (default 600); avoid very low values.   |

## Channels

**Temperature**

| Channel UID                 | Item Type          | RW | Description                              |
|-----------------------------|--------------------|----|------------------------------------------|
| temperature#tempOutdoor     | Number:Temperature | R  | Outdoor air temperature.                 |
| temperature#tempSupply      | Number:Temperature | R  | Supply air temperature.                  |
| temperature#tempExtract     | Number:Temperature | R  | Extract air temperature.                 |
| temperature#tempExhaust     | Number:Temperature | R  | Exhaust air temperature.                 |
| temperature#tempVirtSupExit | Number:Temperature | R  | Virtual supply exit temperature.         |

**Humidity**

| Channel UID                 | Item Type              | RW | Description                          |
|-----------------------------|------------------------|----|--------------------------------------|
| humidity#humidityOutdoor    | Number:Dimensionless   | R  | Outdoor relative humidity.           |
| humidity#humidityExtract    | Number:Dimensionless   | R  | Extract air relative humidity.       |

**Air Quality**

| Channel UID                 | Item Type              | RW | Description                      |
|-----------------------------|------------------------|----|----------------------------------|
| airQuality#co2Extract       | Number:Dimensionless   | R  | CO2 level in extract air (ppm).  |
| airQuality#airPressure      | Number:Pressure        | R  | Atmospheric pressure (hPa).      |

**Ventilation**

| Channel UID                 | Item Type | RW | Description                                  |
|-----------------------------|-----------|----|----------------------------------------------|
| ventilation#fanSpeed        | Number    | R  | Fan speed level (0-10).                      |
| ventilation#fanSpeedSupply  | Number    | R  | Supply fan speed (rpm).                      |
| ventilation#fanSpeedExtract | Number    | R  | Extract fan speed (rpm).                     |
| ventilation#airFlow         | Number    | R  | Current air flow (approx m3/h).              |
| ventilation#airFlowAvg      | Number    | R  | Average air flow (approx m3/h).              |
| ventilation#ventPosExtract  | Number    | R  | Extract vent position (0-31).                |
| ventilation#ventPosBath     | Number    | R  | Bathroom vent position (0-31).               |
| ventilation#ventPosSupply   | Number    | R  | Supply vent position (0-31).                 |
| ventilation#ventPosBypass   | Number    | R  | Bypass vent position (0-31).                 |

**Filter**

| Channel UID                 | Item Type    | RW | Description                                      |
|-----------------------------|--------------|----|--------------------------------------------------|
| filter#filterSupplyFull     | Switch       | R  | Supply filter full indicator.                    |
| filter#filterExtractFull    | Switch       | R  | Extract filter full indicator.                   |
| filter#filterStatusSupply   | Number       | R  | Supply filter status (0 empty ... 4 full).       |
| filter#filterStatusExtract  | Number       | R  | Extract filter status (0 empty ... 4 full).      |
| filter#filterHours          | Number:Time  | R  | Filter operating hours.                          |

**Control**

| Channel UID                 | Item Type | RW | Description                                                       |
|-----------------------------|-----------|----|-------------------------------------------------------------------|
| control#comfortLevel        | Number    | RW | Comfort level 1-5.                                                |
| control#operationMode       | String    | RW | Operation mode: comfort, sleep, turbo, turbo_cool.                |
| control#controlAuto         | String    | R  | Active automatic control mode (e.g., humidity_reduction_rel).     |

**Features**

| Channel UID                     | Item Type | RW | Description                          |
|---------------------------------|-----------|----|--------------------------------------|
| features#humidityReductionMode  | Switch    | R  | Humidity reduction mode active.      |
| features#summerCooling          | Switch    | R  | Summer cooling active.               |
| features#deicing                | Switch    | R  | Deicing or defrost active.           |

**Diagnostics**

| Channel UID                    | Item Type    | RW | Description                                          |
|--------------------------------|--------------|----|------------------------------------------------------|
| diagnostics#errorState         | Number       | R  | Error code (0 = none, 22 = maintenance reminder).    |
| diagnostics#operatingHours     | Number:Time  | R  | Total operating hours.                               |
| diagnostics#rssi               | Number:Power | R  | Wi-Fi signal strength (dBm).                         |

**Efficiency**

| Channel UID                    | Item Type                | RW | Description                          |
|--------------------------------|--------------------------|----|--------------------------------------|
| efficiency#energySavings       | Number:Power             | R  | Calculated energy savings (W).       |
| efficiency#heatRecovery        | Number:Dimensionless     | R  | Heat recovery efficiency (%).        |

## Examples

**Thing (freeair.things)**

```
Thing freeair:device:house "FreeAir Ventilation" [ serialNumber="1234567890", password="mySecret", refreshInterval=300 ]
```

**Items (freeair.items)**

```
Number:Temperature Freeair_Temp_Outdoor "Outdoor temp [%.1f %unit%]" { channel="freeair:device:house:temperature#tempOutdoor" }
Number:Temperature Freeair_Temp_Supply "Supply temp [%.1f %unit%]" { channel="freeair:device:house:temperature#tempSupply" }
Number:Dimensionless Freeair_CO2 "CO2 [%.0f ppm]" { channel="freeair:device:house:airQuality#co2Extract" }
Number Freeair_FanSpeed "Fan level [%d]" { channel="freeair:device:house:ventilation#fanSpeed" }
Number Freeair_ComfortLevel "Comfort level [%d]" { channel="freeair:device:house:control#comfortLevel" }
String Freeair_OperationMode "Operation mode [%s]" { channel="freeair:device:house:control#operationMode" }
Switch Freeair_FilterSupplyFull "Supply filter full [%s]" { channel="freeair:device:house:filter#filterSupplyFull" }
```

**Sitemap (freeair.sitemap)**

```
sitemap freeair label="FreeAir"
{
  Frame label="Temperatures" {
    Text item=Freeair_Temp_Outdoor
    Text item=Freeair_Temp_Supply
  }
  Frame label="Air quality" {
    Text item=Freeair_CO2
  }
  Frame label="Ventilation" {
    Text item=Freeair_FanSpeed
    Setpoint item=Freeair_ComfortLevel minValue=1 maxValue=5 step=1
    Selection item=Freeair_OperationMode mappings=[comfort="Comfort", sleep="Sleep", turbo="Turbo", turbo_cool="Turbo Cool"]
  }
  Frame label="Filter" {
    Text item=Freeair_FilterSupplyFull
  }
}
```

## Notes
- The binding logs in to the FreeAir Connect cloud for each poll; keep `refreshInterval` conservative to avoid throttling.
- Only `control#comfortLevel` and `control#operationMode` accept commands; all other channels are read-only.
- Errors reported by the device surface via `diagnostics#errorState`; check FreeAir documentation for code meanings.
