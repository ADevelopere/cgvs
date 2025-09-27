"use client";

import * as React from "react";
import createCache, { StylisPlugin } from "@emotion/cache";
import { CacheProvider as DefaultCacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { useState, useEffect } from "react";
import { useAppTheme } from "@/contexts/ThemeContext";

type AppRouterCacheProviderProps = {
    options?: {
        key?: string;
        enableCssLayer?: boolean;
        nonce?: string;
        stylisPlugins?: StylisPlugin[] | undefined;
    };
    CacheProvider?: typeof DefaultCacheProvider;
    children: React.ReactNode;
    initialLanguage?: string;
};

const rtlCache = createCache({
    key: "rtl-mui",
    stylisPlugins: [prefixer, rtlPlugin],
});
const ltrCache = createCache({ key: "mui", stylisPlugins: [prefixer] });

/**
 * Emotion works OK without this provider, but it's recommended to use this provider to improve performance.
 * Without it, Emotion will generate a new <style> tag during SSR for every component.
 * See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153 for why it's a problem.
 */
export default function AppRouterCacheProvider(
    props: AppRouterCacheProviderProps,
) {
    const { options, CacheProvider = DefaultCacheProvider, children } = props;
    const { isRtl } = useAppTheme();
    const [cache, setCache] = useState(() => (isRtl ? rtlCache : ltrCache));
    useEffect(() => {
        setCache(isRtl ? rtlCache : ltrCache);
    }, [isRtl]);

    const [registry] = useState(() => {
        const prevInsert = cache.insert;
        let inserted: { name: string; isGlobal: boolean }[] = [];

        cache.insert = (...args) => {
            if (options?.enableCssLayer) {
                args[1].styles = `@layer mui {${args[1].styles}}`;
            }
            const [selector, serialized] = args;
            if (cache.inserted[serialized.name] === undefined) {
                inserted.push({
                    name: serialized.name,
                    isGlobal: !selector,
                });
            }
            return prevInsert(...args);
        };

        const flush = () => {
            const prevInserted = inserted;
            inserted = [];
            return prevInserted;
        };

        return {
            cache,
            flush,
        };
    });

    useServerInsertedHTML(() => {
        const inserted = registry.flush();
        if (inserted.length === 0) {
            return null;
        }
        let styles = "";
        let dataEmotionAttribute = registry.cache.key;
        const globals: { name: string; style: string }[] = [];
        inserted.forEach(({ name, isGlobal }) => {
            const style = registry.cache.inserted[name];
            if (typeof style === "string") {
                if (isGlobal) {
                    globals.push({
                        name,
                        style,
                    });
                } else {
                    styles += style;
                    dataEmotionAttribute += ` ${name}`;
                }
            }
        });
        return /*#__PURE__*/ _jsxs(React.Fragment, {
            children: [
                globals.map(({ name, style }) =>
                    /*#__PURE__*/ _jsx(
                        "style",
                        {
                            nonce: options?.nonce,
                            "data-emotion": `${registry.cache.key}-global ${name}`,
                            dangerouslySetInnerHTML: {
                                __html: style,
                            },
                        },
                        name,
                    ),
                ),
                styles &&
                    /*#__PURE__*/ _jsx("style", {
                        nonce: options?.nonce,
                        "data-emotion": dataEmotionAttribute,
                        dangerouslySetInnerHTML: {
                            __html: styles,
                        },
                    }),
            ],
        });
    });
    return /*#__PURE__*/ _jsx(CacheProvider, {
        value: cache, // Use cache directly instead of registry.cache
        children: children,
    });
}
