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

import java.io.IOException;
import java.net.CookieManager;
import java.net.CookiePolicy;
import java.net.URI;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import org.eclipse.jdt.annotation.NonNullByDefault;
import org.eclipse.jdt.annotation.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * The {@link FreeairApiClient} handles communication with the FreeAir Connect cloud API.
 *
 * @author Bernie Renner - Initial contribution
 */
@NonNullByDefault
public class FreeairApiClient {

    private final Logger logger = LoggerFactory.getLogger(FreeairApiClient.class);

    private final String serialNumber;
    private final String password;
    private final HttpClient httpClient;
    private final FreeairDataParser dataParser;

    private @Nullable FreeairDeviceData lastData;
    private @Nullable String lastErrorText;
    private boolean loggedIn = false;

    public FreeairApiClient(String serialNumber, String password) {
        this.serialNumber = serialNumber;
        this.password = password;
        this.dataParser = new FreeairDataParser(password);

        // Create HTTP client with cookie support for session management
        CookieManager cookieManager = new CookieManager();
        cookieManager.setCookiePolicy(CookiePolicy.ACCEPT_ALL);

        this.httpClient = HttpClient.newBuilder()
                .cookieHandler(cookieManager)
                .connectTimeout(Duration.ofSeconds(30))
                .build();
    }

    /**
     * Login to the FreeAir Connect API.
     * This performs a two-step login: first sending the serial number, then the password.
     */
    public boolean login() throws FreeairCommunicationException {
        try {
            // Step 1: Send serial number
            HttpRequest request1 = HttpRequest.newBuilder()
                    .uri(URI.create(LOGIN_URL))
                    .timeout(Duration.ofSeconds(30))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(
                            "serialnumber=" + URLEncoder.encode(serialNumber, StandardCharsets.UTF_8)))
                    .build();

            HttpResponse<String> response1 = httpClient.send(request1, HttpResponse.BodyHandlers.ofString());
            logger.trace("Login step 1 response status: {}", response1.statusCode());
            if (response1.statusCode() != 200) {
                loggedIn = false;
                throw new FreeairCommunicationException(
                        "Login step 1 failed with status: " + response1.statusCode());
            }

            // Step 2: Send password
            HttpRequest request2 = HttpRequest.newBuilder()
                    .uri(URI.create(LOGIN_URL))
                    .timeout(Duration.ofSeconds(30))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(
                            "serial_password=" + URLEncoder.encode(password, StandardCharsets.UTF_8)))
                    .build();

            HttpResponse<String> response2 = httpClient.send(request2, HttpResponse.BodyHandlers.ofString());
            logger.trace("Login step 2 response status: {}", response2.statusCode());
            if (response2.statusCode() != 200) {
                loggedIn = false;
                throw new FreeairCommunicationException(
                        "Login step 2 failed with status: " + response2.statusCode());
            }

            // Verify login success by checking response content for specific error messages
            String responseBody = response2.body();
            if (responseBody != null) {
                String lowerBody = responseBody.toLowerCase();
                // Check for specific login failure indicators
                if (lowerBody.contains("wrong password") || lowerBody.contains("invalid password")
                        || lowerBody.contains("falsches passwort") || lowerBody.contains("login failed")
                        || lowerBody.contains("authentication failed")) {
                    loggedIn = false;
                    throw new FreeairCommunicationException("Login failed: invalid credentials");
                }
            }

            loggedIn = true;
            logger.debug("Successfully logged in to FreeAir Connect for serial {}", serialNumber);
            return true;
        } catch (IOException | InterruptedException e) {
            loggedIn = false;
            if (e instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            throw new FreeairCommunicationException("Login failed: " + e.getMessage(), e);
        }
    }

    /**
     * Ensure we are logged in, performing login if necessary.
     */
    private void ensureLoggedIn() throws FreeairCommunicationException {
        if (!loggedIn) {
            login();
        }
    }

    /**
     * Invalidate the current session, forcing a new login on next request.
     */
    public void invalidateSession() {
        loggedIn = false;
    }

    /**
     * Fetch data from the FreeAir device.
     * This will login first if necessary.
     */
    public @Nullable FreeairDeviceData fetchData() throws FreeairCommunicationException {
        try {
            // Ensure we are logged in (only logs in if needed)
            ensureLoggedIn();

            // Fetch encrypted data
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(DATA_URL))
                    .timeout(Duration.ofSeconds(30))
                    .POST(HttpRequest.BodyPublishers.noBody())
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            // Handle session expiry - retry with fresh login
            if (response.statusCode() == 401 || response.statusCode() == 403) {
                logger.debug("Session expired, re-authenticating...");
                loggedIn = false;
                ensureLoggedIn();
                response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            }

            if (response.statusCode() != 200) {
                loggedIn = false;
                throw new FreeairCommunicationException(
                        "Data fetch failed with status: " + response.statusCode());
            }

            String responseBody = response.body();
            if (responseBody == null || responseBody.isEmpty()) {
                loggedIn = false;
                throw new FreeairCommunicationException("No data received from device");
            }

            logger.trace("Response length: {} chars", responseBody.length());

            // Parse the response
            FreeairDeviceData data = dataParser.parse(responseBody);
            if (data != null) {
                lastData = data;
                lastErrorText = null;

                // Clear previous error text so stale messages are not shown when the state recovers
                data.setErrorText(null);
                data.setErrorTextEn("");
                data.setErrorTextDe("");

                // Fetch error text if there's an error
                int errorState = data.getErrorState();
                if (errorState != 0 && errorState != 22) {
                    fetchErrorText(data);
                }
            }

            return data;
        } catch (IOException | InterruptedException e) {
            loggedIn = false;
            if (e instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            throw new FreeairCommunicationException("Data fetch failed: " + e.getMessage(), e);
        }
    }

    /**
     * Fetch error text from the API when device is in error state.
     * Parses the response and stores the error text in the device data.
     */
    private void fetchErrorText(FreeairDeviceData data) {
        try {
            String postData = "serObject=" + URLEncoder.encode(
                    "err=1&serialnumber=" + serialNumber + "&device=1", StandardCharsets.UTF_8);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(ERROR_URL))
                    .timeout(Duration.ofSeconds(30))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(postData))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                String responseBody = response.body();
                logger.debug("Error text raw response ({} chars): '{}'",
                        responseBody != null ? responseBody.length() : 0, responseBody);

                // Parse the response: format is "id_error_type=1&en=...&de=...trans..."
                // The response may contain multiple error entries separated by "trans"
                // We collect all meaningful error messages
                if (responseBody != null && !responseBody.isEmpty()) {
                    StringBuilder allErrorsEn = new StringBuilder();
                    StringBuilder allErrorsDe = new StringBuilder();

                    // Split by "trans" to get individual error entries
                    String[] parts = responseBody.split("trans");
                    for (String part : parts) {
                        if (part.isEmpty()) {
                            continue;
                        }
                        Map<String, String> errorTexts = parseQueryString(part);
                        String en = errorTexts.get("en");
                        String de = errorTexts.get("de");

                        // Skip very short entries (like "fio", "fia") - likely internal codes
                        if (en != null && en.length() > 5) {
                            if (allErrorsEn.length() > 0) {
                                allErrorsEn.append(" | ");
                            }
                            allErrorsEn.append(en);
                        }
                        if (de != null && de.length() > 5) {
                            if (allErrorsDe.length() > 0) {
                                allErrorsDe.append(" | ");
                            }
                            allErrorsDe.append(de);
                        }
                    }

                    String combinedText = null;

                    if (allErrorsEn.length() > 0) {
                        data.setErrorTextEn(allErrorsEn.toString());
                        combinedText = allErrorsEn.toString();
                    }
                    if (allErrorsDe.length() > 0) {
                        data.setErrorTextDe(allErrorsDe.toString());
                        if (combinedText == null) {
                            combinedText = allErrorsDe.toString();
                        }
                    }

                    data.setErrorText(combinedText);
                    lastErrorText = combinedText;

                    logger.debug("Parsed error text - EN: '{}', DE: '{}'",
                            data.getErrorTextEn(), data.getErrorTextDe());
                }
            }
        } catch (IOException | InterruptedException e) {
            if (e instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            logger.warn("Failed to fetch error text: {}", e.getMessage());
        }
    }

    /**
     * Parse a URL-encoded query string into a map.
     */
    private Map<String, String> parseQueryString(String queryString) {
        Map<String, String> result = new HashMap<>();
        String[] pairs = queryString.split("&");
        for (String pair : pairs) {
            int idx = pair.indexOf('=');
            if (idx > 0) {
                String key = pair.substring(0, idx);
                String value = idx < pair.length() - 1 ? pair.substring(idx + 1) : "";
                // URL decode the value
                result.put(key, URLDecoder.decode(value, StandardCharsets.UTF_8));
            }
        }
        return result;
    }

    /**
     * Set the comfort level (1-5).
     */
    public void setComfortLevel(int comfortLevel) throws FreeairCommunicationException {
        if (comfortLevel < 1 || comfortLevel > 5) {
            throw new IllegalArgumentException("Comfort level must be between 1 and 5");
        }

        FreeairDeviceData data = lastData;
        int operationMode = (data != null) ? data.getOperationMode() : 1;
        if (operationMode == 0) {
            operationMode = 1;
        }

        sendControlCommand(comfortLevel, operationMode);
    }

    /**
     * Set the operation mode (1=comfort, 2=sleep, 3=turbo, 4=turbo_cool).
     */
    public void setOperationMode(int operationMode) throws FreeairCommunicationException {
        if (operationMode < 1 || operationMode > 4) {
            throw new IllegalArgumentException("Operation mode must be between 1 and 4");
        }

        FreeairDeviceData data = lastData;
        int comfortLevel = (data != null) ? data.getComfortLevel() : 3;

        sendControlCommand(comfortLevel, operationMode);
    }

    /**
     * Send a control command to set comfort level and operation mode.
     */
    private void sendControlCommand(int comfortLevel, int operationMode) throws FreeairCommunicationException {
        try {
            // Ensure we are logged in (only logs in if needed)
            ensureLoggedIn();

            StringBuilder postData = new StringBuilder();
            postData.append("RB_CL=").append(comfortLevel);
            postData.append("&RB_OM=").append(operationMode);
            postData.append("&srn_button=").append(URLEncoder.encode(serialNumber + "-Test", StandardCharsets.UTF_8));
            postData.append("&lang_button=en");
            postData.append("&serial_password=");

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(CONTROL_URL))
                    .timeout(Duration.ofSeconds(30))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(postData.toString()))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new FreeairCommunicationException(
                        "Control command failed with status: " + response.statusCode());
            }

            logger.debug("Successfully sent control command: comfortLevel={}, operationMode={}",
                    comfortLevel, operationMode);
        } catch (IOException | InterruptedException e) {
            if (e instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            throw new FreeairCommunicationException("Control command failed: " + e.getMessage(), e);
        }
    }

    /**
     * Get the last fetched data (may be null if never fetched or fetch failed).
     */
    public @Nullable FreeairDeviceData getLastData() {
        return lastData;
    }
}
