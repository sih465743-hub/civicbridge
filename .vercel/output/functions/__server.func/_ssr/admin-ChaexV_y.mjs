import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as useCurrentUserState, n as RedirectToSignIn, t as Page } from "./shell-CtTFp-Fl.mjs";
import { l as listAllInterests, m as reviewInterest, o as dashboardStats, r as Button } from "./router-DOMSjLsP.mjs";
import { t as Badge } from "./badge-BIaEEku-.mjs";
import { t as RoleSwitcher } from "./role-switcher-Ba4MhAbg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-ChaexV_y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPage() {
	const { user, isPending } = useCurrentUserState();
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [stats, setStats] = (0, import_react.useState)(null);
	const [interests, setInterests] = (0, import_react.useState)([]);
	const ready = profile?.role === "admin";
	const load = (0, import_react.useCallback)(() => {
		Promise.all([dashboardStats(), listAllInterests()]).then(([s, i]) => {
			setStats(s);
			setInterests(i);
		});
	}, []);
	(0, import_react.useEffect)(() => {
		if (ready) load();
	}, [ready, load]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-border/60" }) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl text-ink",
			children: "Admin operations"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-muted",
			children: "Monitor problem formation, university interest, and civic volume. AI recommends; people decide."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleSwitcher, {
				needed: "admin",
				onReady: setProfile
			})
		}),
		ready && stats ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid grid-cols-2 gap-3 md:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
						n: stats.problems,
						label: "Problems"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
						n: stats.reports,
						label: "Reports"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
						n: stats.open,
						label: "Open"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
						n: stats.duplicatesAbsorbed,
						label: "Merged"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
						n: stats.citizensRepresented,
						label: "Citizens"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-10 font-display text-2xl",
				children: "University interest review"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-3",
				children: interests.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "No interest filings yet."
				}) : interests.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: i.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium",
								children: i.org_name
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: i.title
						}),
						i.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-subtle",
							children: i.note
						}) : null,
						i.status === "proposed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: () => void reviewInterest({ data: {
									id: i.id,
									status: "accepted"
								} }).then(load),
								children: "Accept"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => void reviewInterest({ data: {
									id: i.id,
									status: "rejected"
								} }).then(load),
								children: "Reject"
							})]
						}) : null
					]
				}, i.id))
			})
		] }) : null
	] });
}
function Tile({ n, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-surface p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-display text-2xl tabular-nums",
			children: n
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs text-muted",
			children: label
		})]
	});
}
//#endregion
export { AdminPage as component };
