import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as useCurrentUserState, n as RedirectToSignIn, t as Page } from "./shell-CtTFp-Fl.mjs";
import { _ as updateProblemStatus, p as listPublicProblems, r as Button } from "./router-DOMSjLsP.mjs";
import { t as Badge } from "./badge-BIaEEku-.mjs";
import { t as RoleSwitcher } from "./role-switcher-Ba4MhAbg.mjs";
import { i as statusLabel } from "./categories-DxhXwv1q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/officer-CShSjX50.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OfficerPage() {
	const { user, isPending } = useCurrentUserState();
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [queue, setQueue] = (0, import_react.useState)([]);
	const [note, setNote] = (0, import_react.useState)("");
	const ready = profile?.role === "officer" || profile?.role === "admin";
	const load = (0, import_react.useCallback)(() => {
		listPublicProblems().then(setQueue);
	}, []);
	(0, import_react.useEffect)(() => {
		if (ready) load();
	}, [ready, load]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-border/60" }) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	async function act(id, status) {
		await updateProblemStatus({ data: {
			problemId: id,
			status,
			note
		} });
		setNote("");
		load();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl text-ink",
			children: "Officer workspace"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 max-w-2xl text-muted",
			children: "Work the master-challenge queue. You see the canonical problem, not fifty duplicate tickets."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleSwitcher, {
				needed: "officer",
				onReady: setProfile
			})
		}),
		ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "h-11 w-full rounded-md border border-border bg-surface px-3 text-sm",
				placeholder: "Optional public note for the next status change",
				value: note,
				onChange: (e) => setNote(e.target.value)
			}), queue.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								className: "capitalize",
								children: statusLabel(p.status)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: p.category }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								className: "tabular-nums",
								children: [p.report_count, " reports"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-display text-xl",
						children: p.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: p.summary
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-subtle",
						children: [
							p.locality,
							", ",
							p.district
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: () => void act(p.id, "assigned"),
								children: "Accept"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => void act(p.id, "in_progress"),
								children: "In progress"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: () => void act(p.id, "resolved"),
								children: "Resolve"
							})
						]
					})
				]
			}, p.id))]
		}) : null
	] });
}
//#endregion
export { OfficerPage as component };
