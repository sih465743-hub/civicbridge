import { _ as Link, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Route, c as Layers, i as Shield, l as ArrowRight, n as Users, o as MessageCircle } from "../_libs/lucide-react.mjs";
import { t as Page } from "./shell-CtTFp-Fl.mjs";
import { a as Route$12, r as Button } from "./router-DOMSjLsP.mjs";
import { t as ProblemCard } from "./problem-card-CbqcJirQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C4Vt6U7T.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const { stats, problems } = Route$12.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		className: "py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.2em] text-muted",
						children: "SIH 26043 · Smart Education · Jharkhand"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 max-w-3xl font-display text-4xl text-ink sm:text-5xl",
						children: "Tell us what is wrong. We turn it into a problem the right people can act on."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 max-w-xl text-base text-muted",
						children: "CivicBridge is a civic problem operating system. Citizens speak in ordinary language. AI structures the report. Duplicates become one master challenge. Officers, universities and industry take it from there."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-7 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/report",
								children: ["File a report ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/problems",
								children: "View master challenges"
							})
						})]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "grid grid-cols-2 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							n: stats.problems,
							label: "Master challenges"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							n: stats.reports,
							label: "Citizen reports"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							n: stats.duplicatesAbsorbed,
							label: "Duplicates absorbed"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							n: stats.citizensRepresented,
							label: "Citizens represented"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-5 w-5" }),
						title: "Observe",
						body: "WhatsApp voice note or a short web report. No app download."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-5 w-5" }),
						title: "Consolidate",
						body: "Fifty complaints about one pump become one master challenge."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, { className: "h-5 w-5" }),
						title: "Route",
						body: "Geography, department rules and expertise decide who acts."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-5 w-5" }),
						title: "Prove",
						body: "Officers update status. Universities attach interest. Citizens see progress."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl text-ink",
						children: "Live master challenges"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Public problem pages never show private citizen identity."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/problems",
						className: "text-sm font-medium text-primary",
						children: "See all"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid gap-4 md:grid-cols-2",
					children: problems.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProblemCard, { problem: p }, p.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mt-16 rounded-xl border border-border bg-surface p-6 sm:p-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mt-1 h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl text-ink",
						children: "Tri-party engine"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-2xl text-sm text-muted",
						children: "Citizens get a zero-friction channel. Government sees unique verified problems instead of ticket noise. Students and universities claim challenges as NEP community-engagement work, with industry CSR as a later funding layer."
					})] })]
				})
			})
		]
	});
}
function Stat({ n, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-surface p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-display text-3xl tabular-nums text-ink",
			children: n
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 text-xs text-muted",
			children: label
		})]
	});
}
function Step({ icon, title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-surface p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-primary",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-3 font-display text-lg text-ink",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: body
			})
		]
	});
}
//#endregion
export { Home as component };
