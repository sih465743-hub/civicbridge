import { _ as Link, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Badge } from "./badge-BIaEEku-.mjs";
import { i as statusLabel, r as categoryLabel } from "./categories-DxhXwv1q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/problem-card-CbqcJirQ.js
var import_jsx_runtime = require_jsx_runtime();
function ProblemCard({ problem }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/problems/$id",
		params: { id: problem.id },
		className: "block rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-card)] transition-transform duration-150 hover:-translate-y-0.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: categoryLabel(problem.category) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						className: "capitalize",
						children: statusLabel(problem.status)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						className: "capitalize",
						children: problem.priority
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-3 font-display text-xl text-ink",
				children: problem.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 line-clamp-3 text-sm text-muted",
				children: problem.summary
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-4 text-xs text-subtle",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [problem.locality ? `${problem.locality}, ` : "", problem.district ?? "Jharkhand"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "tabular-nums",
					children: [problem.report_count, " citizen reports"]
				})]
			})
		]
	});
}
//#endregion
export { ProblemCard as t };
