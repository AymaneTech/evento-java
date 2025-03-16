package com.aymanetech.event.common.util;

import java.net.URI;

public class UriUtil {

    public static <T> URI getUri(String baseUrl, T id) {
        return URI.create(String.format("/%s/%s", baseUrl, id));
    }
}
