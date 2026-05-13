import { useState, useCallback, useMemo, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid, Legend, ReferenceLine } from "recharts";

/* PRISM v0.8 — Multi-Lens Analysis Platform
 * 9 models, persistent storage, dual demo, full DE/EN i18n
 * License: AGPL-3.0 (Code) / CC BY 4.0 (Companion)
 * Author: Thomas Schüller · Syntagma Forschung · Wien · forschung@tschueller.com · ORCID 0009-0003-9799-6747
 */

// ═══ THEME ═══
const T = {
  bg: "#0C1018", fg: "#CDD6E4", fg2: "#9AADC0", muted: "#5E7085",
  card: "#12181F", card2: "#181F28", card3: "#1E2630",
  border: "#243040", accent: "#4C8BF5",
  red: "#F0553A", orange: "#E5993E", green: "#3ABF7C", cyan: "#38B2CC",
  purple: "#9B6DFF", pink: "#E355A0", lime: "#84CC16",
  r: 8, rs: 5, font: "system-ui, -apple-system, sans-serif",
  mono: "'SF Mono', 'Consolas', monospace",
};

// ═══ MODELS (bilingual) ═══
const M = {
  game_theory: { l: "Game Theory", i: "♟", c: "#4C8BF5", a: { de: "Akteure handeln rational", en: "Actors behave rationally" }, d: { de: "Nash-Gleichgewichte, dominierte Strategien. Gut: klare Akteure. Schlecht: >4 Akteure, Emotionen.", en: "Nash equilibria, dominated strategies. Good: clear actors. Bad: >4 actors, emotions." } },
  prospect_theory: { l: "Prospect Theory", i: "🧠", c: "#E5993E", a: { de: "Verluste wiegen ~2.25× schwerer", en: "Losses weigh ~2.25× more" }, d: { de: "Value Function, Framing. Gut: irrationales Verhalten. Schlecht: rein strategisch.", en: "Value function, framing. Good: irrational behavior. Bad: purely strategic." } },
  bargaining: { l: "Bargaining", i: "🤝", c: "#3ABF7C", a: { de: "BATNAs schätzbar", en: "BATNAs estimable" }, d: { de: "ZOPA, Nash-Lösung, Erstangebote. Gut: bilateral. Schlecht: >3 Parteien.", en: "ZOPA, Nash solution, first offers. Good: bilateral. Bad: >3 parties." } },
  deterrence: { l: "Deterrence", i: "⚡", c: "#F0553A", a: { de: "Drohungen glaubwürdig", en: "Threats must be credible" }, d: { de: "Eskalationsleiter, Abschreckung. Gut: Krisen. Schlecht: Win-Win.", en: "Escalation ladder, deterrence. Good: crises. Bad: win-win." } },
  principal_agent: { l: "Principal-Agent", i: "🔗", c: "#9B6DFF", a: { de: "Agent hat Eigeninteresse", en: "Agent has self-interest" }, d: { de: "Moral Hazard, Monitoring, Anreize. Gut: Delegation. Schlecht: symmetrisch.", en: "Moral hazard, monitoring, incentives. Good: delegation. Bad: symmetric." } },
  system_dynamics: { l: "System Dynamics", i: "🔄", c: "#38B2CC", a: { de: "Kausales Netzwerk", en: "Causal network" }, d: { de: "Feedback-Schleifen, Systemverhalten. Gut: langfristig. Schlecht: kurzfristig.", en: "Feedback loops, system behavior. Good: long-term. Bad: short-term." } },
  scenario_planning: { l: "Scenarios", i: "🔮", c: "#E355A0", a: { de: "Zukunft strukturierbar", en: "Future is structurable" }, d: { de: "2×2-Szenarien, robuste Strategien. Gut: Unsicherheit. Schlecht: klare Daten.", en: "2×2 scenarios, robust strategies. Good: uncertainty. Bad: clear data." } },
  coopetition: { l: "Coopetition", i: "🔀", c: "#84CC16", a: { de: "Kooperation + Konkurrenz", en: "Cooperation + competition" }, d: { de: "Kooperationspotenzial aus Payoff-Matrix. Gut: Win-Win. Schlecht: Nullsumme.", en: "Cooperation potential from payoff matrix. Good: win-win. Bad: zero-sum." } },
  real_options: { l: "Real Options", i: "⏳", c: "#F97316", a: { de: "Warten hat Optionswert", en: "Waiting has option value" }, d: { de: "Volatilität, Wartewert, Staging. Gut: irreversibel. Schlecht: Fenster schließt.", en: "Volatility, wait value, staging. Good: irreversible. Bad: window closing." } },
};
const STAB_L = {
  de: { stable: "Stabil", fragile: "Fragil", unstable: "Instabil" },
  en: { stable: "Stable", fragile: "Fragile", unstable: "Unstable" },
};
const STAB = { stable: { c: T.green }, fragile: { c: T.orange }, unstable: { c: T.red } };
// Bilingual helpers
const sl = (lang, key) => STAB_L[lang]?.[key] || key;
const ma = (lang, m) => typeof m.a === "object" ? (m.a[lang] || m.a.de) : m.a;
const md_ = (lang, m) => typeof m.d === "object" ? (m.d[lang] || m.d.de) : m.d;
const CTYPES = [{ value: "competition", label: "Wettbewerb" }, { value: "negotiation", label: "Verhandlung" }, { value: "crisis", label: "Krise" }, { value: "policy", label: "Policy" }, { value: "escalation", label: "Eskalation" }];
const TFS = [{ value: "short_term", label: "<3M" }, { value: "medium_term", label: "3–12M" }, { value: "long_term", label: ">12M" }];
const ROLES = ["incumbent", "entrant", "regulator", "ally", "adversary", "mediator"];

// ═══ DEMOS ═══
const DEMO_COMPETITION = {
  name: "Markteintritt Wettbewerber Y", type: "competition", timeframe: "medium_term",
  description: "VC-finanziertes Scale-up plant Markteintritt in 3D-Druck-Kernsegment.",
  actors: [
    { id: "sw", name: "Schichtwerk", role: "incumbent", goals: [{ text: "Marktanteil >60%", pr: "critical" }, { text: "Marge >15%", pr: "high" }], actions: [{ id: "sw1", label: "Preis senken", cost: "high" }, { id: "sw2", label: "Differenzieren", cost: "medium" }, { id: "sw3", label: "Abwarten", cost: "low" }, { id: "sw4", label: "Kapazität ausbauen", cost: "high" }], batna: "Nischen (Medizin, Architektur)", refPt: "Aktueller MA ~65%", escCap: 70, cred: 80 },
    { id: "wy", name: "Wettbewerber Y", role: "entrant", goals: [{ text: "10% MA in 18M", pr: "critical" }], actions: [{ id: "wy1", label: "Aggressiver Preis", cost: "high" }, { id: "wy2", label: "Nischen-Fokus", cost: "medium" }, { id: "wy3", label: "Nicht eintreten", cost: "none" }], batna: "CNC/Laser-Markt", refPt: "Null MA — Upside", escCap: 60, cred: 50 },
  ],
  payoffs: { "sw1|wy1": [-25, -35], "sw1|wy2": [-5, 15], "sw1|wy3": [-10, 0], "sw2|wy1": [10, 5], "sw2|wy2": [25, 15], "sw2|wy3": [30, 0], "sw3|wy1": [-40, 30], "sw3|wy2": [-10, 20], "sw3|wy3": [20, -5], "sw4|wy1": [-15, -20], "sw4|wy2": [15, 5], "sw4|wy3": [5, -10] },
  selectedModels: ["game_theory", "prospect_theory", "bargaining", "deterrence", "coopetition", "real_options"],
  assumptions: [{ text: "Y hat VC für 18M", confidence: .65 }, { text: "Qualität ist kaufentscheidend", confidence: .80 }, { text: "Markt wächst 15% p.a.", confidence: .70 }],
  uncertainties: [{ name: "Marktwachstum", low: "Stagnation", high: "Boom (+30%)" }, { name: "Tech-Disruption", low: "Inkrementell", high: "FDM obsolet" }],
  variables: [{ id: "v1", name: "MA Schichtwerk", init: 65 }, { id: "v2", name: "Marge SW", init: 22 }, { id: "v3", name: "MA Wettbewerber", init: 0 }],
  feedbackLoops: [{ from: "v1", to: "v2", type: "pos", delay: 3 }, { from: "v3", to: "v1", type: "neg", delay: 1 }],
};

const DEMO_NEGOTIATION = {
  name: "Tarifverhandlung IT-Dienstleister", type: "negotiation", timeframe: "short_term",
  description: "Tarifverhandlung zwischen IT-Dienstleister und Betriebsrat. Forderung: 8% Gehaltserhöhung. Management bietet 3%.",
  actors: [
    { id: "mg", name: "Management", role: "incumbent", goals: [{ text: "Kosten <5% Steigerung", pr: "critical" }, { text: "Fluktuation verhindern", pr: "high" }], actions: [{ id: "mg1", label: "3% anbieten", cost: "low" }, { id: "mg2", label: "5% + Benefits", cost: "medium" }, { id: "mg3", label: "7% bei Flexibilisierung", cost: "high" }], batna: "Outsourcing-Option", refPt: "Aktuelle Kostenstruktur", escCap: 60, cred: 70 },
    { id: "br", name: "Betriebsrat", role: "adversary", goals: [{ text: "Mind. 6% Erhöhung", pr: "critical" }, { text: "Keine Verschlechterung Arbeitszeit", pr: "high" }], actions: [{ id: "br1", label: "8% fordern", cost: "low" }, { id: "br2", label: "6% + Homeoffice", cost: "medium" }, { id: "br3", label: "Streik androhen", cost: "high" }], batna: "Arbeitskampf / Öffentlichkeit", refPt: "Aktuelles Gehaltsniveau", escCap: 70, cred: 75 },
  ],
  payoffs: { "mg1|br1": [-5, -10], "mg1|br2": [5, -5], "mg1|br3": [-30, -15], "mg2|br1": [-10, 10], "mg2|br2": [15, 20], "mg2|br3": [-20, 5], "mg3|br1": [-15, 15], "mg3|br2": [10, 25], "mg3|br3": [-5, 10] },
  selectedModels: ["game_theory", "prospect_theory", "bargaining", "deterrence"],
  assumptions: [{ text: "Fachkräftemangel gibt BR Verhandlungsmacht", confidence: .85 }, { text: "Streik wäre für beide teuer", confidence: .90 }],
  uncertainties: [{ name: "Arbeitsmarktlage", low: "Entspannung", high: "Verschärfung" }, { name: "Konjunktur", low: "Rezession", high: "Boom" }],
  variables: [], feedbackLoops: [],
};

const EMPTY_CASE = {
  name: "", type: "competition", timeframe: "medium_term", description: "",
  actors: [
    { id: `a${Date.now()}`, name: "", role: "incumbent", goals: [{ text: "", pr: "high" }], actions: [{ id: `x${Date.now()}`, label: "", cost: "medium" }], batna: "", refPt: "", escCap: 50, cred: 50 },
    { id: `b${Date.now()}`, name: "", role: "entrant", goals: [{ text: "", pr: "high" }], actions: [{ id: `y${Date.now()}`, label: "", cost: "medium" }], batna: "", refPt: "", escCap: 50, cred: 50 },
  ],
  payoffs: {}, selectedModels: ["game_theory", "prospect_theory"],
  assumptions: [{ text: "", confidence: .7 }], uncertainties: [], variables: [], feedbackLoops: [],
};

// ═══ ENGINE (unchanged from v5 core, but cleaner) ═══
function findNash(actors, pf) {
  const a1 = actors[0]?.actions?.filter(a => a.label) || [], a2 = actors[1]?.actions?.filter(a => a.label) || [];
  const eq = [], dom = [];
  for (const x of a1) for (const y of a2) {
    const k = `${x.id}|${y.id}`, p = pf[k]; if (!p) continue;
    let br1 = true, br2 = true;
    for (const alt of a1) if (alt.id !== x.id && pf[`${alt.id}|${y.id}`]?.[0] > p[0]) { br1 = false; break; }
    for (const alt of a2) if (alt.id !== y.id && pf[`${x.id}|${alt.id}`]?.[1] > p[1]) { br2 = false; break; }
    if (br1 && br2) { let par = true; for (const o of Object.values(pf)) if (o[0] >= p[0] && o[1] >= p[1] && (o[0] > p[0] || o[1] > p[1])) { par = false; break; } eq.push({ a1: x, a2: y, p, pareto: par, stability: par ? "stable" : "fragile" }); }
  }
  for (const act of a1) for (const d of a1) if (act.id !== d.id && a2.every(y => { const ap = pf[`${act.id}|${y.id}`], dp = pf[`${d.id}|${y.id}`]; return ap && dp && ap[0] < dp[0]; })) dom.push({ actor: actors[0].name, strat: act.label, by: d.label });
  return { eq, dom };
}
function ptVal(x) { return x >= 0 ? Math.pow(x, 0.88) : -2.25 * Math.pow(-x, 0.88); }

function computeSens(res, pf, actors, cd) {
  const items = [];
  if (res.game_theory) {
    const baseEq = res.game_theory.detail?.eq?.[0];
    let found = false;
    for (const pk of Object.keys(pf)) { const orig = pf[pk]; if (!orig) continue; const t1 = findNash(actors, { ...pf, [pk]: [orig[0] - 10, orig[1]] }).eq[0]; if (t1?.a1?.id !== baseEq?.a1?.id) { const parts = pk.split("|"); items.push({ name: `Payoff: ${actors[0]?.actions?.find(a => a.id === parts[0])?.label || "?"} + ${actors[1]?.actions?.find(a => a.id === parts[1])?.label || "?"}`, model: "game_theory", impact: 85, cur: orig[0], tip: orig[0] - 10, fx: "Nash-GGW verschiebt sich" }); found = true; break; } }
    if (!found && baseEq) items.push({ name: `Payoff ${baseEq.a1?.label}+${baseEq.a2?.label}`, model: "game_theory", impact: 70, cur: baseEq.p[0], tip: baseEq.p[0] - 15, fx: "Nash-GGW verschiebt sich" });
  }
  if (res.bargaining) items.push({ name: `BATNA ${actors[1]?.name}`, model: "bargaining", impact: 72, cur: "schwach", tip: "stark", fx: "ZOPA kollabiert" });
  if (res.prospect_theory) items.push({ name: `Referenzpunkt ${actors[0]?.name}`, model: "prospect_theory", impact: 60, cur: "Status quo", tip: "Reframe", fx: "Risikoavers → neutral" });
  if (res.deterrence) items.push({ name: "Glaubwürdigkeit", model: "deterrence", impact: 55, cur: `${actors[0]?.cred || 50}%`, tip: "<50%", fx: "Abschreckung bricht" });
  if (res.coopetition) items.push({ name: "Kooperationsbereitschaft", model: "coopetition", impact: 50, cur: "niedrig", tip: "hoch", fx: "Wettbewerb → Kooperation" });
  if (res.real_options) items.push({ name: "Informationsrate", model: "real_options", impact: 45, cur: "langsam", tip: "schnell", fx: "Wartewert sinkt" });
  if (res.system_dynamics) items.push({ name: res.system_dynamics.detail?.lev?.[0]?.name || "Hebel", model: "system_dynamics", impact: 40, cur: String(cd.variables?.[0]?.init || 0), tip: "Feedback kippt", fx: "Nichtlineare Beschleunigung" });
  if (res.scenario_planning) items.push({ name: cd.uncertainties?.[0]?.name || "Unsicherheit", model: "scenario_planning", impact: 35, cur: "Mittel", tip: "Extrem", fx: "Szenariowechsel" });
  return items.sort((a, b) => b.impact - a.impact);
}

function engine(cd, ov = {}) {
  const actors = cd.actors || [], [a0, a1] = actors;
  if (!a0 || !a1) return null;
  const pf = { ...(cd.payoffs || {}), ...ov }, res = {}, sel = cd.selectedModels || [];

  if (sel.includes("game_theory")) { const gt = findNash(actors, pf); const b = gt.eq[0]; res.game_theory = { detail: gt, norm: { recs: { [a0.id]: { action: b?.a1?.label || "—", conf: b ? (b.pareto ? .80 : .60) : .3 }, [a1.id]: { action: b?.a2?.label || "—", conf: b ? .65 : .3 } }, stability: b?.stability || "unstable" }, caveats: ["Vollständige Information", "Payoffs geschätzt", "Nicht-sequenziell"] }; }

  if (sel.includes("prospect_theory")) {
    const fr = actors.map(a => { const loss = a.role === "incumbent" || !!(a.refPt || "").match(/aktuell|halten|status/i); const idx = actors.indexOf(a); const pVals = Object.values(pf).map(p => p[idx]).filter(v => v != null); const best = Math.max(...pVals, 0), worst = Math.min(...pVals, 0); const ref = loss ? best * .7 : 0; const sB = ptVal(best - ref), sW = ptVal(worst - ref); return { id: a.id, name: a.name, frame: loss ? "loss" : "gain", label: loss ? "Verlustframe → risikoavers" : "Gewinnframe → risikofreudig", action: loss ? "Abwarten (Verlustaversion)" : "Aggressiv einsteigen", conf: loss ? .65 : .55, ref: Math.round(ref), sB: Math.round(sB * 10) / 10, sW: Math.round(sW * 10) / 10, expl: loss ? `${a.name}: Ref ~${Math.round(ref)}. Verlust (${Math.round(sW * 10) / 10}) wiegt schwerer als Gewinn (${Math.round(sB * 10) / 10}) → konservativ` : `${a.name}: Ref ~${Math.round(ref)}. Gewinne dominieren → risikofreudiger` }; });
    res.prospect_theory = { detail: { frames: fr }, norm: { recs: Object.fromEntries(fr.map(f => [f.id, { action: f.action, conf: f.conf }])), stability: "fragile" }, caveats: ["v(x)=x^0.88 / -2.25|x|^0.88", "Referenzpunkte geschätzt"] };
  }

  if (sel.includes("bargaining")) { const p0 = Object.values(pf).map(p => p[0]), p1 = Object.values(pf).map(p => p[1]); const b0 = Math.min(...p0, 0), b1 = Math.min(...p1, 0), x0 = Math.max(...p0, 0), x1 = Math.max(...p1, 0); const r0 = x0 - b0 || 1, r1 = x1 - b1 || 1, pw = Math.round(r0 / (r0 + r1) * 100); const zL = Math.round(Math.max(15, 50 - (pw - 50) * .6)), zH = Math.round(Math.min(85, 50 + (pw - 50) * .6)), n = Math.round((zL + zH) / 2); res.bargaining = { detail: { zopa: [zL, zH], nash: n, power: { [a0.id]: pw, [a1.id]: 100 - pw }, offer: { [a0.id]: Math.min(85, n + 12), [a1.id]: Math.max(15, n - 12) } }, norm: { recs: { [a0.id]: { action: `Erstangebot ${Math.min(85, n + 12)}%`, conf: .70 }, [a1.id]: { action: `Gegenangebot ${Math.max(15, n - 12)}%`, conf: .65 } }, stability: zH - zL > 15 ? "stable" : "fragile" }, caveats: ["BATNA aus Payoff-Floor", "Eindimensional"] }; }

  if (sel.includes("deterrence")) { const c0 = a0.escCap || 50, c1 = a1.escCap || 50, cr = a0.cred || 50; const st = c0 > c1 * 1.2 && cr > 60; const tl = c0 > c1 ? 3 : 2; res.deterrence = { detail: { levels: [{ n: 1, nm: "Signal" }, { n: 2, nm: "Commit" }, { n: 3, nm: "Action" }, { n: 4, nm: "Full" }, { n: 5, nm: "Attrition" }], tl, caps: { [a0.id]: c0, [a1.id]: c1 }, stable: st }, norm: { recs: { [a0.id]: { action: st ? "Commitment (L2)" : "Signal (L1)", conf: st ? .70 : .50 }, [a1.id]: { action: st ? "Vermeiden" : "Testen", conf: .55 } }, stability: st ? "stable" : "fragile" }, caveats: ["Vereinfacht", "Fehlperzeptionen ignoriert"] }; }

  if (sel.includes("principal_agent")) { res.principal_agent = { detail: { mechs: [{ nm: "Monitoring", eff: 70 }, { nm: "Anreize", eff: 60 }, { nm: "Screening", eff: 55 }] }, norm: { recs: { [a0.id]: { action: "Monitor + Anreize", conf: .65 }, [a1.id]: { action: "Compliance", conf: .50 } }, stability: "fragile" }, caveats: ["Intrinsische Motivation ignoriert"] }; }

  if (sel.includes("system_dynamics") && cd.variables?.length) { const vs = cd.variables, ls = cd.feedbackLoops || [], st = 12, vm = {}; vs.forEach(x => vm[x.id] = x.init); const tr = {}; vs.forEach(x => tr[x.id] = [{ t: 0, v: x.init }]); for (let t = 1; t <= st; t++) { const nv = { ...vm }; for (const l of ls) if (t >= (l.delay || 1)) nv[l.to] = (nv[l.to] || 0) + (l.type === "pos" ? vm[l.from] * .02 : -vm[l.from] * .015); vs.forEach(x => { vm[x.id] = Math.max(0, Math.min(200, nv[x.id] || vm[x.id])); tr[x.id].push({ t, v: Math.round(vm[x.id] * 10) / 10 }); }); } const lev = vs.map(x => ({ name: x.name, impact: Math.abs((tr[x.id]?.[st]?.v || 0) - x.init) })).sort((a, b) => b.impact - a.impact); res.system_dynamics = { detail: { tr, lev, st, vn: Object.fromEntries(vs.map(v => [v.id, v.name])) }, norm: { recs: { [a0.id]: { action: `Hebel: ${lev[0]?.name || "?"}`, conf: .60 }, [a1.id]: { action: "Dynamik nutzen", conf: .50 } }, stability: lev[0]?.impact > 20 ? "unstable" : "fragile" }, caveats: ["Vereinfacht", "Delays geschätzt"] }; }

  if (sel.includes("scenario_planning") && cd.uncertainties?.length) { const u1 = cd.uncertainties[0], u2 = cd.uncertainties[1] || { name: "Wettbewerb", low: "Moderat", high: "Hoch" }; const sc = [{ name: "Goldene Ära", desc: `${u1.high} + ${u2.low}`, strat: "Investieren", rob: "high", prob: 20 }, { name: "Verdrängung", desc: `${u1.high} + ${u2.high}`, strat: "Differenzieren", rob: "medium", prob: 30 }, { name: "Stiller Verfall", desc: `${u1.low} + ${u2.low}`, strat: "Effizienz", rob: "medium", prob: 25 }, { name: "Perfekter Sturm", desc: `${u1.low} + ${u2.high}`, strat: "Pivot", rob: "low", prob: 25 }]; res.scenario_planning = { detail: { sc }, norm: { recs: { [a0.id]: { action: "Qualitäts-Diff.", conf: .60 }, [a1.id]: { action: "Szenarioabhängig", conf: .40 } }, stability: "fragile" }, caveats: ["Szenarien ≠ Prognosen"] }; }

  if (sel.includes("coopetition")) { const cc = Object.entries(pf).filter(([, p]) => p[0] > 0 && p[1] > 0), cp = Object.entries(pf).filter(([, p]) => p[0] < 0 || p[1] < 0); const best = cc.sort(([, a], [, b]) => (b[0] + b[1]) - (a[0] + a[1]))[0]; const jm = best ? best[1][0] + best[1][1] : 0; const nj = res.game_theory?.detail?.eq?.[0]?.p; const cg = jm - (nj ? nj[0] + nj[1] : 0); const pot = cc.length / Math.max(Object.keys(pf).length, 1); res.coopetition = { detail: { cc: cc.length, cp: cp.length, pot: Math.round(pot * 100), cg, areas: ["Segmentteilung", "Gemeinsame Lieferanten", "Tech-Sharing"] }, norm: { recs: { [a0.id]: { action: pot > .3 ? "Kooperation anbieten" : "Selektiv kooperieren", conf: pot > .3 ? .65 : .45 }, [a1.id]: { action: pot > .3 ? "Kooperation akzeptieren" : "Wettbewerb", conf: pot > .3 ? .60 : .40 } }, stability: pot > .4 ? "stable" : "fragile" }, caveats: ["Vertrauen nicht messbar", "Kartellrecht nicht modelliert"] }; }

  if (sel.includes("real_options")) { const pVals = Object.values(pf).map(p => p[0]); const vol = pVals.length > 1 ? Math.sqrt(pVals.reduce((s, v) => s + Math.pow(v - pVals.reduce((a, b) => a + b, 0) / pVals.length, 2), 0) / pVals.length) : 10; const tv = cd.timeframe === "short_term" ? .2 : cd.timeframe === "medium_term" ? .5 : .8; const wv = vol * tv * .5; const sw = wv > Math.max(...pVals, 0) * .3; const irr = a0.actions?.filter(a => a.cost === "high") || [], rev = a0.actions?.filter(a => a.cost !== "high") || []; res.real_options = { detail: { vol: Math.round(vol * 10) / 10, wv: Math.round(wv * 10) / 10, sw, irr: irr.map(a => a.label), rev: rev.map(a => a.label), staging: [{ ph: "Jetzt", act: rev[0]?.label || "Reversibles zuerst", tp: "rev" }, { ph: "+3M", act: "Info bewerten", tp: "check" }, { ph: "+6M", act: sw ? "Dann irreversibel" : "Eskalieren", tp: "dec" }] }, norm: { recs: { [a0.id]: { action: sw ? `Warten + ${rev[0]?.label || "reversibel"}` : "Sofort handeln", conf: sw ? .70 : .55 }, [a1.id]: { action: "Fenster schließt", conf: .50 } }, stability: sw ? "stable" : "fragile" }, caveats: ["Vereinfachte Optionsbewertung", "Volatilität aus Payoffs"] }; }

  // Comparison
  const mks = Object.keys(res), conflicts = [];
  for (let i = 0; i < mks.length; i++) for (let j = i + 1; j < mks.length; j++) { const r1 = res[mks[i]]?.norm?.recs, r2 = res[mks[j]]?.norm?.recs; if (!r1 || !r2) continue; for (const aid of [a0.id, a1.id]) if (r1[aid] && r2[aid] && r1[aid].action !== r2[aid].action) conflicts.push({ m1: mks[i], m2: mks[j], actor: aid, an: actors.find(a => a.id === aid)?.name, a1: r1[aid].action, a2: r2[aid].action }); }
  const consensus = [a0.id, a1.id].map(aid => { const acts = mks.map(m => res[m]?.norm?.recs?.[aid]?.action).filter(Boolean); const c = {}; acts.forEach(a => c[a] = (c[a] || 0) + 1); const mx = Math.max(...Object.values(c), 0); if (mx >= Math.ceil(mks.length * .4)) { const top = Object.entries(c).find(([, n]) => n === mx); return { actor: aid, name: actors.find(a => a.id === aid)?.name, action: top?.[0], pct: Math.round(mx / acts.length * 100) }; } return null; }).filter(Boolean);
  return { results: res, comp: { models: mks, conflicts, consensus, sens: computeSens(res, pf, actors, cd) } };
}

// ═══ SUMMARY & EXPORT ═══
function genSum(an, data) {
  if (!an) return null;
  const { results, comp } = an, mks = comp.models;
  const rba = {}; for (const a of data.actors) { const recs = mks.map(m => ({ model: m, ...results[m]?.norm?.recs?.[a.id] })).filter(r => r.action && r.action !== "—"); rba[a.id] = { all: [...recs].sort((a, b) => b.conf - a.conf), actor: a }; }
  const stabs = mks.map(m => results[m]?.norm?.stability).filter(Boolean); const sc = { stable: 0, fragile: 0, unstable: 0 }; stabs.forEach(s => sc[s]++);
  const ov = sc.unstable > 0 ? "unstable" : sc.fragile > sc.stable ? "fragile" : "stable";
  const ins = comp.conflicts.length === 0 ? "Alle Modelle konvergieren — gemeinsame blinde Flecken prüfen." : comp.conflicts.length <= 4 ? `${comp.conflicts.length} produktive Konflikte.` : `${comp.conflicts.length} signifikante Konflikte — keine dominante Strategie.`;
  return { rba, ov, ins, nM: mks.length, nC: comp.conflicts.length, nCo: comp.consensus.length, tr: comp.sens[0] };
}

function mdExport(an, data) {
  if (!an) return; const { results, comp } = an, sum = genSum(an, data);
  let md = `# PRISM: ${data.name}\n\n**${data.type}** | **${data.timeframe}**\n\n> ${data.description}\n\n## Summary\n\n- ${sum.nM} Modelle, ${sum.nC} Konflikte, Stabilität: **${sl(lang, sum.ov)}**\n- ${sum.ins}\n\n`;
  data.actors.forEach(a => { md += `### ${a.name}\n`; sum.rba[a.id]?.all?.forEach(r => { md += `- ${M[r.model]?.l}: **${r.action}** (${Math.round(r.conf * 100)}%)\n`; }); md += `\n`; });
  md += `## Konflikte\n\n`; comp.conflicts.forEach(c => { md += `- **${c.an}**: ${M[c.m1].l} → „${c.a1}" vs. ${M[c.m2].l} → „${c.a2}"\n`; });
  if (sum.tr) md += `\n## Top-Risiko\n\n**${sum.tr.name}** — Kippt: ${sum.tr.tip} → ${sum.tr.fx}\n`;
  md += `\n---\n*PRISM v0.8 — AGPL-3.0 — Thomas Schüller · Syntagma Forschung · Wien — keine Prognose.*\n`;
  const b = new Blob([md], { type: "text/markdown" }), u = URL.createObjectURL(b), a = document.createElement("a"); a.href = u; a.download = `PRISM_${data.name.replace(/\s+/g, "_")}.md`; a.click(); URL.revokeObjectURL(u);
}

// ═══ STORAGE ═══
async function saveCase(data) { try { await window.storage.set(`prism:case:${data.name}`, JSON.stringify(data)); } catch (e) { console.error("Save failed", e); } }
async function loadCases() { try { const r = await window.storage.list("prism:case:"); const cases = []; for (const k of (r?.keys || [])) { try { const v = await window.storage.get(k); if (v?.value) cases.push(JSON.parse(v.value)); } catch (e) {} } return cases; } catch (e) { return []; } }
async function deleteCase(name) { try { await window.storage.delete(`prism:case:${name}`); } catch (e) {} }

// ═══ i18n ═══
const L = {
  de: {
    editor: "Editor", summary: "Summary", models: "Modelle", comparison: "Vergleich", sensitivity: "Sensitivität", whatif: "What-If",
    analyze: "Analyse →", load: "Fall laden", caseDesc: "Fallbeschreibung", caseName: "Fallname", desc: "Beschreibung",
    actors: "Akteure", name: "Name", role: "Rolle", batna: "BATNA", refPt: "Referenzpunkt",
    escCap: "Eskalation", cred: "Glaubwürdigkeit", goals: "Ziele", options: "Optionen", type: "Typ", time: "Zeit",
    lenses: "Analyselinsen (min. 2)", lensHint: "Hover für Details", assumptions: "Annahmen", uncertainties: "Unsicherheiten",
    payoffMatrix: "Payoff-Matrix", blue: "blau", green: "grün",
    coreResult: "KERNERGEBNIS", topRisk: "TOP-RISIKO", conflicts: "Konflikte", consensus: "Konsens",
    original: {t.original}, modified: "MODIFIZIERT", reset: "Reset", export_: "Export", mod: "mod.",
    stable: "Stabil", fragile: "Fragil", unstable: "Instabil",
    impact: "Impact-Ranking", tipping: "Kipppunkte", sweep: "Sweep", matrix: "Matrix",
    warn: "Modellbasiert, keine Prognose.", warnCons: "Übereinstimmung ≠ Korrektheit.",
    save: "Speichern", empty: "Leerer Fall", startAn: "Analyse starten.",
    min: "Min: Name + 2 Akteure + 2 Modelle", ready: "bereit",
    demoComp: "Demo: Wettbewerb", demoNeg: "Demo: Verhandlung",
    eqShift: "GGW SHIFT", pareto: "Pareto", domBy: "dominiert durch",
    sandbox: "What-If Sandbox", now: "Jetzt", cur: "Jetzt", tips: "Kippt",
    sensVar: "SENSITIVSTE VARIABLE", coopCells: "Koop. Zellen", compCells: "Komp. Zellen",
    coopGain: "Koop.-Gewinn", coopAreas: "Kooperationsfelder", volatility: "Volatilität",
    waitVal: "Wartewert", staging: "Staging-Plan", irreversible: "Irreversibel", reversible: "Reversibel",
  },
  en: {
    editor: "Editor", summary: "Summary", models: "Models", comparison: "Comparison", sensitivity: "Sensitivity", whatif: "What-If",
    analyze: "Analyze →", load: "Load case", caseDesc: "Case description", caseName: "Case name", desc: "Description",
    actors: "Actors", name: "Name", role: "Role", batna: "BATNA", refPt: "Reference point",
    escCap: "Escalation", cred: "Credibility", goals: "Goals", options: "Options", type: "Type", time: "Time",
    lenses: "Analysis lenses (min. 2)", lensHint: "Hover for details", assumptions: "Assumptions", uncertainties: "Uncertainties",
    payoffMatrix: "Payoff Matrix", blue: "blue", green: "green",
    coreResult: "CORE RESULT", topRisk: "TOP RISK", conflicts: "Conflicts", consensus: "Consensus",
    original: {t.original}, modified: "MODIFIED", reset: "Reset", export_: "Export", mod: "mod.",
    stable: "Stable", fragile: "Fragile", unstable: "Unstable",
    impact: "Impact Ranking", tipping: "Tipping Points", sweep: "Sweep", matrix: "Matrix",
    warn: "Model-based, not a forecast.", warnCons: "Agreement ≠ correctness.",
    save: "Save", empty: "Empty case", startAn: "Run analysis first.",
    min: "Min: Name + 2 actors + 2 models", ready: "ready",
    demoComp: "Demo: Competition", demoNeg: "Demo: Negotiation",
    eqShift: "EQ SHIFT", pareto: "Pareto", domBy: "dominated by",
    sandbox: "What-If Sandbox", now: "Now", cur: "Current", tips: "Tips at",
    sensVar: "MOST SENSITIVE VARIABLE", coopCells: "Coop. cells", compCells: "Comp. cells",
    coopGain: "Coop. gain", coopAreas: "Cooperation areas", volatility: "Volatility",
    waitVal: "Wait value", staging: "Staging plan", irreversible: "Irreversible", reversible: "Reversible",
  }
};

// ═══ UI PRIMITIVES ═══
function Badge({ children, color = T.muted }) { return <span style={{ display: "inline-block", padding: "2px 7px", borderRadius: 3, fontSize: 10, fontWeight: 700, background: color + "1A", color, whiteSpace: "nowrap" }}>{children}</span>; }
function Card({ children, style, accent, onClick }) { return <div onClick={onClick} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: T.r, padding: 14, marginBottom: 10, borderLeft: accent ? `3px solid ${accent}` : undefined, cursor: onClick ? "pointer" : undefined, ...style }}>{children}</div>; }
function Pill({ children, active, color, onClick, title }) { return <button title={title} onClick={onClick} style={{ padding: "5px 10px", borderRadius: 6, border: `1.5px solid ${active ? color : T.border}`, background: active ? color + "14" : "transparent", cursor: "pointer", fontFamily: T.font, fontSize: 11, fontWeight: 600, color: active ? color : T.fg2, display: "inline-flex", alignItems: "center", gap: 5 }}>{children}</button>; }
function Inp({ value, onChange, placeholder, style, type = "text" }) { return <input type={type} value={value ?? ""} onChange={e => onChange(type === "number" ? Number(e.target.value) : e.target.value)} placeholder={placeholder} style={{ width: "100%", padding: "6px 9px", borderRadius: T.rs, border: `1px solid ${T.border}`, background: T.card2, color: T.fg, fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: T.font, ...style }} />; }
function Sel({ value, onChange, options, style }) { return <select value={value} onChange={e => onChange(e.target.value)} style={{ padding: "6px 9px", borderRadius: T.rs, border: `1px solid ${T.border}`, background: T.card2, color: T.fg, fontSize: 12, outline: "none", fontFamily: T.font, ...style }}>{options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}</select>; }
function Btn({ children, onClick, primary, small, disabled, ghost, style }) { return <button onClick={onClick} disabled={disabled} style={{ padding: small ? "4px 9px" : "7px 14px", borderRadius: T.rs, border: primary ? "none" : ghost ? "none" : `1px solid ${T.border}`, background: primary ? T.accent : "transparent", color: primary ? "#fff" : ghost ? T.accent : T.fg, fontSize: small ? 11 : 12, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? .4 : 1, fontFamily: T.font, ...style }}>{children}</button>; }
function Bar_({ value, max = 100, color = T.accent, h = 5 }) { return <div style={{ height: h, background: T.card3, borderRadius: h / 2, overflow: "hidden" }}><div style={{ width: `${Math.min(100, (value / max) * 100)}%`, height: "100%", background: color, borderRadius: h / 2, transition: "width .3s" }} /></div>; }
function Tabs({ items, active, onChange }) { return <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${T.border}`, marginBottom: 14, overflowX: "auto" }}>{items.map(t => <button key={t.id} onClick={() => !t.disabled && onChange(t.id)} style={{ padding: "8px 11px", fontSize: 11, fontWeight: 700, border: "none", cursor: t.disabled ? "not-allowed" : "pointer", background: "transparent", color: t.disabled ? T.muted + "40" : active === t.id ? T.accent : T.muted, borderBottom: active === t.id ? `2px solid ${T.accent}` : "2px solid transparent", marginBottom: -1, fontFamily: T.font, whiteSpace: "nowrap", opacity: t.disabled ? .35 : 1 }}>{t.icon} {t.label}{t.badge != null && <span style={{ marginLeft: 3, background: T.accent + "30", color: T.accent, padding: "1px 4px", borderRadius: 3, fontSize: 9 }}>{t.badge}</span>}</button>)}</div>; }
function Sec({ title, children, open: d = true }) { const [o, setO] = useState(d); return <div style={{ marginBottom: 12 }}><button onClick={() => setO(!o)} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: "3px 0", fontFamily: T.font }}><span style={{ fontSize: 10, color: T.muted, transform: o ? "rotate(90deg)" : "none", transition: "transform .1s", display: "inline-block" }}>▶</span><span style={{ fontSize: 13, fontWeight: 700, color: T.fg }}>{title}</span></button>{o && <div style={{ marginTop: 4 }}>{children}</div>}</div>; }
function Warn({ children }) { return <div style={{ background: T.orange + "0C", border: `1px solid ${T.orange}25`, borderRadius: T.rs, padding: "7px 11px", fontSize: 11, color: T.orange, display: "flex", gap: 7, alignItems: "flex-start", marginBottom: 8 }}><span>⚠</span><div>{children}</div></div>; }
function Info({ children }) { return <div style={{ background: T.accent + "08", border: `1px dashed ${T.border}`, borderRadius: T.rs, padding: "7px 11px", fontSize: 11, color: T.fg2, display: "flex", gap: 7, alignItems: "flex-start", marginBottom: 8 }}><span>ℹ</span><div>{children}</div></div>; }
function Lbl({ children }) { return <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: .7, marginBottom: 2 }}>{children}</div>; }

// ═══ EDITOR ═══
function Editor({ data, setData, onRun, savedCases, onLoad, onDelete, t, lang }) {
  const u = (k, v) => setData(p => ({ ...p, [k]: v }));
  const uA = (i, k, v) => { const a = [...data.actors]; a[i] = { ...a[i], [k]: v }; u("actors", a); };
  const valid = data.name && data.actors.filter(a => a.name).length >= 2 && data.selectedModels.length >= 2;
  const a1A = data.actors[0]?.actions?.filter(a => a.label) || [];
  const a2A = data.actors[1]?.actions?.filter(a => a.label) || [];

  return <div>
    <Sec title={t.load}>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 6 }}>
        <Btn small onClick={() => setData(DEMO_COMPETITION)} style={{ color: T.accent, border: `1px solid ${T.accent}30` }}>{t.demoComp}</Btn>
        <Btn small onClick={() => setData(DEMO_NEGOTIATION)} style={{ color: T.green, border: `1px solid ${T.green}30` }}>{t.demoNeg}</Btn>
        <Btn small onClick={() => setData(EMPTY_CASE)} style={{ color: T.muted }}>{t.empty}</Btn>
        {savedCases.map(sc => <Btn key={sc.name} small onClick={() => onLoad(sc)} style={{ color: T.cyan, border: `1px solid ${T.cyan}30` }}>💾 {sc.name}</Btn>)}
      </div>
    </Sec>

    <Sec title={t.caseDesc}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 6 }}>
        <div><Lbl>{t.caseName} *</Lbl><Inp value={data.name} onChange={v => u("name", v)} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
          <div><Lbl>{t.type}</Lbl><Sel value={data.type} onChange={v => u("type", v)} options={CTYPES} style={{ width: "100%" }} /></div>
          <div><Lbl>{t.time}</Lbl><Sel value={data.timeframe} onChange={v => u("timeframe", v)} options={TFS} style={{ width: "100%" }} /></div>
        </div>
      </div>
      <Lbl>{t.desc}</Lbl>
      <textarea value={data.description} onChange={e => u("description", e.target.value)} style={{ width: "100%", padding: "6px 9px", borderRadius: T.rs, border: `1px solid ${T.border}`, background: T.card2, color: T.fg, fontSize: 12, minHeight: 36, resize: "vertical", outline: "none", boxSizing: "border-box", fontFamily: T.font }} />
    </Sec>

    <Sec title={`${t.actors} (${data.actors.length})`}>
      {data.actors.map((actor, ai) => (
        <Card key={actor.id} style={{ background: T.card2, padding: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 6, marginBottom: 6 }}>
            <div><Lbl>{t.name} *</Lbl><Inp value={actor.name} onChange={v => uA(ai, "name", v)} /></div>
            <div><Lbl>{t.role}</Lbl><Sel value={actor.role} onChange={v => uA(ai, "role", v)} options={ROLES} style={{ width: "100%" }} /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 6 }}>
            <div><Lbl>{t.batna}</Lbl><Inp value={actor.batna || ""} onChange={v => uA(ai, "batna", v)} /></div>
            <div><Lbl>{t.refPt}</Lbl><Inp value={actor.refPt || ""} onChange={v => uA(ai, "refPt", v)} /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 6 }}>
            <div><Lbl>{t.escCap} ({actor.escCap || 50})</Lbl><input type="range" min={0} max={100} value={actor.escCap || 50} onChange={e => uA(ai, "escCap", +e.target.value)} style={{ width: "100%", accentColor: T.red }} /></div>
            <div><Lbl>{t.cred} ({actor.cred || 50})</Lbl><input type="range" min={0} max={100} value={actor.cred || 50} onChange={e => uA(ai, "cred", +e.target.value)} style={{ width: "100%", accentColor: T.orange }} /></div>
          </div>
          <Lbl>{t.goals}</Lbl>
          {(actor.goals || []).map((g, gi) => <div key={gi} style={{ display: "flex", gap: 4, marginBottom: 3 }}><Inp value={g.text} onChange={v => { const gs = [...actor.goals]; gs[gi] = { ...g, text: v }; uA(ai, "goals", gs); }} style={{ flex: 1 }} /><Sel value={g.pr} onChange={v => { const gs = [...actor.goals]; gs[gi] = { ...g, pr: v }; uA(ai, "goals", gs); }} options={["critical", "high", "medium", "low"]} /></div>)}
          <Btn small onClick={() => uA(ai, "goals", [...(actor.goals || []), { text: "", pr: "medium" }])}>+ {t.goals}</Btn>
          <div style={{ marginTop: 5 }}><Lbl>{t.options}</Lbl>
          {(actor.actions || []).map((act, aci) => <div key={act.id} style={{ display: "flex", gap: 4, marginBottom: 3 }}><Inp value={act.label} onChange={v => { const as = [...actor.actions]; as[aci] = { ...act, label: v }; uA(ai, "actions", as); }} style={{ flex: 1 }} /><Sel value={act.cost} onChange={v => { const as = [...actor.actions]; as[aci] = { ...act, cost: v }; uA(ai, "actions", as); }} options={[{ value: "none", label: "—" }, { value: "low", label: "Low" }, { value: "medium", label: "Med" }, { value: "high", label: "High" }]} /></div>)}
          <Btn small onClick={() => uA(ai, "actions", [...(actor.actions || []), { id: `x${Date.now()}`, label: "", cost: "medium" }])}>+ {t.options}</Btn></div>
        </Card>
      ))}
      <Btn small onClick={() => u("actors", [...data.actors, { id: `a${Date.now()}`, name: "", role: "entrant", goals: [{ text: "", pr: "medium" }], actions: [{ id: `x${Date.now()}`, label: "", cost: "medium" }], batna: "", refPt: "", escCap: 50, cred: 50 }])}>+ {t.actors}</Btn>
    </Sec>

    {a1A.length > 0 && a2A.length > 0 && <Sec title={t.payoffMatrix} open={false}>
      <div style={{ fontSize: 10, color: T.muted, marginBottom: 4 }}>{data.actors[0]?.name} <span style={{ color: T.accent }}>{t.blue}</span> / {data.actors[1]?.name} <span style={{ color: T.green }}>{t.green}</span></div>
      <div style={{ overflowX: "auto" }}><table style={{ borderCollapse: "collapse", fontSize: 10 }}>
        <thead><tr><th style={{ padding: 4, borderBottom: `1px solid ${T.border}`, color: T.muted, textAlign: "left", fontSize: 9 }}></th>{a2A.map(a => <th key={a.id} style={{ padding: 4, borderBottom: `1px solid ${T.border}`, color: T.fg2, fontSize: 9, textAlign: "center", minWidth: 70 }}>{a.label}</th>)}</tr></thead>
        <tbody>{a1A.map(x => <tr key={x.id}><td style={{ padding: 3, borderBottom: `1px solid ${T.border}`, fontWeight: 600, color: T.fg, fontSize: 9 }}>{x.label}</td>{a2A.map(y => { const k = `${x.id}|${y.id}`, p = data.payoffs?.[k] || [0, 0]; return <td key={y.id} style={{ padding: 2, borderBottom: `1px solid ${T.border}`, textAlign: "center" }}><div style={{ display: "flex", gap: 2, justifyContent: "center" }}><input type="number" value={p[0]} onChange={e => { const pf = { ...data.payoffs }; pf[k] = [+e.target.value, p[1]]; u("payoffs", pf); }} style={{ width: 32, padding: 2, borderRadius: 3, border: `1px solid ${T.border}`, background: T.card2, color: T.accent, fontSize: 10, textAlign: "center", fontFamily: T.mono }} /><input type="number" value={p[1]} onChange={e => { const pf = { ...data.payoffs }; pf[k] = [p[0], +e.target.value]; u("payoffs", pf); }} style={{ width: 32, padding: 2, borderRadius: 3, border: `1px solid ${T.border}`, background: T.card2, color: T.green, fontSize: 10, textAlign: "center", fontFamily: T.mono }} /></div></td>; })}</tr>)}</tbody>
      </table></div></Sec>}

    <Sec title={t.lenses}>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{Object.entries(M).map(([k, m]) => {
        const sel = data.selectedModels.includes(k);
        return <Pill key={k} active={sel} color={m.c} title={md_(lang,m)} onClick={() => { const ms = sel ? data.selectedModels.filter(x => x !== k) : [...data.selectedModels, k]; if (ms.length >= 2 || !sel) u("selectedModels", ms.length < 2 ? data.selectedModels : ms); }}><span style={{ fontSize: 13 }}>{m.i}</span>{m.l}</Pill>;
      })}</div>
      <div style={{ fontSize: 9, color: T.muted, marginTop: 4 }}>{t.lensHint}</div>
    </Sec>

    <Sec title={t.assumptions} open={false}>
      {(data.assumptions || []).map((a, i) => <div key={i} style={{ display: "flex", gap: 4, marginBottom: 3, alignItems: "center" }}>
        <Inp value={a.text} onChange={v => { const as = [...data.assumptions]; as[i] = { ...a, text: v }; u("assumptions", as); }} style={{ flex: 1 }} />
        <input type="range" min={0} max={100} value={a.confidence * 100} onChange={e => { const as = [...data.assumptions]; as[i] = { ...a, confidence: +e.target.value / 100 }; u("assumptions", as); }} style={{ width: 45, accentColor: T.accent }} />
        <span style={{ fontSize: 9, color: T.muted, minWidth: 24 }}>{Math.round(a.confidence * 100)}%</span>
      </div>)}
      <Btn small onClick={() => u("assumptions", [...(data.assumptions || []), { text: "", confidence: .7 }])}>+</Btn>
    </Sec>

    <Sec title={t.uncertainties} open={false}>
      {(data.uncertainties || []).map((uc, i) => <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, marginBottom: 3 }}>
        <Inp value={uc.name} onChange={v => { const us = [...data.uncertainties]; us[i] = { ...uc, name: v }; u("uncertainties", us); }} placeholder={t.name} />
        <Inp value={uc.low} onChange={v => { const us = [...data.uncertainties]; us[i] = { ...uc, low: v }; u("uncertainties", us); }} placeholder="Low" />
        <Inp value={uc.high} onChange={v => { const us = [...data.uncertainties]; us[i] = { ...uc, high: v }; u("uncertainties", us); }} placeholder="High" />
      </div>)}
      <Btn small onClick={() => u("uncertainties", [...(data.uncertainties || []), { name: "", low: "", high: "" }])}>+</Btn>
    </Sec>

    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6, padding: "8px 0", borderTop: `1px solid ${T.border}` }}>
      <span style={{ fontSize: 11, color: valid ? T.green : T.orange }}>{valid ? `✓ ${data.selectedModels.length} ${t.models} · ${data.actors.filter(a => a.name).length} ${t.actors} · ${t.ready}` : t.min}</span>
      <div style={{ display: "flex", gap: 6 }}>
        {data.name && <Btn small ghost onClick={() => saveCase(data)}>💾 {t.save}</Btn>}
        <Btn primary onClick={onRun} disabled={!valid}>{t.analyze}</Btn>
      </div>
    </div>
  </div>;
}

// ═══ SUMMARY ═══
function Summary({ an, data, onExport, t, lang }) {
  const sum = useMemo(() => genSum(an, data), [an, data]);
  if (!sum) return <Info>{t.startAn}</Info>;
  return <div>
    <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
      {[{ v: sum.nM, l: t.models, c: T.accent }, { v: sl(lang, sum.ov), l: t.stable === "Stabil" ? "Stabilität" : "Stability", c: STAB[sum.ov].c }, { v: sum.nC, l: t.conflicts, c: sum.nC > 3 ? T.red : sum.nC > 0 ? T.orange : T.green }, { v: sum.nCo, l: t.consensus, c: T.green }].map((d, i) =>
        <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: T.r, padding: "7px 12px", flex: "1 1 80px", textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 800, color: d.c }}>{d.v}</div><div style={{ fontSize: 9, color: T.muted }}>{d.l}</div></div>)}
    </div>
    <Card accent={T.accent}><div style={{ fontSize: 10, fontWeight: 700, color: T.accent, marginBottom: 2 }}>{t.coreResult}</div><div style={{ fontSize: 12, color: T.fg, lineHeight: 1.4 }}>{sum.ins}</div></Card>
    {data.actors.filter(a => a.name).map(actor => { const r = sum.rba[actor.id]; if (!r) return null; return <Card key={actor.id} style={{ background: T.card2 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: T.fg, marginBottom: 5 }}>{actor.name}</div>
      {r.all.map((rec, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, padding: "4px 8px", background: i === 0 ? M[rec.model]?.c + "10" : "transparent", borderRadius: T.rs }}>
        <span style={{ fontSize: 14 }}>{M[rec.model]?.i}</span>
        <div style={{ flex: 1 }}><div style={{ fontSize: 11, fontWeight: 600, color: M[rec.model]?.c }}>{rec.action}</div><div style={{ fontSize: 9, color: T.muted }}>{M[rec.model]?.l}</div></div>
        <div style={{ minWidth: 45 }}><Bar_ value={rec.conf * 100} color={M[rec.model]?.c} h={3} /><div style={{ fontSize: 8, color: T.muted, textAlign: "right" }}>{Math.round(rec.conf * 100)}%</div></div>
      </div>)}</Card>; })}
    {sum.tr && <Card accent={T.red}><div style={{ fontSize: 10, fontWeight: 700, color: T.red }}>{t.topRisk}</div><div style={{ fontSize: 12, fontWeight: 600, color: T.fg }}>{sum.tr.name}</div><div style={{ fontSize: 10, color: T.fg2 }}>{t.tips}: <span style={{ color: T.red }}>{String(sum.tr.tip)}</span> → {sum.tr.fx}</div></Card>}
    <Warn>{t.warn}</Warn>
  </div>;
}

// ═══ RESULTS ═══
function Results({ an, actors, t, lang }) {
  const [op, setOp] = useState(null);
  if (!an) return <Info>{t.startAn}</Info>;
  return <div>{Object.entries(an.results).map(([mk, r]) => { const m = M[mk], n = r.norm, isO = op === mk;
    return <Card key={mk} accent={m.c} onClick={() => setOp(isO ? null : mk)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 16 }}>{m.i}</span><div><div style={{ fontWeight: 700, fontSize: 12, color: T.fg }}>{m.l}</div><div style={{ fontSize: 9, color: T.muted }}>{ma(lang,m)}</div></div></div>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}><Badge color={STAB[n.stability]?.c}>{sl(lang, n.stability)}</Badge><span style={{ fontSize: 10, color: T.muted }}>{isO ? "▲" : "▼"}</span></div>
      </div>
      <div style={{ display: "flex", gap: 5, marginTop: 8, flexWrap: "wrap" }}>{Object.entries(n.recs).map(([aid, rec]) => <div key={aid} style={{ background: m.c + "0D", borderRadius: 4, padding: "5px 9px", flex: "1 1 140px" }}>
        <div style={{ fontSize: 9, color: T.muted, fontWeight: 700 }}>{actors.find(a => a.id === aid)?.name}</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: m.c }}>{rec.action}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}><Bar_ value={rec.conf * 100} color={m.c} h={3} /><span style={{ fontSize: 9, color: T.muted }}>{Math.round(rec.conf * 100)}%</span></div>
      </div>)}</div>
      {isO && <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px solid ${T.border}` }} onClick={e => e.stopPropagation()}>
        {mk === "game_theory" && r.detail?.eq?.map((eq, i) => <div key={i} style={{ background: T.card3, borderRadius: T.rs, padding: 6, marginBottom: 3, fontSize: 10, display: "flex", justifyContent: "space-between" }}><span>{actors[0]?.name}: {eq.a1.label} (<span style={{ color: eq.p[0] >= 0 ? T.green : T.red }}>{eq.p[0]}</span>) · {actors[1]?.name}: {eq.a2.label} (<span style={{ color: eq.p[1] >= 0 ? T.green : T.red }}>{eq.p[1]}</span>)</span>{eq.pareto && <Badge color={T.green}>Pareto</Badge>}</div>)}
        {mk === "game_theory" && r.detail?.dom?.map((d, i) => <div key={i} style={{ fontSize: 10, color: T.red }}>✕ „{d.strat}" dominiert durch „{d.by}"</div>)}
        {mk === "prospect_theory" && r.detail?.frames?.map((f, i) => <div key={i} style={{ background: T.card3, borderRadius: T.rs, padding: 6, marginBottom: 3 }}><div style={{ fontWeight: 700, fontSize: 10, color: f.frame === "loss" ? T.orange : T.green }}>{f.name}: {f.label}</div><div style={{ fontSize: 9, color: T.fg2 }}>{f.expl}</div></div>)}
        {mk === "bargaining" && r.detail && <div style={{ marginBottom: 6 }}><div style={{ position: "relative", height: 20, background: T.card3, borderRadius: 4, overflow: "hidden" }}><div style={{ position: "absolute", left: `${r.detail.zopa[0]}%`, width: `${r.detail.zopa[1] - r.detail.zopa[0]}%`, height: "100%", background: T.green + "25", borderLeft: `2px solid ${T.green}`, borderRight: `2px solid ${T.green}` }} /><div style={{ position: "absolute", left: `${r.detail.nash}%`, top: 0, bottom: 0, width: 2, background: T.accent }} /></div><div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, color: T.muted, marginTop: 1 }}><span>0%</span><span>ZOPA {r.detail.zopa[0]}–{r.detail.zopa[1]}% · Nash {r.detail.nash}%</span><span>100%</span></div></div>}
        {mk === "deterrence" && r.detail?.levels && <div style={{ display: "flex", gap: 2, marginBottom: 6 }}>{r.detail.levels.map(l => <div key={l.n} style={{ flex: 1, padding: "3px 2px", borderRadius: 3, textAlign: "center", fontSize: 8, background: l.n === r.detail.tl ? T.red + "20" : T.card3, border: l.n === r.detail.tl ? `1px solid ${T.red}` : `1px solid ${T.border}`, color: l.n === r.detail.tl ? T.red : T.fg2 }}><div style={{ fontWeight: 700 }}>L{l.n}</div><div>{l.nm}</div></div>)}</div>}
        {mk === "system_dynamics" && r.detail?.tr && <ResponsiveContainer width="100%" height={110}><LineChart><CartesianGrid strokeDasharray="3 3" stroke={T.border} /><XAxis dataKey="t" type="number" domain={[0, r.detail.st]} tick={{ fontSize: 8, fill: T.muted }} /><YAxis tick={{ fontSize: 8, fill: T.muted }} /><Tooltip contentStyle={{ background: T.card, border: `1px solid ${T.border}`, fontSize: 9 }} />{Object.entries(r.detail.tr).map(([vid, pts], i) => <Line key={vid} data={pts} dataKey="v" name={r.detail.vn?.[vid] || vid} stroke={[T.accent, T.green, T.orange, T.red][i % 4]} dot={false} strokeWidth={2} />)}<Legend wrapperStyle={{ fontSize: 8 }} /></LineChart></ResponsiveContainer>}
        {mk === "scenario_planning" && r.detail?.sc && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>{r.detail.sc.map((s, i) => <div key={i} style={{ background: T.card3, borderRadius: T.rs, padding: 6, borderLeft: `3px solid ${s.rob === "high" ? T.green : s.rob === "medium" ? T.orange : T.red}` }}><div style={{ fontWeight: 700, fontSize: 10 }}>{s.name} <span style={{ fontSize: 8, color: T.muted }}>({s.prob}%)</span></div><div style={{ fontSize: 9, color: T.fg2 }}>{s.desc}</div><div style={{ fontSize: 9, color: T.accent }}>→ {s.strat}</div></div>)}</div>}
        {mk === "coopetition" && r.detail && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, marginBottom: 4 }}><div style={{ background: T.card3, borderRadius: T.rs, padding: 5, textAlign: "center" }}><div style={{ fontSize: 14, fontWeight: 800, color: T.green }}>{r.detail.cc}</div><div style={{ fontSize: 8, color: T.muted }}>Koop. Zellen</div></div><div style={{ background: T.card3, borderRadius: T.rs, padding: 5, textAlign: "center" }}><div style={{ fontSize: 14, fontWeight: 800, color: T.red }}>{r.detail.cp}</div><div style={{ fontSize: 8, color: T.muted }}>Komp. Zellen</div></div><div style={{ background: T.card3, borderRadius: T.rs, padding: 5, textAlign: "center" }}><div style={{ fontSize: 14, fontWeight: 800, color: T.lime }}>{r.detail.cg > 0 ? `+${r.detail.cg}` : r.detail.cg}</div><div style={{ fontSize: 8, color: T.muted }}>Koop.-Gewinn</div></div></div>}
        {mk === "real_options" && r.detail && <div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, marginBottom: 4 }}><div style={{ background: T.card3, borderRadius: T.rs, padding: 5, textAlign: "center" }}><div style={{ fontSize: 13, fontWeight: 800, color: "#F97316" }}>{r.detail.vol}</div><div style={{ fontSize: 8, color: T.muted }}>Volatilität</div></div><div style={{ background: T.card3, borderRadius: T.rs, padding: 5, textAlign: "center" }}><div style={{ fontSize: 13, fontWeight: 800, color: "#F97316" }}>{r.detail.wv}</div><div style={{ fontSize: 8, color: T.muted }}>Wartewert</div></div><div style={{ background: T.card3, borderRadius: T.rs, padding: 5, textAlign: "center" }}><div style={{ fontSize: 13, fontWeight: 800, color: r.detail.sw ? T.green : T.red }}>{r.detail.sw ? "Warten" : "Sofort"}</div><div style={{ fontSize: 8, color: T.muted }}>Empfehlung</div></div></div>{r.detail.staging?.map((s, i) => <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 2 }}><Badge color={s.tp === "rev" ? T.green : s.tp === "check" ? T.orange : T.red}>{s.ph}</Badge><span style={{ fontSize: 9, color: T.fg2 }}>{s.act}</span></div>)}</div>}
        {mk === "principal_agent" && r.detail?.mechs?.map((mc, i) => <div key={i} style={{ marginBottom: 2 }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 10 }}><span style={{ fontWeight: 600 }}>{mc.nm}</span><span style={{ color: T.muted }}>{mc.eff}%</span></div><Bar_ value={mc.eff} color={T.purple} h={3} /></div>)}
        {r.caveats?.map((c, i) => <div key={i} style={{ fontSize: 9, color: T.orange, marginTop: 1 }}>⚠ {c}</div>)}
      </div>}
    </Card>; })}</div>;
}

// ═══ COMPARISON ═══
function Comparison({ an, actors, t, lang }) {
  if (!an) return <Info>{t.startAn}</Info>;
  const { results, comp } = an;
  const many = comp.models.length > 4;
  return <div>
    {many ? /* Card-based layout for many models */
      <div>{actors.filter(a => a.name).map(actor => <Card key={actor.id} style={{ background: T.card2 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.fg, marginBottom: 6 }}>{actor.name}</div>
        {comp.models.map(m => { const rec = results[m]?.norm?.recs?.[actor.id]; return rec ? <div key={m} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 13, minWidth: 18 }}>{M[m]?.i}</span>
          <div style={{ flex: 1 }}><div style={{ fontSize: 10, fontWeight: 600, color: M[m].c }}>{rec.action}</div></div>
          <div style={{ minWidth: 40 }}><Bar_ value={rec.conf * 100} color={M[m].c} h={3} /><div style={{ fontSize: 8, color: T.muted, textAlign: "right" }}>{Math.round(rec.conf * 100)}%</div></div>
          <Badge color={STAB[results[m]?.norm?.stability]?.c}>{sl(lang, results[m]?.norm?.stability)}</Badge>
        </div> : null; })}
      </Card>)}</div>
    : /* Table for few models */
      <Card><div style={{ fontSize: 12, fontWeight: 700, color: T.fg, marginBottom: 6 }}>Matrix</div>
        <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
          <thead><tr><th style={{ textAlign: "left", padding: 4, borderBottom: `1px solid ${T.border}`, color: T.muted, fontSize: 9 }}></th>{comp.models.map(m => <th key={m} style={{ textAlign: "center", padding: 4, borderBottom: `2px solid ${M[m].c}`, fontSize: 9, minWidth: 80 }}>{M[m].i} {M[m].l}</th>)}</tr></thead>
          <tbody>{actors.filter(a => a.name).map(a => <tr key={a.id}><td style={{ padding: 4, borderBottom: `1px solid ${T.border}`, fontWeight: 700, color: T.fg }}>{a.name}</td>{comp.models.map(m => { const rec = results[m]?.norm?.recs?.[a.id]; return <td key={m} style={{ padding: 4, borderBottom: `1px solid ${T.border}`, textAlign: "center" }}>{rec && <div><div style={{ fontWeight: 600, color: M[m].c, fontSize: 10 }}>{rec.action}</div><Bar_ value={rec.conf * 100} color={M[m].c} h={3} /></div>}</td>; })}</tr>)}</tbody>
        </table></div></Card>}
    {comp.conflicts.length > 0 && <Card accent={T.red}><div style={{ fontSize: 12, fontWeight: 700, color: T.red, marginBottom: 4 }}>⚡ {comp.conflicts.length} {t.conflicts}</div>{comp.conflicts.slice(0, 8).map((c, i) => <div key={i} style={{ background: T.red + "08", borderRadius: T.rs, padding: 7, marginBottom: 3 }}><div style={{ fontWeight: 600, fontSize: 10 }}>{c.an}: {M[c.m1]?.l} vs. {M[c.m2]?.l}</div><div style={{ fontSize: 9, color: T.fg2 }}>„{c.a1}" vs. „{c.a2}"</div></div>)}</Card>}
    {comp.consensus.length > 0 && <Card accent={T.green}><div style={{ fontSize: 12, fontWeight: 700, color: T.green, marginBottom: 3 }}>✓ {t.consensus}</div>{comp.consensus.map((c, i) => <div key={i} style={{ fontSize: 11 }}><strong>{c.name}</strong>: {c.pct}% → „{c.action}"</div>)}</Card>}
    <Warn>{t.warnCons}</Warn>
  </div>;
}

// ═══ SENSITIVITY ═══
function Sensitivity({ an, t, lang }) {
  if (!an) return <Info>{t.startAn}</Info>;
  const sens = an.comp.sens || [];
  const td = sens.map(s => ({ name: (s.name || "?").substring(0, 22), impact: s.impact, model: M[s.model]?.l, color: M[s.model]?.c }));
  const sv = sens[0];
  const sweep = sv ? Array.from({ length: 11 }, (_, i) => { const v = -25 + i * 5; return { x: v, y: Math.max(.1, Math.min(.95, .75 + v * .008 + (v < -5 ? -.3 : 0))) }; }) : [];
  return <div>
    <Card><div style={{ fontSize: 12, fontWeight: 700, color: T.fg, marginBottom: 6 }}>{t.impact}</div>
      <ResponsiveContainer width="100%" height={Math.max(80, td.length * 24)}><BarChart data={td} layout="vertical" margin={{ left: 0, right: 14 }}><XAxis type="number" domain={[0, 100]} tick={{ fontSize: 8, fill: T.muted }} axisLine={false} tickLine={false} /><YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: T.fg }} width={100} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ background: T.card, border: `1px solid ${T.border}`, fontSize: 9 }} formatter={(v, _, p) => [`${v}%`, p.payload.model]} /><Bar dataKey="impact" radius={[0, 3, 3, 0]} barSize={12}>{td.map((d, i) => <Cell key={i} fill={d.color} />)}</Bar></BarChart></ResponsiveContainer></Card>
    {sweep.length > 0 && <Card><div style={{ fontSize: 12, fontWeight: 700, color: T.fg, marginBottom: 4 }}>Sweep: {sv?.name}</div>
      <ResponsiveContainer width="100%" height={130}><LineChart data={sweep} margin={{ left: 0, right: 8 }}><CartesianGrid strokeDasharray="3 3" stroke={T.border} /><XAxis dataKey="x" tick={{ fontSize: 8, fill: T.muted }} /><YAxis domain={[0, 1]} tick={{ fontSize: 8, fill: T.muted }} tickFormatter={v => `${Math.round(v * 100)}%`} /><Tooltip contentStyle={{ background: T.card, border: `1px solid ${T.border}`, fontSize: 9 }} formatter={v => `${Math.round(v * 100)}%`} /><ReferenceLine x={-5} stroke={T.red} strokeDasharray="5 3" label={{ value: "KIPP", fontSize: 7, fill: T.red, position: "top" }} /><Line dataKey="y" stroke={T.accent} strokeWidth={2} dot={{ fill: T.accent, r: 2 }} /></LineChart></ResponsiveContainer></Card>}
    <Card><div style={{ fontSize: 12, fontWeight: 700, color: T.fg, marginBottom: 5 }}>{t.tipping}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 5 }}>{sens.slice(0, 6).map((s, i) => <div key={i} style={{ background: T.card3, borderRadius: T.rs, padding: 7, borderLeft: `3px solid ${M[s.model]?.c}` }}><div style={{ fontSize: 8, fontWeight: 700, color: T.muted }}>{M[s.model]?.l}</div><div style={{ fontSize: 10, fontWeight: 700, color: M[s.model]?.c }}>{s.name?.substring(0, 25)}</div><div style={{ fontSize: 9, color: T.fg2 }}>{t.cur}: {String(s.cur)}</div><div style={{ fontSize: 9, color: T.red }}>{t.tips}: {String(s.tip)}</div></div>)}</div></Card>
  </div>;
}

// ═══ WHAT-IF ═══
function WhatIf({ data, base, t, lang }) {
  const [ov, setOv] = useState({});
  const actors = data.actors, a1A = actors[0]?.actions?.filter(a => a.label) || [], a2A = actors[1]?.actions?.filter(a => a.label) || [];
  const mod = useMemo(() => engine(data, ov), [data, ov]);
  if (!base || !mod) return <Info>{t.startAn}</Info>;
  const eqS = base.results.game_theory && mod.results.game_theory && JSON.stringify(base.results.game_theory.detail?.eq?.[0]?.a1?.id) !== JSON.stringify(mod.results.game_theory.detail?.eq?.[0]?.a1?.id);
  return <div>
    <Card accent={T.cyan}><div style={{ fontSize: 12, fontWeight: 700, color: T.fg, marginBottom: 6 }}>What-If Sandbox</div>
      {a1A.length > 0 && a2A.length > 0 && <div style={{ overflowX: "auto", marginBottom: 6 }}><table style={{ borderCollapse: "collapse", fontSize: 9 }}><thead><tr><th style={{ padding: 3, borderBottom: `1px solid ${T.border}`, color: T.muted, textAlign: "left" }}></th>{a2A.map(a => <th key={a.id} style={{ padding: 3, borderBottom: `1px solid ${T.border}`, color: T.fg2, textAlign: "center" }}>{a.label}</th>)}</tr></thead><tbody>{a1A.map(x => <tr key={x.id}><td style={{ padding: 2, borderBottom: `1px solid ${T.border}`, fontWeight: 600, color: T.fg }}>{x.label}</td>{a2A.map(y => { const k = `${x.id}|${y.id}`, b = data.payoffs?.[k] || [0, 0], cur = ov[k] || b, ch = ov[k] != null; return <td key={y.id} style={{ padding: 2, borderBottom: `1px solid ${T.border}`, background: ch ? T.cyan + "08" : "transparent" }}><div style={{ display: "flex", gap: 2, justifyContent: "center" }}><input type="number" value={cur[0]} onChange={e => setOv(p => ({ ...p, [k]: [+e.target.value, cur[1]] }))} style={{ width: 30, padding: 1, borderRadius: 3, border: `1px solid ${ch ? T.cyan : T.border}`, background: T.card2, color: ch ? T.cyan : T.accent, fontSize: 10, textAlign: "center", fontFamily: T.mono }} /><input type="number" value={cur[1]} onChange={e => setOv(p => ({ ...p, [k]: [cur[0], +e.target.value] }))} style={{ width: 30, padding: 1, borderRadius: 3, border: `1px solid ${ch ? T.cyan : T.border}`, background: T.card2, color: ch ? T.cyan : T.green, fontSize: 10, textAlign: "center", fontFamily: T.mono }} /></div></td>; })}</tr>)}</tbody></table>
        {Object.keys(ov).length > 0 && <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}><span style={{ fontSize: 9, color: T.cyan }}>{Object.keys(ov).length} mod.</span><Btn small ghost onClick={() => setOv({})}>Reset</Btn></div>}</div>}
    </Card>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
      <Card style={{ borderTop: `2px solid ${T.muted}` }}><div style={{ fontSize: 9, fontWeight: 700, color: T.muted, marginBottom: 5 }}>{ t.original }</div>{Object.entries(base.results).map(([mk, r]) => <div key={mk} style={{ marginBottom: 5 }}><div style={{ fontSize: 10, fontWeight: 600, color: M[mk]?.c }}>{M[mk]?.i} {M[mk]?.l}</div>{actors.map(a => { const rec = r.norm.recs[a.id]; return rec ? <div key={a.id} style={{ fontSize: 9, color: T.fg2, marginLeft: 18 }}>{a.name}: {rec.action}</div> : null; })}</div>)}</Card>
      <Card style={{ borderTop: `2px solid ${T.cyan}` }}><div style={{ fontSize: 9, fontWeight: 700, color: T.cyan, marginBottom: 5 }}>{ t.modified } {eqS && <Badge color={T.red}>GGW SHIFT</Badge>}</div>{Object.entries(mod.results).map(([mk, r]) => { const br = base.results[mk]; return <div key={mk} style={{ marginBottom: 5 }}><div style={{ fontSize: 10, fontWeight: 600, color: M[mk]?.c }}>{M[mk]?.i} {M[mk]?.l}</div>{actors.map(a => { const rec = r.norm.recs[a.id], bRec = br?.norm?.recs?.[a.id]; const ch = bRec && rec && rec.action !== bRec.action; return rec ? <div key={a.id} style={{ fontSize: 9, color: ch ? T.cyan : T.fg2, marginLeft: 18, fontWeight: ch ? 700 : 400 }}>{a.name}: {rec.action} {ch && <span style={{ color: T.red }}>← {bRec.action}</span>}</div> : null; })}</div>; })}</Card>
    </div>
  </div>;
}

// ═══ APP ═══
export default function App() {
  const [view, setView] = useState("editor");
  const [data, setData] = useState(DEMO_COMPETITION);
  const [an, setAn] = useState(null);
  const [saved, setSaved] = useState([]);

  useEffect(() => { loadCases().then(setSaved); }, []);

  const doRun = useCallback(() => { const r = engine(data); setAn(r); setView("summary"); saveCase(data).then(() => loadCases().then(setSaved)); }, [data]);
  const [lang, setLang] = useState("de");
  const t = L[lang];

  const has = !!an;
  const nM = has ? Object.keys(an.results).length : 0;
  const nC = an?.comp?.conflicts?.length || 0;

  return <div lang={lang} role="application" aria-label="PRISM Analysis Platform" style={{ minHeight: "100vh", background: T.bg, color: T.fg, fontFamily: T.font }}>
    <style>{`input[type=range]{height:4px} ::-webkit-scrollbar{width:5px;height:5px} ::-webkit-scrollbar-track{background:${T.bg}} ::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px} ::selection{background:${T.accent}40} *:focus-visible{outline:2px solid ${T.accent};outline-offset:2px}`}</style>
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "12px 14px" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}><span style={{ fontSize: 18, fontWeight: 900, color: T.accent }} aria-hidden="true">◈</span><span style={{ fontSize: 16, fontWeight: 800, letterSpacing: -.5 }}>PRISM</span><span style={{ fontSize: 9, color: T.muted }}>v0.8 · 9 Modelle · AGPL-3.0</span></div>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          <button aria-label={lang === "de" ? "Switch to English" : "Auf Deutsch wechseln"} onClick={() => setLang(lang === "de" ? "en" : "de")} style={{ padding: "2px 6px", borderRadius: 3, border: `1px solid ${T.border}`, background: "transparent", color: T.muted, fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: T.font }}>{lang === "de" ? "EN" : "DE"}</button>
          {data.name && <span style={{ fontSize: 10, color: T.accent, fontWeight: 600 }}>● {data.name}</span>}
          {has && <Btn small ghost onClick={() => mdExport(an, data)}>📄 {t.export_}</Btn>}
        </div>
      </header>
      <Tabs items={[
        { id: "editor", icon: "📋", label: t.editor },
        { id: "summary", icon: "📊", label: t.summary, disabled: !has },
        { id: "results", icon: "🔍", label: t.models, badge: nM || undefined, disabled: !has },
        { id: "comparison", icon: "⚖", label: t.comparison, badge: nC || undefined, disabled: !has },
        { id: "sensitivity", icon: "📈", label: t.sensitivity, disabled: !has },
        { id: "whatif", icon: "🧪", label: t.whatif, disabled: !has },
      ]} active={view} onChange={setView} />
      {view === "editor" && <Editor data={data} setData={setData} onRun={doRun} savedCases={saved} onLoad={c => { setData(c); setAn(null); setView("editor"); }} onDelete={async n => { await deleteCase(n); setSaved(await loadCases()); }} t={t} lang={lang} />}
      {view === "summary" && <Summary an={an} data={data} onExport={() => mdExport(an, data)} t={t} lang={lang} />}
      {view === "results" && <Results an={an} actors={data.actors} t={t} lang={lang} />}
      {view === "comparison" && <Comparison an={an} actors={data.actors} t={t} lang={lang} />}
      {view === "sensitivity" && <Sensitivity an={an} t={t} lang={lang} />}
      {view === "whatif" && <WhatIf data={data} base={an} t={t} lang={lang} />}
    </div>
  </div>;
}
