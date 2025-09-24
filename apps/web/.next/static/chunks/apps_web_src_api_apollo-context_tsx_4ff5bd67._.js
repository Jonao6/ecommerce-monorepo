(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/apps/web/src/api/apollo-context.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "ApolloContext": (()=>ApolloContext)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_d05a888aae026540d4ecc54e39d02b79$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.3_@babel+core@7.2_d05a888aae026540d4ecc54e39d02b79/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_d05a888aae026540d4ecc54e39d02b79$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.3_@babel+core@7.2_d05a888aae026540d4ecc54e39d02b79/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$apollo$2b$client$40$4$2e$0$2e$5_graphq_ce049ebab6b7b32bde04cae06d734544$2f$node_modules$2f40$apollo$2f$client$2f$link$2f$http$2f$HttpLink$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@apollo+client@4.0.5_graphq_ce049ebab6b7b32bde04cae06d734544/node_modules/@apollo/client/link/http/HttpLink.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$apollo$2b$client$2d$integration$2d$_cd906c914e63b838e522a12283b1cdce$2f$node_modules$2f40$apollo$2f$client$2d$integration$2d$nextjs$2f$dist$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@apollo+client-integration-_cd906c914e63b838e522a12283b1cdce/node_modules/@apollo/client-integration-nextjs/dist/index.browser.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$apollo$2b$client$2d$integration$2d$_cd906c914e63b838e522a12283b1cdce$2f$node_modules$2f40$apollo$2f$client$2d$integration$2d$nextjs$2f$dist$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@apollo+client-integration-_cd906c914e63b838e522a12283b1cdce/node_modules/@apollo/client-integration-nextjs/dist/index.browser.js [app-client] (ecmascript) <locals>");
'use client';
;
;
;
function makeClient() {
    const httpLink = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$apollo$2b$client$40$4$2e$0$2e$5_graphq_ce049ebab6b7b32bde04cae06d734544$2f$node_modules$2f40$apollo$2f$client$2f$link$2f$http$2f$HttpLink$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HttpLink"]({
        uri: ("TURBOPACK compile-time value", "http://localhost:4000/graphql") || 'http://localhost:4000/graphql'
    });
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$apollo$2b$client$2d$integration$2d$_cd906c914e63b838e522a12283b1cdce$2f$node_modules$2f40$apollo$2f$client$2d$integration$2d$nextjs$2f$dist$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ApolloClient"]({
        cache: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$apollo$2b$client$2d$integration$2d$_cd906c914e63b838e522a12283b1cdce$2f$node_modules$2f40$apollo$2f$client$2d$integration$2d$nextjs$2f$dist$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["InMemoryCache"](),
        link: httpLink
    });
}
function ApolloContext({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_d05a888aae026540d4ecc54e39d02b79$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$apollo$2b$client$2d$integration$2d$_cd906c914e63b838e522a12283b1cdce$2f$node_modules$2f40$apollo$2f$client$2d$integration$2d$nextjs$2f$dist$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ApolloNextAppProvider"], {
        makeClient: makeClient,
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/web/src/api/apollo-context.tsx",
        lineNumber: 23,
        columnNumber: 3
    }, this);
}
_c = ApolloContext;
var _c;
__turbopack_context__.k.register(_c, "ApolloContext");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=apps_web_src_api_apollo-context_tsx_4ff5bd67._.js.map