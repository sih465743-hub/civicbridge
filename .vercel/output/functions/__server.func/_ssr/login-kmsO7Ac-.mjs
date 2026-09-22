import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import "./client-BzrKyXF3.mjs";
import "./server-Do1Krn2e.mjs";
import { t as Page } from "./shell-CtTFp-Fl.mjs";
import "./router-DOMSjLsP.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-CD2dWRQL.mjs";
import "./input-oyIDZsOG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-kmsO7Ac-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function grokHost() {
	if (typeof window === "undefined") return false;
	const host = window.location.hostname;
	return host.endsWith(".grok-sandbox.com") || host.endsWith(".grok.com");
}
function Login() {
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)(false);
	grokHost();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, {
		className: "grid min-h-[70vh] place-items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "w-full max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-widest text-muted",
				children: "CivicBridge"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: mode === "signup" ? "Create an account" : "Sign in to report and act" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Citizens submit reports. Officers update status. Universities claim problems. Your reports stay attached to your account."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-md border border-border bg-surface px-3 py-2 text-sm text-muted",
						children: "Local demo mode is on. You are already signed in as Dev User. Remove VITE_AUTH_ENABLED=false from .env and restart to use real email accounts."
					}),
					null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "block pt-1 text-sm text-muted underline",
						children: "Back to home"
					})
				]
			})]
		})
	});
}
//#endregion
export { Login as component };
