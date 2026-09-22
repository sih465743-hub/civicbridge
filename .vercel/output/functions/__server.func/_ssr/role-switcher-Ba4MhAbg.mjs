import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as getMyProfile, h as setMyRole, r as Button } from "./router-DOMSjLsP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/role-switcher-Ba4MhAbg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ROLES = [
	{
		id: "citizen",
		label: "Citizen"
	},
	{
		id: "officer",
		label: "Officer"
	},
	{
		id: "university",
		label: "University"
	},
	{
		id: "admin",
		label: "Admin"
	}
];
function RoleSwitcher({ needed, onReady }) {
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		getMyProfile().then((p) => {
			if (cancelled) return;
			setProfile(p);
			if (p) onReady?.(p);
		}).catch(() => {
			if (!cancelled) setError("Could not load profile.");
		});
		return () => {
			cancelled = true;
		};
	}, [needed]);
	async function adopt() {
		setBusy(true);
		setError(null);
		try {
			await setMyRole({ data: { role: needed } });
			const next = await getMyProfile();
			setProfile(next);
			if (next) onReady?.(next);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Could not switch workspace.");
		} finally {
			setBusy(false);
		}
	}
	if (!profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: error ?? "Loading workspace…"
	});
	if (profile.role === needed || profile.role === "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-sm text-muted",
		children: [
			"Signed in as ",
			ROLES.find((r) => r.id === profile.role)?.label,
			"."
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-surface p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-fg",
				children: [
					"This workspace is for ",
					needed,
					"s. Your current role is ",
					profile.role,
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-3",
				size: "sm",
				disabled: busy,
				onClick: () => void adopt(),
				children: busy ? "Switching…" : `Enter as ${needed}`
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-danger",
				children: error
			}) : null
		]
	});
}
//#endregion
export { RoleSwitcher as t };
