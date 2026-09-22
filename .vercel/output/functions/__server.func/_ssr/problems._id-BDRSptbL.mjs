import { _ as Link, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Page } from "./shell-CtTFp-Fl.mjs";
import { n as Route$2 } from "./router-DOMSjLsP.mjs";
import { t as Badge } from "./badge-BIaEEku-.mjs";
import { i as statusLabel, r as categoryLabel } from "./categories-DxhXwv1q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/problems._id-BDRSptbL.js
var import_jsx_runtime = require_jsx_runtime();
function ProblemDetail() {
	const data = Route$2.useLoaderData();
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This problem was not found." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/problems",
		className: "mt-4 inline-block text-sm underline",
		children: "Back to board"
	})] });
	const { problem, events, evidenceCount, interestCount } = data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/problems",
			className: "text-sm text-muted underline",
			children: "All problems"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex flex-wrap gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: categoryLabel(problem.category) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					className: "capitalize",
					children: statusLabel(problem.status)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					className: "capitalize",
					children: [problem.priority, " priority"]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-4 font-display text-4xl text-ink",
			children: problem.title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 max-w-2xl text-muted",
			children: problem.summary
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
			className: "mt-8 grid gap-4 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
					label: "Location",
					value: `${problem.locality ?? "—"}, ${problem.district ?? "Jharkhand"}`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
					label: "Citizen reports",
					value: String(evidenceCount || problem.report_count)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
					label: "University interest",
					value: String(interestCount)
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-xs text-subtle",
			children: "Private citizen information is not shown on public problem pages."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-10 font-display text-2xl text-ink",
			children: "Lifecycle"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "mt-4 space-y-3",
			children: events.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-md border border-border bg-surface px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium text-fg",
						children: e.kind
					}),
					e.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 text-sm text-muted",
						children: e.note
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 text-xs text-subtle",
						children: e.created_at
					})
				]
			}, e.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 flex flex-wrap gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/university",
				className: "rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-fg",
				children: "University workspace"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/officer",
				className: "rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium",
				children: "Officer workspace"
			})]
		})
	] });
}
function Meta({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-surface p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 text-sm font-medium",
			children: value
		})]
	});
}
//#endregion
export { ProblemDetail as component };
