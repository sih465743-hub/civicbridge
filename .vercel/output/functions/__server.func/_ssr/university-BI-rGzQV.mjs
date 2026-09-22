import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as useCurrentUserState, n as RedirectToSignIn, t as Page } from "./shell-CtTFp-Fl.mjs";
import { f as listPartners, p as listPublicProblems, r as Button, s as expressInterest, u as listMyInterests } from "./router-DOMSjLsP.mjs";
import { t as Badge } from "./badge-BIaEEku-.mjs";
import { t as RoleSwitcher } from "./role-switcher-Ba4MhAbg.mjs";
import { t as Input } from "./input-oyIDZsOG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/university-BI-rGzQV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function UniversityPage() {
	const { user, isPending } = useCurrentUserState();
	const [ready, setReady] = (0, import_react.useState)(false);
	const [problems, setProblems] = (0, import_react.useState)([]);
	const [partners, setPartners] = (0, import_react.useState)([]);
	const [org, setOrg] = (0, import_react.useState)("BIT Mesra");
	const [note, setNote] = (0, import_react.useState)("We can field a student team under NEP community engagement.");
	const [interests, setInterests] = (0, import_react.useState)([]);
	const load = (0, import_react.useCallback)(() => {
		Promise.all([
			listPublicProblems(),
			listPartners(),
			listMyInterests()
		]).then(([p, partners, mine]) => {
			setProblems(p);
			setPartners(partners);
			setInterests(mine.map((i) => ({
				id: i.id,
				title: i.title,
				status: i.status
			})));
		});
	}, []);
	(0, import_react.useEffect)(() => {
		if (ready) load();
	}, [ready, load]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-border/60" }) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	async function claim(problemId) {
		await expressInterest({ data: {
			problemId,
			orgName: org,
			note
		} });
		load();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl text-ink",
			children: "University workspace"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 max-w-2xl text-muted",
			children: "Discover master challenges that match departmental expertise. Interest is logged for admin review — a path toward NEP credits and later CSR pilots."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleSwitcher, {
				needed: "university",
				onReady: (p) => {
					setReady(p.role === "university" || p.role === "admin");
					if (p.org_name) setOrg(p.org_name);
				}
			})
		}),
		ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: org,
					onChange: (e) => setOrg(e.target.value),
					placeholder: "Institution name"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: note,
					onChange: (e) => setNote(e.target.value),
					placeholder: "Why this team"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-10 font-display text-2xl",
				children: "Partner map"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: partners.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: p.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-xs capitalize text-muted",
							children: p.kind
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 text-xs text-subtle",
							children: p.expertise
						})
					]
				}, p.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-10 font-display text-2xl",
				children: "Open challenges"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-3",
				children: problems.filter((p) => p.status !== "resolved" && p.status !== "closed").map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: p.category }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: p.required_expertise })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-2 font-display text-xl",
							children: p.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: p.summary
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-4",
							size: "sm",
							onClick: () => void claim(p.id),
							children: "Express interest"
						})
					]
				}, p.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-10 font-display text-2xl",
				children: "Your interest log"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: interests.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "text-sm text-muted",
					children: [
						i.title,
						" · ",
						i.status
					]
				}, i.id))
			})
		] }) : null
	] });
}
//#endregion
export { UniversityPage as component };
