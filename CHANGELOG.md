# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-01-05

### Added

- Initial release of the FreeAir binding for openHAB
- Support for FreeAir Connect ventilation units via cloud API
- Manual configuration using FreeAir Connect serial number and password
- Channels for monitoring:
  - Temperature sensors (indoor, outdoor, supply, exhaust)
  - Humidity levels
  - Air quality (CO2, VOC)
  - Ventilation status and fan speeds
  - Filter status and remaining lifetime
  - Frost protection status
  - Service metrics and diagnostics
- Channels for control:
  - Ventilation mode selection
  - Fan speed adjustment
  - Boost mode activation
- AES-128/256 encryption support for secure API communication
- Documentation for Java Cryptography Extension (JCE) unlimited strength policy setup
