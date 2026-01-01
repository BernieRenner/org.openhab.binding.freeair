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

/**
 * The {@link FreeairCommunicationException} is thrown when communication with
 * the FreeAir Connect API fails.
 *
 * @author Bernie Renner - Initial contribution
 */
@NonNullByDefault
public class FreeairCommunicationException extends Exception {

    private static final long serialVersionUID = 1L;

    public FreeairCommunicationException(String message) {
        super(message);
    }

    public FreeairCommunicationException(String message, Throwable cause) {
        super(message, cause);
    }
}
