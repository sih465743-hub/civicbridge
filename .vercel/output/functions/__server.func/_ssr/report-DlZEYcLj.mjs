import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as useCurrentUserState, n as RedirectToSignIn, t as Page } from "./shell-CtTFp-Fl.mjs";
import { g as submitCivicReport, r as Button } from "./router-DOMSjLsP.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-CD2dWRQL.mjs";
import { n as Label, r as Textarea, t as Input } from "./input-oyIDZsOG.mjs";
import { n as DISTRICTS } from "./categories-DxhXwv1q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/report-DlZEYcLj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReportPage() {
	const { user, isPending } = useCurrentUserState();
	const [text, setText] = (0, import_react.useState)("");
	const [locality, setLocality] = (0, import_react.useState)("");
	const [district, setDistrict] = (0, import_react.useState)("Ranchi");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [result, setResult] = (0, import_react.useState)(null);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-border/60" }) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		try {
			const out = await submitCivicReport({ data: {
				text,
				locality,
				district,
				source: "web"
			} });
			setResult({
				relationship: out.relationship,
				usedAi: out.usedAi,
				problem: out.problem,
				mergeScore: out.mergeScore
			});
			setText("");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not submit report.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		className: "max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl text-ink",
				children: "Report a civic problem"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted",
				children: "Write it the way you would tell a neighbour. The platform structures, deduplicates and routes it."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => void onSubmit(e),
				className: "mt-8 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "text",
							children: "What is wrong?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "text",
							required: true,
							minLength: 8,
							value: text,
							onChange: (e) => setText(e.target.value),
							placeholder: "There is a water pipe leaking near the school since yesterday…"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "locality",
								children: "Locality / ward / village"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "locality",
								value: locality,
								onChange: (e) => setLocality(e.target.value),
								placeholder: "Ward 4"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "district",
								children: "District"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								id: "district",
								className: "h-11 w-full rounded-md border border-border bg-surface px-3 text-sm",
								value: district,
								onChange: (e) => setDistrict(e.target.value),
								children: DISTRICTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: d,
									children: d
								}, d))
							})]
						})]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-danger",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: busy,
						children: busy ? "Understanding report…" : "Submit report"
					})
				]
			}),
			result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: result.relationship === "same" ? "Attached to an existing master challenge" : "New master challenge opened" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted",
							children: [result.usedAi ? "Structured with Grok." : "Structured with the local civic heuristic (AI key not used).", result.mergeScore ? ` Merge confidence ${result.mergeScore.toFixed(2)}.` : ""]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium text-fg",
							children: result.problem.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: result.problem.summary
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-subtle tabular-nums",
							children: [result.problem.report_count, " citizen reports now sit on this problem."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/problems/$id",
							params: { id: result.problem.id },
							className: "inline-block text-primary underline",
							children: "Open public problem"
						})
					]
				})]
			}) : null
		]
	});
}
//#endregion
export { ReportPage as component };
