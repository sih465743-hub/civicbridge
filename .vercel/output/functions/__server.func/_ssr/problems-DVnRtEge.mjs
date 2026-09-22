import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Page } from "./shell-CtTFp-Fl.mjs";
import { i as Route$6 } from "./router-DOMSjLsP.mjs";
import { t as Input } from "./input-oyIDZsOG.mjs";
import { r as categoryLabel, t as CATEGORIES } from "./categories-DxhXwv1q.mjs";
import { t as ProblemCard } from "./problem-card-CbqcJirQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/problems-DVnRtEge.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProblemsPage() {
	const problems = Route$6.useLoaderData();
	const [q, setQ] = (0, import_react.useState)("");
	const [cat, setCat] = (0, import_react.useState)("all");
	const filtered = (0, import_react.useMemo)(() => {
		return problems.filter((p) => {
			if (cat !== "all" && p.category !== cat) return false;
			if (!q.trim()) return true;
			return `${p.title} ${p.summary} ${p.locality} ${p.district}`.toLowerCase().includes(q.toLowerCase());
		});
	}, [
		problems,
		q,
		cat
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl text-ink",
			children: "Master challenges"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 max-w-2xl text-muted",
			children: "A report is one citizen observation. A problem is the underlying civic issue. This board only shows consolidated problems."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 flex flex-col gap-3 sm:flex-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Search locality, school, pump…",
				value: q,
				onChange: (e) => setQ(e.target.value)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: "h-11 rounded-md border border-border bg-surface px-3 text-sm",
				value: cat,
				onChange: (e) => setCat(e.target.value),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "all",
					children: "All categories"
				}), CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: c,
					children: categoryLabel(c)
				}, c))]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-4 text-sm text-subtle tabular-nums",
			children: [filtered.length, " problems"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 grid gap-4 md:grid-cols-2",
			children: filtered.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProblemCard, { problem: p }, p.id))
		})
	] });
}
//#endregion
export { ProblemsPage as component };
