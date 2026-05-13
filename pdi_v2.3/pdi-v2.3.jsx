
const { useState, useRef, useCallback, useEffect, useMemo } = React;

/* ═══════════════════════════════════════════════════════════
   PHILOSOPHISCHE ENTSCHEIDUNGSANALYSE v2.1
   Standalone HTML — BYOK Edition
   Autor: Thomas Schüller · ORCID 0009-0003-9799-6747 · CC BY 4.0
   ═══════════════════════════════════════════════════════════ */

const ALL_THEORIES = [
  { id:"kant", name:"Kant – Kategorischer Imperativ", icon:"⚖️", tradition:"Deontologie",
    sources:[
      {author:"Kant, I.",year:1785,title:"Grundlegung zur Metaphysik der Sitten",publisher:"J. F. Hartknoch, Riga"},
      {author:"Kant, I.",year:1788,title:"Kritik der praktischen Vernunft",publisher:"J. F. Hartknoch, Riga"},
      {author:"Höffe, O.",year:2012,title:"Kants Kritik der praktischen Vernunft",publisher:"C.H. Beck, München"}
    ],
    glossary:{
      "Kategorischer Imperativ":"Unbedingtes moralisches Gebot. Handle nur nach derjenigen Maxime, durch die du zugleich wollen kannst, dass sie ein allgemeines Gesetz werde.",
      "Maxime":"Subjektiver Grundsatz des Handelns, persönliche Handlungsregel.",
      "Autonomie":"Selbstgesetzgebung der Vernunft.",
      "Pflicht":"Handlung aus Achtung vor dem moralischen Gesetz.",
      "Würde":"Innerer, unbedingter Wert jedes vernunftbegabten Wesens."
    }},
  { id:"util", name:"Utilitarismus (Bentham / Mill)", icon:"📊", tradition:"Konsequentialismus",
    sources:[
      {author:"Bentham, J.",year:1789,title:"An Introduction to the Principles of Morals and Legislation",publisher:"T. Payne, London"},
      {author:"Mill, J. S.",year:1863,title:"Utilitarianism",publisher:"Parker, Son, and Bourn, London"},
      {author:"Singer, P.",year:2011,title:"Practical Ethics (3rd ed.)",publisher:"Cambridge University Press"}
    ],
    glossary:{
      "Utilitätsprinzip":"Handlungen sind moralisch richtig, insofern sie das größte Glück der größten Zahl befördern.",
      "Hedonistisches Kalkül":"Benthams Berechnung von Lust und Leid nach Intensität, Dauer, Gewissheit, Nähe, Folgenträchtigkeit, Reinheit, Ausbreitung.",
      "Qualitative Unterscheidung":"Mills Erweiterung: Auch Qualität von Freuden ist moralisch relevant.",
      "Regelutilitarismus":"Bewertet Handlungsregeln statt einzelner Handlungen nach Gesamtkonsequenzen."
    }},
  { id:"tugend", name:"Tugendethik (Aristoteles)", icon:"🏛️", tradition:"Tugendethik",
    sources:[
      {author:"Aristoteles",year:-335,title:"Nikomachische Ethik",publisher:"Übers. U. Wolf, Rowohlt, 2006"},
      {author:"MacIntyre, A.",year:1981,title:"After Virtue",publisher:"University of Notre Dame Press"},
      {author:"Foot, P.",year:2001,title:"Natural Goodness",publisher:"Oxford University Press"}
    ],
    glossary:{
      "Eudaimonia":"Gelingendes Leben; das höchste Gut, erreichbar durch tugendhafte Tätigkeit.",
      "Mesotes":"Lehre von der Mitte: Tugend liegt zwischen Übermaß und Mangel.",
      "Phronesis":"Praktische Klugheit; Fähigkeit, das Richtige situativ zu erkennen.",
      "Hexis":"Erworbene Charakterhaltung durch wiederholte Übung.",
      "Arete":"Tugend, Vortrefflichkeit."
    }},
  { id:"rawls", name:"Rawls – Vertragstheorie", icon:"🎭", tradition:"Kontraktualismus",
    sources:[
      {author:"Rawls, J.",year:1971,title:"A Theory of Justice",publisher:"Harvard University Press"},
      {author:"Rawls, J.",year:2001,title:"Justice as Fairness: A Restatement",publisher:"Harvard University Press"},
      {author:"Scanlon, T. M.",year:1998,title:"What We Owe to Each Other",publisher:"Harvard University Press"}
    ],
    glossary:{
      "Schleier des Nichtwissens":"Gerechtigkeitsprinzipien werden ohne Kenntnis der eigenen Position gewählt.",
      "Urzustand":"Hypothetische Ausgangssituation für die Wahl von Gerechtigkeitsgrundsätzen.",
      "Differenzprinzip":"Ungleichheiten nur zulässig, wenn sie den Schwächsten maximalen Vorteil bringen.",
      "Vorrang der Freiheit":"Grundfreiheiten haben Vorrang vor wirtschaftlicher Gleichheit."
    }},
  { id:"care", name:"Care Ethics (Fürsorgeethik)", icon:"🤝", tradition:"Fürsorgeethik",
    sources:[
      {author:"Gilligan, C.",year:1982,title:"In a Different Voice",publisher:"Harvard University Press"},
      {author:"Noddings, N.",year:1984,title:"Caring: A Feminine Approach to Ethics",publisher:"University of California Press"},
      {author:"Held, V.",year:2006,title:"The Ethics of Care",publisher:"Oxford University Press"}
    ],
    glossary:{
      "Fürsorge":"Aufmerksame Zuwendung aus Beziehung und Verantwortung.",
      "Relationalität":"Personen sind fundamental durch Beziehungen konstituiert.",
      "Vulnerabilität":"Verletzlichkeit als Grundbedingung menschlicher Existenz.",
      "Engrossment":"Noddings: vollständige empathische Aufnahme des Anderen."
    }},
  { id:"diskurs", name:"Diskursethik (Habermas)", icon:"💬", tradition:"Diskursethik",
    sources:[
      {author:"Habermas, J.",year:1983,title:"Moralbewußtsein und kommunikatives Handeln",publisher:"Suhrkamp, Frankfurt a.M."},
      {author:"Habermas, J.",year:1991,title:"Erläuterungen zur Diskursethik",publisher:"Suhrkamp, Frankfurt a.M."},
      {author:"Apel, K.-O.",year:1988,title:"Diskurs und Verantwortung",publisher:"Suhrkamp, Frankfurt a.M."}
    ],
    glossary:{
      "Diskursprinzip":"Normen gelten nur, wenn alle Betroffenen als Diskursteilnehmer zustimmen könnten.",
      "Ideale Sprechsituation":"Nur der zwanglose Zwang des besseren Arguments gilt.",
      "Universalisierungsgrundsatz":"Norm gültig, wenn Folgen allgemeiner Befolgung von allen akzeptierbar.",
      "Kommunikative Rationalität":"Vernunft zielt auf wechselseitiges Verständnis durch Argumentation."
    }},
  { id:"existenz", name:"Existenzialismus (Sartre / de Beauvoir)", icon:"🌀", tradition:"Existenzphilosophie",
    sources:[
      {author:"Sartre, J.-P.",year:1946,title:"L'existentialisme est un humanisme",publisher:"Nagel, Paris"},
      {author:"Sartre, J.-P.",year:1943,title:"L'être et le néant",publisher:"Gallimard, Paris"},
      {author:"de Beauvoir, S.",year:1947,title:"Pour une morale de l'ambiguïté",publisher:"Gallimard, Paris"}
    ],
    glossary:{
      "Existenz vor Essenz":"Der Mensch existiert zuerst, definiert sich durch Handlungen.",
      "Radikale Freiheit":"Mensch ist zur Freiheit verurteilt, kann sich nicht hinter Determinismen verstecken.",
      "Mauvaise foi":"Selbsttäuschung: Leugnen der eigenen Freiheit und Verantwortung.",
      "Engagement":"Verpflichtung, Freiheit durch konkretes Handeln zu verwirklichen.",
      "Situation":"Konkrete Umstände der Freiheitsausübung (de Beauvoir)."
    }},
  { id:"femin", name:"Feministische Ethik", icon:"♀️", tradition:"Feministische Philosophie",
    sources:[
      {author:"Gilligan, C.",year:1982,title:"In a Different Voice",publisher:"Harvard University Press"},
      {author:"Held, V.",year:2006,title:"The Ethics of Care",publisher:"Oxford University Press"},
      {author:"Jaggar, A. M.",year:1991,title:"Feminist Ethics: Projects, Problems, Prospects",publisher:"In: C. Card (Hrsg.), Univ. Press of Kansas"}
    ],
    glossary:{
      "Androzentrismus":"Systematische Zentrierung auf männliche Perspektiven in der Ethik.",
      "Situierte Erkenntnis":"Wissen ist immer von sozialer Position geprägt.",
      "Intersektionalität":"Verschränkung verschiedener Diskriminierungsformen.",
      "Machtasymmetrie":"Ungleiche Einflussverteilung als ethisch relevanter Faktor."
    }},
  { id:"konfuz", name:"Konfuzianische Ethik", icon:"☯️", tradition:"Ostasiatische Philosophie",
    sources:[
      {author:"Konfuzius",year:-500,title:"Lunyu (Gespräche)",publisher:"Übers. R. Wilhelm, Anaconda, 2017"},
      {author:"Mengzi",year:-300,title:"Mengzi",publisher:"Übers. R. Wilhelm, Anaconda, 2019"},
      {author:"Angle, S. C.",year:2009,title:"Sagehood",publisher:"Oxford University Press"}
    ],
    glossary:{
      "Ren":"Menschlichkeit; zentrale Tugend des Konfuzianismus.",
      "Li":"Ritual, Sitte; äußere Form tugendhaften Handelns.",
      "Junzi":"Der Edle; moralisches Vorbild.",
      "Xiao":"Kindliche Pietät; Respekt gegenüber Eltern und Älteren.",
      "Zhongyong":"Lehre von der Mitte; Harmonie im Handeln."
    }},
  { id:"ubuntu", name:"Ubuntu-Philosophie", icon:"🌍", tradition:"Afrikanische Philosophie",
    sources:[
      {author:"Metz, T.",year:2007,title:"Toward an African Moral Theory",publisher:"Journal of Political Philosophy, 15(3), 321–341"},
      {author:"Ramose, M. B.",year:1999,title:"African Philosophy Through Ubuntu",publisher:"Mond Books, Harare"},
      {author:"Gyekye, K.",year:1997,title:"Tradition and Modernity",publisher:"Oxford University Press"}
    ],
    glossary:{
      "Ubuntu":"Ein Mensch ist ein Mensch durch andere Menschen.",
      "Gemeinschaftlichkeit":"Identität entsteht durch Zugehörigkeit zur Gemeinschaft.",
      "Harmoniestreben":"Ethisches Handeln zielt auf soziale Harmonie.",
      "Würde durch Beziehung":"Menschenwürde wird gemeinschaftlich realisiert."
    }},
  { id:"naturrecht", name:"Naturrecht (Aquin / Grotius)", icon:"📜", tradition:"Naturrechtslehre",
    sources:[
      {author:"Thomas von Aquin",year:1274,title:"Summa Theologiae, I-II, qq. 90–97",publisher:"Deutsche Thomas-Ausgabe"},
      {author:"Grotius, H.",year:1625,title:"De iure belli ac pacis",publisher:"Übers. W. Schätzel, Mohr Siebeck, 1950"},
      {author:"Finnis, J.",year:1980,title:"Natural Law and Natural Rights",publisher:"Oxford University Press"}
    ],
    glossary:{
      "Lex naturalis":"Durch Vernunft erkennbare moralische Ordnung aller Menschen.",
      "Bonum commune":"Gemeinwohl; Gut des Zusammenlebens.",
      "Grundgüter":"Finnis: Leben, Wissen, Spiel, Erfahrung, Freundschaft, praktische Vernünftigkeit, Religion.",
      "Synderesis":"Natürliches Gewissen; Neigung zum Guten."
    }},
  { id:"pragma", name:"Pragmatismus (Dewey / James)", icon:"🔧", tradition:"Pragmatismus",
    sources:[
      {author:"Dewey, J.",year:1908,title:"Ethics (mit J. H. Tufts)",publisher:"Henry Holt, New York"},
      {author:"James, W.",year:1907,title:"Pragmatism",publisher:"Longmans, Green & Co."},
      {author:"Putnam, H.",year:2002,title:"The Collapse of the Fact/Value Dichotomy",publisher:"Harvard University Press"}
    ],
    glossary:{
      "Fallibilismus":"Alle Überzeugungen sind grundsätzlich fehlbar und revidierbar.",
      "Inquiry":"Moralische Probleme werden durch Untersuchung gelöst.",
      "Meliorismus":"Welt ist durch intelligentes Handeln verbesserbar.",
      "Wertexperiment":"Moralische Urteile werden durch praktische Konsequenzen geprüft."
    }}
];

const DEPTH_LEVELS = {
  schule:{label:"Schule (Sek. II)",min:3,detail:"Grundbegriffe, klare Beispiele, einfache Sprache"},
  bachelor:{label:"Bachelor / Einführung",min:5,detail:"Fachterminologie, Quellenverweise, differenzierte Analyse"},
  master:{label:"Master / Seminararbeit",min:8,detail:"Volle Fachsprache, Forschungsstand, Gegenargumente, methodische Reflexion"}
};
const CITE_STYLES = {apa:"APA 7th",harvard:"Harvard",chicago:"Chicago",mla:"MLA 9th"};

function fmtCite(s,style){
  const y=s.year<0?`${Math.abs(s.year)} v. Chr.`:s.year;
  if(style==="harvard")return`${s.author} (${y}) ${s.title}. ${s.publisher}.`;
  if(style==="chicago")return`${s.author}. ${y}. ${s.title}. ${s.publisher}.`;
  if(style==="mla")return`${s.author}. ${s.title}. ${s.publisher}, ${y}.`;
  return`${s.author} (${y}). ${s.title}. ${s.publisher}.`;
}

const C={bg:"#06060b",sf:"#0e0e16",sfH:"#161622",bd:"#1a1a2d",tx:"#dddbe6",txM:"#8887a0",txD:"#55546b",ac:"#c4a04e",acD:"#9a7e3c",acBg:"rgba(196,160,78,0.08)",danger:"#d65555",success:"#5cd680"};
const TC={kant:"#7484d6",util:"#d6944e",tugend:"#5cc094",rawls:"#b86ed6",care:"#d66e80",diskurs:"#5ab8d6",existenz:"#d65a8c",femin:"#d6a05a",konfuz:"#8cd65a",ubuntu:"#d6c45a",naturrecht:"#5a7cd6",pragma:"#5ad6b8"};
const mono="'JetBrains Mono',monospace";
const serif="'Crimson Pro',Georgia,serif";

// ═══════════════════════════════════════════════════════════════════
// PROVIDER-AGNOSTIK v2.0 (Memory-Regel #22)
// LOCAL-FIRST + FREE-FIRST + alles wählbar
// Tier-System: "local" → "free" → "paid"
// ═══════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════
// PROVIDER-MODUL EINBINDUNG (v2.3+)
// Memory-Regel #22 — Provider-Agnostik
// 17 Provider werden von provider-modul.js bereitgestellt (embedded in HTML)
// ═══════════════════════════════════════════════════════════════════

// Zugriff auf die globale ProviderModul-Instanz (von provider-modul.js)
const PROVIDERS = (typeof window !== "undefined" && window.ProviderModul)
  ? window.ProviderModul.PROVIDERS
  : {};

const TIER_LABELS = (typeof window !== "undefined" && window.ProviderModul)
  ? window.ProviderModul.TIER_LABELS
  : {local: "🏠 LOKAL", free: "🟢 GRATIS", paid: "💳 BEZAHLT"};

function getProvidersByTier() {
  return (typeof window !== "undefined" && window.ProviderModul)
    ? window.ProviderModul.getProvidersByTier()
    : {local: [], free: [], paid: []};
}

function callProvider(cfg, system, user) {
  return window.ProviderModul.call(cfg, system, user);
}

function isProviderCfgValid(cfg) {
  return window.ProviderModul.isConfigValid(cfg);
}
function buildPrompt(theories,depth){
  const dl=DEPTH_LEVELS[depth];
  const tl=theories.map(t=>{const th=ALL_THEORIES.find(x=>x.id===t);return`- ${th.name} (${th.tradition})`;}).join("\n");
  return`PHILOSOPHISCHE ENTSCHEIDUNGSANALYSE — AKADEMISCHE EDITION v2.1

Analysiere als systematisches Ethik-Tool. Niveau: ${dl.label}. Min. ${dl.min} Sätze pro Feld. ${dl.detail}.

REGELN: Keine Theorie hat recht. Kein Gesamturteil. Theoriegetrennt. Fachterminologie. Annahmen benennen.
${depth==="master"?"Gegenargumente benennen. Methodische Grenzen reflektieren. Forschungsstand referenzieren.\n":""}
THEORIEN:\n${tl}

Antworte NUR in validem JSON (kein Markdown, keine Codeblöcke):
{
  "fallstruktur":{"kurzbeschreibung":"...","akteur":"...","optionen":["Option A: ...","Option B: ..."],"stakeholder":["..."],"folgen":[{"option":"A","kurzfristig_positiv":"...","kurzfristig_negativ":"...","langfristig_positiv":"...","langfristig_negativ":"..."}],"motive":"...","pflichten":"...","unsicherheiten":"...","fehlende_info":"..."},
  "theorien":[${theories.map(t=>{const th=ALL_THEORIES.find(x=>x.id===t);return`{"id":"${t}","name":"${th.name}","icon":"${th.icon}","tradition":"${th.tradition}","prueffrage":"...","analyse":"AUSFÜHRLICH...","schluesselargument":"...","gegenargument":"...","urteil":"...","staerken":"...","schwaechen":"...","fachbegriffe_verwendet":["..."]}`;}).join(",")}],
  "vergleich":{"uebereinstimmungen":"...","widersprueche":"...","konfliktdimension":"...","konfliktursache":"...","klaerende_infos":"...","unaufloesbare_spannungen":"..."},
  "meta":{"philosophische_erkenntnis":"...","spannungsfelder":["..."],"weiterfuehrende_fragen":["..."]}
}
Auf Deutsch. Fachterminologie der jeweiligen Theorie verwenden.`;
}

function toCrossToolJSON(result, situation, theories, depth, cite){
  return {
    _schema:"konkordanz-v1",
    _tool:"PDI",
    _version:"2.1",
    _timestamp:new Date().toISOString(),
    _config:{depth:DEPTH_LEVELS[depth].label,cite_style:cite,theories},
    _author:{name:"Thomas Schüller",orcid:"0009-0003-9799-6747",email:"forschung@tschueller.com"},
    _license:"CC BY 4.0",
    situation,
    ...result,
    _export_targets:{
      ETHOSLAB:{compatible:true,map:"fallstruktur → Vorhabenbeschreibung; theorien → Ethische Pluralanalyse; vergleich → Kommissionsvotum-Input"},
      WertKompass:{compatible:true,map:"fallstruktur.akteur → Rolle; theorien[].urteil → Framework-Werte"},
      PRISM:{compatible:true,map:"fallstruktur.optionen → Akteur-Strategien; fallstruktur.stakeholder → Akteure"},
      GOVERNANCE:{compatible:true,map:"vergleich.konfliktdimension → Governance-Dimension; meta → Strukturfragen"}
    },
    literatur:theories.flatMap(id=>ALL_THEORIES.find(x=>x.id===id)?.sources||[]).map(s=>fmtCite(s,cite))
  };
}

const S={
  lbl:{fontSize:9,letterSpacing:"0.3em",textTransform:"uppercase",color:C.txD,fontFamily:mono,marginBottom:8,display:"block"},
  fl:{fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:C.txD,fontFamily:mono,marginBottom:5,marginTop:16},
  ft:{fontSize:15,lineHeight:1.8,color:C.tx,fontFamily:serif},
  sec:{background:C.sf,border:`1px solid ${C.bd}`,borderRadius:3,padding:"22px",marginTop:18},
  btn:v=>({padding:v==="xs"?"4px 10px":v==="sm"?"6px 13px":"10px 22px",background:v==="primary"?C.ac:"transparent",color:v==="primary"?C.bg:C.txM,border:v==="primary"?"none":`1px solid ${C.bd}`,borderRadius:3,cursor:"pointer",fontFamily:mono,fontSize:v==="xs"?9:v==="sm"?10:11,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:600,transition:"all 0.2s",display:"inline-flex",alignItems:"center",gap:5}),
  badge:c=>({display:"inline-block",padding:"2px 8px",background:`${c}18`,color:c,borderRadius:3,fontSize:10,fontFamily:mono,marginRight:4,marginBottom:3})
};

function ApiKeyGate({onSubmit}){
  const [tier, setTier] = useState("local"); // local | free | paid
  const [provider, setProvider] = useState("ollama");
  const [key, setKey] = useState("");
  const [model, setModel] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [show, setShow] = useState(false);

  const p = PROVIDERS[provider];

  // Providers grouped by tier (sorted: local → free → paid)
  const providersByTier = useMemo(() => {
    const grp = {local: [], free: [], paid: []};
    Object.entries(PROVIDERS).forEach(([k,v]) => grp[v.tier].push([k,v]));
    return grp;
  }, []);

  // When tier changes, jump to first provider of that tier
  useEffect(() => {
    const first = providersByTier[tier][0];
    if (first && PROVIDERS[provider]?.tier !== tier) {
      setProvider(first[0]);
    }
  }, [tier]);

  // When provider changes, reset model + endpoint
  useEffect(() => {
    if (!p) return;
    setModel(p.models[0]?.id || "");
    setCustomModel("");
    setEndpoint(p.defaultEndpoint || "");
  }, [provider]);

  const effectiveModel = p?.customModel ? customModel : model;
  const isLocal = p?.tier === "local";
  const keyOk = p?.keyOptional || (key.length > 3);
  const endpointOk = !p?.needsEndpoint || (endpoint.length > 5);
  const modelOk = effectiveModel.length > 0;
  const canSubmit = keyOk && endpointOk && modelOk;

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{maxWidth:680,width:"100%",background:C.sf,border:`1px solid ${C.bd}`,borderRadius:3,padding:"32px 28px"}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:9,letterSpacing:"0.35em",textTransform:"uppercase",color:C.txD,fontFamily:mono,marginBottom:8}}>v2.3 · Universal-Provider · BYOK</div>
          <h1 style={{fontSize:24,fontWeight:300,letterSpacing:"0.06em",textTransform:"uppercase",color:C.ac,margin:0}}>Philosophische Entscheidungsanalyse</h1>
        </div>

        <div style={{background:C.acBg,border:`1px solid ${C.ac}30`,borderRadius:3,padding:"12px 14px",marginBottom:16,fontSize:12,lineHeight:1.65,color:C.txM}}>
          <strong style={{color:C.ac}}>🔒 BYOK-Prinzip:</strong> Dein Key bleibt nur in <code style={{fontFamily:mono,fontSize:11,color:C.ac}}>localStorage</code>. Bei lokalen Modellen (Ollama, LM Studio) komplett offline.
        </div>

        {/* TIER-AUSWAHL */}
        <div style={S.fl}>Schritt 1: Anbieter-Kategorie</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:8}}>
          {["local", "free", "paid"].map(t => (
            <button
              key={t}
              onClick={() => setTier(t)}
              style={{
                padding:"10px 8px",
                background: tier===t ? C.acBg : "transparent",
                border: `1px solid ${tier===t ? C.ac : C.bd}`,
                borderRadius: 3,
                color: tier===t ? C.ac : C.txM,
                fontSize: 11,
                fontFamily: mono,
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                lineHeight: 1.3
              }}
            >
              {t === "local" && <>🏠<br/>Lokal<br/><span style={{fontSize:9,color:C.txD}}>(offline, gratis)</span></>}
              {t === "free" && <>🟢<br/>Gratis<br/><span style={{fontSize:9,color:C.txD}}>(Cloud, Free-Tier)</span></>}
              {t === "paid" && <>💳<br/>Bezahlt<br/><span style={{fontSize:9,color:C.txD}}>(höchste Qualität)</span></>}
            </button>
          ))}
        </div>
        <div style={{fontSize:11,color:C.txD,marginBottom:14,fontFamily:mono,lineHeight:1.5}}>
          {TIER_LABELS[tier]}
        </div>

        {/* PROVIDER-AUSWAHL */}
        <div style={S.fl}>Schritt 2: Anbieter</div>
        <select
          value={provider}
          onChange={e=>setProvider(e.target.value)}
          style={{width:"100%",padding:"10px 12px",background:C.bg,border:`1px solid ${C.bd}`,borderRadius:3,color:C.tx,fontSize:13,fontFamily:mono,marginBottom:8,boxSizing:"border-box",cursor:"pointer"}}
        >
          {providersByTier[tier].map(([k,v])=>(<option key={k} value={k}>{v.label}</option>))}
        </select>
        {p?.info && (
          <div style={{fontSize:11,color:C.txD,marginBottom:14,fontFamily:serif,lineHeight:1.6,fontStyle:"italic"}}>
            {p.info}
          </div>
        )}

        {/* ENDPOINT (wenn nötig) */}
        {p?.needsEndpoint && (
          <>
            <div style={S.fl}>Schritt 3: Endpoint-URL</div>
            <input
              type="text"
              value={endpoint}
              onChange={e=>setEndpoint(e.target.value)}
              placeholder={p.defaultEndpoint || "https://..."}
              style={{width:"100%",padding:"9px 12px",background:C.bg,border:`1px solid ${C.bd}`,borderRadius:3,color:C.tx,fontSize:11,fontFamily:mono,marginBottom:14,boxSizing:"border-box"}}
            />
          </>
        )}

        {/* MODELL */}
        <div style={S.fl}>Schritt {p?.needsEndpoint ? "4" : "3"}: Modell</div>
        {p?.customModel ? (
          <input
            type="text"
            value={customModel}
            onChange={e=>setCustomModel(e.target.value)}
            placeholder="z.B. mein-modell oder llama3.2:13b"
            style={{width:"100%",padding:"10px 12px",background:C.bg,border:`1px solid ${C.bd}`,borderRadius:3,color:C.tx,fontSize:13,fontFamily:mono,marginBottom:14,boxSizing:"border-box"}}
          />
        ) : (
          <select
            value={model}
            onChange={e=>setModel(e.target.value)}
            style={{width:"100%",padding:"10px 12px",background:C.bg,border:`1px solid ${C.bd}`,borderRadius:3,color:C.tx,fontSize:12,fontFamily:mono,marginBottom:14,boxSizing:"border-box",cursor:"pointer"}}
          >
            {p?.models.map(m=>(<option key={m.id} value={m.id}>{m.label}</option>))}
          </select>
        )}

        {/* API-KEY */}
        <div style={S.fl}>
          Schritt {p?.needsEndpoint ? "5" : "4"}: API-Key {p?.keyOptional && <span style={{color:C.success,fontSize:10,marginLeft:6}}>(optional bei lokalen Modellen)</span>}
          {p?.keyUrl && <a href={p.keyUrl} target="_blank" rel="noopener" style={{color:C.ac,fontSize:10,marginLeft:8,textDecoration:"underline"}}>→ Key holen</a>}
        </div>
        <div style={{fontSize:10,color:C.txD,marginBottom:4,fontFamily:mono}}>{p?.keyHint}</div>
        <div style={{display:"flex",gap:6}}>
          <input
            type={show?"text":"password"}
            value={key}
            onChange={e=>setKey(e.target.value)}
            placeholder={p?.keyPrefix || (p?.keyOptional ? "(leer lassen)" : "...")}
            style={{flex:1,padding:"10px 12px",background:C.bg,border:`1px solid ${C.bd}`,borderRadius:3,color:C.tx,fontSize:13,fontFamily:mono,boxSizing:"border-box"}}
          />
          <button style={S.btn("sm")} onClick={()=>setShow(!show)} title="Key anzeigen/verbergen">{show?"🙈":"👁"}</button>
        </div>

        <div style={{marginTop:18,display:"flex",justifyContent:"space-between",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <div style={{fontSize:11,color:C.txD,fontFamily:mono,letterSpacing:"0.05em"}}>
            Datenschutz: <a href="DATENSCHUTZ.html" target="_blank" rel="noopener" style={{color:C.ac}}>DSGVO</a>
          </div>
          <button
            style={{...S.btn("primary"),opacity:canSubmit?1:0.3}}
            onClick={()=>canSubmit&&onSubmit({provider,key,model:effectiveModel,endpoint:endpoint||p?.defaultEndpoint||""})}
            disabled={!canSubmit}
          >
            Speichern und starten →
          </button>
        </div>
      </div>
    </div>
  );
}

function App(){
  // Multi-provider config (Memory-Regel #22)
  const loadCfg = () => {
    try {
      const stored = localStorage.getItem("pdi-cfg");
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    return null;
  };
  const [cfg, setCfgState] = useState(loadCfg);
  const setCfg = useCallback((newCfg) => {
    setCfgState(newCfg);
    try { localStorage.setItem("pdi-cfg", JSON.stringify(newCfg)); } catch(e) {}
  }, []);
  const clearCfg = useCallback(() => {
    if(window.confirm("Anbieter-Konfiguration (Provider, Modell, Key) wirklich löschen? Du musst beim nächsten Start neu eingeben.")) {
      setCfgState(null);
      try { localStorage.removeItem("pdi-cfg"); } catch(e) {}
    }
  }, []);
  const[sit,setSit]=useState("");
  const[res,setRes]=useState(null);
  const[loading,setLoading]=useState(false);
  const[err,setErr]=useState(null);
  const[view,setView]=useState("input");
  const[aT,setAT]=useState(0);
  const[tab,setTab]=useState("analyse");
  const[sel,setSel]=useState(["kant","util","tugend","rawls","care"]);
  const[depth,setDepth]=useState("bachelor");
  const[cite,setCite]=useState("apa");
  const[showCfg,setShowCfg]=useState(false);
  const[gSearch,setGSearch]=useState("");
  const[hist,setHist]=useState([]);
  const[showHist,setShowHist]=useState(false);
  const[lMsg,setLMsg]=useState("");
  const[showKeyMgmt,setShowKeyMgmt]=useState(false);
  const taRef=useRef(null);

  // Load history from localStorage
  useEffect(()=>{
    try{
      const stored=localStorage.getItem("pdi-history");
      if(stored)setHist(JSON.parse(stored));
    }catch(e){}
  },[]);

  const saveHistory=useCallback((newHist)=>{
    setHist(newHist);
    try{localStorage.setItem("pdi-history",JSON.stringify(newHist.slice(0,50)));}catch(e){}
  },[]);

  const clearHistory=useCallback(()=>{
    setHist([]);
    try{localStorage.removeItem("pdi-history");}catch(e){}
  },[]);

  const lMsgs=useMemo(()=>["Strukturiere Fall…","Identifiziere Optionen…","Analysiere deontologisch…","Prüfe Konsequenzen…","Reflektiere Tugenden…","Evaluiere Fairness…","Vergleiche Theorien…","Meta-Analyse…","Finalisiere…"],[]);
  useEffect(()=>{if(!loading)return;let i=0;setLMsg(lMsgs[0]);const iv=setInterval(()=>{i=(i+1)%lMsgs.length;setLMsg(lMsgs[i]);},3500);return()=>clearInterval(iv);},[loading,lMsgs]);

  const toggle=id=>setSel(p=>p.includes(id)?(p.length>2?p.filter(x=>x!==id):p):[...p,id]);

  // ─── PROVIDER-AGNOSTISCHE ANALYSE (Memory-Regel #22) ───
  const analyze = useCallback(async () => {
    if (!sit.trim() || sel.length < 2 || !cfg) return;
    setLoading(true);
    setErr(null);
    try {
      const system = buildPrompt(sel, depth);
      const user = `Analysiere vollständig:\n\n${sit}`;

      // Provider-Modul-Aufruf (Memory-Regel #22)
      const txt = await callProvider(cfg, system, user);

      // Parse JSON (manche Modelle wrappen in Markdown)
      const cleaned = txt.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch (parseErr) {
        // Versuche, JSON-Block im Text zu finden
        const match = cleaned.match(/\{[\s\S]*\}/);
        if (match) {
          parsed = JSON.parse(match[0]);
        } else {
          throw new Error(`Antwort war kein gültiges JSON. Modell: ${cfg.model}. Erste 200 Zeichen: ${cleaned.slice(0,200)}`);
        }
      }

      setRes(parsed); setView("result"); setAT(0); setTab("analyse");
      const entry = {sit, result: parsed, theories: [...sel], depth, cite, ts: new Date().toISOString(), provider: cfg.provider, model: cfg.model};
      saveHistory([entry, ...hist.slice(0, 49)]);
    } catch (e) {
      setErr(`Fehler: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [sit, sel, depth, cite, hist, saveHistory, cfg]);

  const getSources=useCallback(()=>res?res.theorien.flatMap(t=>ALL_THEORIES.find(x=>x.id===t.id)?.sources||[]):[],[res]);

  function dl(content,type,name){
    const b=new Blob([content],{type});const u=URL.createObjectURL(b);
    const a=document.createElement("a");a.href=u;a.download=name;a.click();URL.revokeObjectURL(u);
  }

  const expMD=useCallback(()=>{
    if(!res)return;const r=res,srcs=getSources();
    let md=`# Philosophische Entscheidungsanalyse\n\n`;
    md+=`> **Niveau:** ${DEPTH_LEVELS[depth].label} | **Theorien:** ${r.theorien.map(t=>t.name).join(", ")} | **Datum:** ${new Date().toLocaleDateString("de-AT")} | **Tool:** PDI v2.1\n\n---\n\n`;
    md+=`## 1. Fallstruktur\n\n**Situation:** ${r.fallstruktur.kurzbeschreibung}\n\n**Akteur:** ${r.fallstruktur.akteur}\n\n**Optionen:**\n${r.fallstruktur.optionen.map(o=>`- ${o}`).join("\n")}\n\n**Stakeholder:** ${r.fallstruktur.stakeholder.join(", ")}\n\n**Motive:** ${r.fallstruktur.motive}\n\n**Pflichten:** ${r.fallstruktur.pflichten}\n\n**Unsicherheiten:** ${r.fallstruktur.unsicherheiten}\n\n`;
    if(r.fallstruktur.fehlende_info)md+=`**Fehlende Info:** ${r.fallstruktur.fehlende_info}\n\n`;
    md+=`---\n\n## 2. Theorieanalysen\n\n`;
    r.theorien.forEach(t=>{
      const th=ALL_THEORIES.find(x=>x.id===t.id);
      md+=`### ${t.icon} ${t.name} (${t.tradition})\n\n**Prüffrage:** ${t.prueffrage}\n\n**Analyse:** ${t.analyse}\n\n**Schlüsselargument:** ${t.schluesselargument}\n\n`;
      if(t.gegenargument)md+=`**Gegenargument:** ${t.gegenargument}\n\n`;
      md+=`**Urteil:** ${t.urteil}\n\n**Stärken:** ${t.staerken}\n\n**Schwächen:** ${t.schwaechen}\n\n`;
      if(th)md+=`**Literatur:**\n${th.sources.map(s=>`- ${fmtCite(s,cite)}`).join("\n")}\n\n`;
      md+=`---\n\n`;
    });
    md+=`## 3. Vergleich\n\n**Übereinstimmungen:** ${r.vergleich.uebereinstimmungen}\n\n**Widersprüche:** ${r.vergleich.widersprueche}\n\n**Konfliktdimension:** ${r.vergleich.konfliktdimension}\n\n**Ursache:** ${r.vergleich.konfliktursache}\n\n**Klärend:** ${r.vergleich.klaerende_infos}\n\n**Unauflösbar:** ${r.vergleich.unaufloesbare_spannungen}\n\n---\n\n## 4. Meta-Ebene\n\n${r.meta.philosophische_erkenntnis}\n\n**Spannungsfelder:** ${r.meta.spannungsfelder.join(" · ")}\n\n`;
    if(r.meta.weiterfuehrende_fragen)md+=`**Weiterführende Fragen:**\n${r.meta.weiterfuehrende_fragen.map(q=>`- ${q}`).join("\n")}\n\n`;
    md+=`---\n\n## Literaturverzeichnis\n\n${srcs.map(s=>`- ${fmtCite(s,cite)}`).join("\n")}\n\n---\n\n*PDI v2.1 · ${CITE_STYLES[cite]} · ${new Date().toLocaleDateString("de-AT")}*\n*Autor: Thomas Schüller · ORCID 0009-0003-9799-6747 · CC BY 4.0*\n`;
    dl(md,"text/markdown",`pdi-analyse-${new Date().toISOString().slice(0,10)}.md`);
  },[res,depth,cite,getSources]);

  const expJSON=useCallback(()=>{if(!res)return;dl(JSON.stringify(toCrossToolJSON(res,sit,sel,depth,cite),null,2),"application/json",`pdi-analyse-${new Date().toISOString().slice(0,10)}.json`);},[res,sit,sel,depth,cite]);

  const expBib=useCallback(()=>{
    const srcs=getSources();
    const bib=srcs.map(s=>{
      const k=s.author.split(",")[0].replace(/\s/g,"")+(s.year<0?"neg"+Math.abs(s.year):s.year);
      return`@book{${k},\n  author = {${s.author}},\n  year = {${s.year<0?Math.abs(s.year)+" v.Chr.":s.year}},\n  title = {${s.title}},\n  publisher = {${s.publisher}}\n}`;
    }).join("\n\n");
    dl(bib,"text/plain",`pdi-analyse-${new Date().toISOString().slice(0,10)}.bib`);
  },[getSources]);

  const glossary=useMemo(()=>{
    const entries=[];
    const ids=res?res.theorien.map(t=>t.id):sel;
    ids.forEach(id=>{const th=ALL_THEORIES.find(x=>x.id===id);if(th?.glossary)Object.entries(th.glossary).forEach(([term,def])=>entries.push({term,definition:def,theory:th.name,color:TC[id]}));});
    const filtered=gSearch?entries.filter(e=>e.term.toLowerCase().includes(gSearch.toLowerCase())||e.definition.toLowerCase().includes(gSearch.toLowerCase())):entries;
    return filtered.sort((a,b)=>a.term.localeCompare(b.term,"de"));
  },[res,sel,gSearch]);

  const examples=[
    "Mein Mitarbeiter hat einen schweren privaten Fehler begangen, der nichts mit der Arbeit zu tun hat. Durch Zufall habe ich davon erfahren.",
    "Ein Kunde bestellt groß, aber ich weiß, dass unser Produkt seine Anforderungen nicht vollständig erfüllt.",
    "Mein bester Freund bittet mich um eine Referenz. Ich halte ihn fachlich für ungeeignet, aber er braucht den Job dringend.",
    "Eine Kollegin erzählt mir im Vertrauen, dass sie kündigen will. Mein Chef fragt mich direkt danach.",
    "Unser Unternehmen könnte durch Umstrukturierung profitabler werden, aber 20% verlieren ihren Job.",
    "Ein Schüler hat bei der Prüfung abgeschrieben. Ich bin der einzige Lehrer, der es bemerkt hat."
  ];

  if (!cfg) return <ApiKeyGate onSubmit={setCfg} />;

  return(
    <div style={{minHeight:"100vh"}}>
      <header style={{textAlign:"center",padding:"36px 16px 22px",borderBottom:`1px solid ${C.bd}`,position:"relative"}}>
        <div style={{fontSize:9,letterSpacing:"0.35em",textTransform:"uppercase",color:C.txD,fontFamily:mono,marginBottom:8}}>v2.2 · Multi-Provider · BYOK</div>
        <h1 style={{fontSize:"clamp(20px,4.5vw,36px)",fontWeight:300,letterSpacing:"0.06em",textTransform:"uppercase",color:C.ac,margin:0}}>Philosophische Entscheidungsanalyse</h1>
        <div style={{fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:C.txD,marginTop:7,fontFamily:mono}}>{sel.length} Theorien · {DEPTH_LEVELS[depth].label} · {CITE_STYLES[cite]} · {PROVIDERS[cfg.provider]?.label || cfg.provider}</div>
        <div style={{position:"absolute",right:14,top:14,display:"flex",gap:5}}>
          {hist.length>0&&<button style={S.btn("xs")} onClick={()=>setShowHist(!showHist)}>Archiv ({hist.length})</button>}
          <button style={S.btn("xs")} onClick={()=>setShowKeyMgmt(!showKeyMgmt)} title="Provider-Konfiguration">⚙️</button>
        </div>
      </header>

      {showKeyMgmt && (
        <div style={{position:"fixed",right:14,top:60,width:340,background:C.sf,border:`1px solid ${C.bd}`,borderRadius:3,padding:14,zIndex:300,animation:"fadeIn .2s"}}>
          <div style={{...S.lbl,margin:"0 0 10px"}}>Provider-Konfiguration</div>
          <div style={{fontSize:11,color:C.txM,lineHeight:1.7,marginBottom:10}}>
            <div><strong style={{color:C.tx}}>Anbieter:</strong> {PROVIDERS[cfg.provider]?.label || cfg.provider}</div>
            <div><strong style={{color:C.tx}}>Modell:</strong> {cfg.model}</div>
            {cfg.endpoint && <div><strong style={{color:C.tx}}>Endpoint:</strong> <code style={{fontFamily:mono,fontSize:9}}>{cfg.endpoint.slice(0,40)}…</code></div>}
            <div><strong style={{color:C.tx}}>Key:</strong> <code style={{fontFamily:mono,fontSize:10}}>{cfg.key ? cfg.key.slice(0,7)+"…"+cfg.key.slice(-4) : "(keiner, z.B. Ollama)"}</code></div>
          </div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            <button style={{...S.btn("xs"),color:C.danger,borderColor:`${C.danger}40`}} onClick={clearCfg}>Zurücksetzen</button>
            <button style={S.btn("xs")} onClick={()=>setShowKeyMgmt(false)}>Schließen</button>
          </div>
          <div style={{fontSize:10,color:C.txD,marginTop:8,fontFamily:mono,lineHeight:1.5}}>
            Reset führt zurück zum Auswahl-Dialog.
          </div>
        </div>
      )}

      {showHist&&(
        <div style={{position:"fixed",right:0,top:0,bottom:0,width:340,background:C.sf,borderLeft:`1px solid ${C.bd}`,zIndex:200,overflowY:"auto",animation:"fadeIn .2s"}}>
          <div style={{padding:"14px",borderBottom:`1px solid ${C.bd}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{...S.lbl,margin:0}}>Analyse-Archiv</span>
            <div style={{display:"flex",gap:5}}>
              <button style={{...S.btn("xs"),color:C.danger,borderColor:`${C.danger}40`}} onClick={()=>{if(window.confirm("Verlauf löschen?"))clearHistory();}}>Leeren</button>
              <button style={S.btn("xs")} onClick={()=>setShowHist(false)}>×</button>
            </div>
          </div>
          {hist.map((h,i)=>(
            <div key={i} style={{padding:"10px 14px",cursor:"pointer",borderBottom:`1px solid ${C.bd}08`}}
              onMouseEnter={e=>e.currentTarget.style.background=C.sfH} onMouseLeave={e=>e.currentTarget.style.background="transparent"}
              onClick={()=>{setRes(h.result);setSit(h.sit);setSel(h.theories||["kant","util","tugend","rawls","care"]);setDepth(h.depth||"bachelor");setView("result");setShowHist(false);setAT(0);}}>
              <div style={{fontSize:12,lineHeight:1.5,marginBottom:3}}>{h.sit.slice(0,90)}…</div>
              <div style={{fontSize:9,color:C.txD,fontFamily:mono}}>{new Date(h.ts).toLocaleString("de-AT")} · {(h.theories||[]).length}T</div>
            </div>
          ))}
        </div>
      )}

      <div style={{maxWidth:960,margin:"0 auto",padding:"0 14px",paddingBottom:50}}>
        {view==="input"&&(
          <div style={{animation:"fadeIn .3s"}}>
            <div style={S.sec}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}} onClick={()=>setShowCfg(!showCfg)}>
                <span style={S.lbl}>Konfiguration {!showCfg&&`— ${sel.length}T · ${DEPTH_LEVELS[depth].label} · ${CITE_STYLES[cite]}`}</span>
                <span style={{fontSize:11,color:C.txD,fontFamily:mono}}>{showCfg?"▲":"▼"}</span>
              </div>
              {showCfg&&(
                <div style={{animation:"fadeIn .2s"}}>
                  <div style={{marginTop:10}}>
                    <div style={S.fl}>Akademisches Niveau</div>
                    <div style={{display:"flex",gap:5,marginTop:5,flexWrap:"wrap"}}>
                      {Object.entries(DEPTH_LEVELS).map(([k,v])=>(<button key={k} style={{...S.btn(depth===k?"primary":"sm"),fontSize:10,padding:"5px 12px"}} onClick={()=>setDepth(k)}>{v.label}</button>))}
                    </div>
                    <div style={{fontSize:11,color:C.txD,marginTop:5}}>{DEPTH_LEVELS[depth].detail}</div>
                  </div>
                  <div style={{marginTop:14}}>
                    <div style={S.fl}>Zitierstil</div>
                    <div style={{display:"flex",gap:5,marginTop:5,flexWrap:"wrap"}}>
                      {Object.entries(CITE_STYLES).map(([k,v])=>(<button key={k} style={{...S.btn(cite===k?"primary":"sm"),fontSize:10,padding:"4px 11px"}} onClick={()=>setCite(k)}>{v}</button>))}
                    </div>
                  </div>
                  <div style={{marginTop:14}}>
                    <div style={S.fl}>Theorien ({sel.length}/12 — min. 2)</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:6}}>
                      {ALL_THEORIES.map(th=>{const on=sel.includes(th.id),c=TC[th.id];return(<div key={th.id} style={{padding:"6px 12px",cursor:"pointer",borderRadius:3,background:on?`${c}20`:"transparent",border:`1px solid ${on?c:C.bd}`,color:on?c:C.txD,opacity:on?1:.55,fontSize:11,fontFamily:mono,transition:"all .15s"}} onClick={()=>toggle(th.id)}>{th.icon} {th.name.split("(")[0].split("–")[0].trim()}</div>);})}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={S.sec}>
              <label style={S.lbl}>Situation beschreiben</label>
              <textarea ref={taRef} style={{width:"100%",minHeight:160,background:C.bg,border:`1px solid ${C.bd}`,borderRadius:3,color:C.tx,padding:"12px 14px",fontSize:15,fontFamily:serif,lineHeight:1.7,resize:"vertical",outline:"none"}}
                value={sit} onChange={e=>setSit(e.target.value)}
                placeholder="Beschreibe eine Entscheidungssituation, einen Konflikt oder ein ethisches Dilemma…"/>
              <div style={{marginTop:12,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                <button style={{...S.btn("primary"),opacity:loading||!sit.trim()||sel.length<2?.3:1}} onClick={analyze} disabled={loading||!sit.trim()||sel.length<2}>
                  {loading?<><span style={{display:"inline-block",width:13,height:13,border:`2px solid ${C.bd}`,borderTop:`2px solid ${C.bg}`,borderRadius:"50%",animation:"spin .7s linear infinite"}}/><span style={{animation:"pulse 2s infinite"}}>{lMsg}</span></>:`Analyse starten (${sel.length} Theorien)`}
                </button>
                {res&&<button style={S.btn("sm")} onClick={()=>setView("result")}>Letzte Analyse →</button>}
              </div>
              {err&&<div style={{marginTop:10,padding:"7px 11px",background:`${C.danger}12`,border:`1px solid ${C.danger}30`,borderRadius:3,color:C.danger,fontSize:12}}>{err}</div>}
            </div>

            <div style={S.sec}>
              <label style={S.lbl}>Beispielfälle</label>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                {examples.map((ex,i)=>(<div key={i} style={{padding:"9px 12px",background:C.bg,border:`1px solid ${C.bd}`,borderRadius:3,cursor:"pointer",fontSize:13,lineHeight:1.6,color:C.txM,transition:"all .15s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=C.acD;e.currentTarget.style.color=C.tx;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.color=C.txM;}}
                  onClick={()=>{setSit(ex);taRef.current?.focus();}}>{ex}</div>))}
              </div>
            </div>

            <div style={S.sec}>
              <label style={S.lbl}>Glossar ({glossary.length} Begriffe)</label>
              <input type="text" value={gSearch} onChange={e=>setGSearch(e.target.value)} placeholder="Suchen…"
                style={{width:"100%",padding:"7px 11px",background:C.bg,border:`1px solid ${C.bd}`,borderRadius:3,color:C.tx,fontSize:12,fontFamily:mono,boxSizing:"border-box",marginBottom:8}}/>
              <div style={{maxHeight:280,overflowY:"auto"}}>
                {glossary.slice(0,25).map((g,i)=>(<div key={i} style={{padding:"7px 0",borderBottom:`1px solid ${C.bd}08`}}>
                  <span style={{fontWeight:600,color:g.color,fontSize:14}}>{g.term}</span>
                  <span style={{fontSize:9,color:C.txD,fontFamily:mono,marginLeft:8}}>{g.theory.split("(")[0].trim()}</span>
                  <div style={{fontSize:12,color:C.txM,lineHeight:1.6,marginTop:2}}>{g.definition}</div>
                </div>))}
              </div>
            </div>
          </div>
        )}

        {view==="result"&&res&&(
          <div style={{animation:"fadeIn .3s"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:18,flexWrap:"wrap",gap:5}}>
              <button style={S.btn("sm")} onClick={()=>setView("input")}>← Neue Analyse</button>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                <button style={S.btn("xs")} onClick={expMD}>Markdown</button>
                <button style={S.btn("xs")} onClick={expJSON}>JSON / Cross-Tool</button>
                <button style={S.btn("xs")} onClick={expBib}>BibTeX</button>
              </div>
            </div>

            <div style={S.sec}>
              <label style={S.lbl}>1. Fallstruktur</label>
              <h3 style={{fontSize:18,fontWeight:400,color:C.ac,margin:"5px 0 12px",lineHeight:1.5}}>{res.fallstruktur.kurzbeschreibung}</h3>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div><div style={S.fl}>Akteur</div><div style={S.ft}>{res.fallstruktur.akteur}</div></div>
                <div><div style={S.fl}>Stakeholder</div><div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:3}}>{res.fallstruktur.stakeholder.map((s,i)=><span key={i} style={S.badge(C.ac)}>{s}</span>)}</div></div>
              </div>
              <div style={S.fl}>Optionen</div>
              {res.fallstruktur.optionen.map((o,i)=>(<div key={i} style={{padding:"7px 11px",background:C.bg,border:`1px solid ${C.bd}`,borderLeft:`3px solid ${Object.values(TC)[i%12]}`,borderRadius:"0 3px 3px 0",fontSize:13,lineHeight:1.6,marginBottom:4}}>{o}</div>))}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div><div style={S.fl}>Motive</div><div style={S.ft}>{res.fallstruktur.motive}</div></div>
                <div><div style={S.fl}>Pflichten</div><div style={S.ft}>{res.fallstruktur.pflichten}</div></div>
              </div>
              <div style={S.fl}>Unsicherheiten</div>
              <div style={{...S.ft,color:C.txM,fontStyle:"italic"}}>{res.fallstruktur.unsicherheiten}</div>
              {res.fallstruktur.fehlende_info&&<><div style={S.fl}>Fehlende Information</div><div style={{...S.ft,padding:"7px 11px",background:`${C.danger}08`,border:`1px solid ${C.danger}18`,borderRadius:3,color:C.danger}}>{res.fallstruktur.fehlende_info}</div></>}
            </div>

            <div style={S.sec}>
              <label style={S.lbl}>2. Theorieanalyse</label>
              <div style={{display:"flex",gap:0,marginTop:6,marginBottom:2}}>
                {[["analyse","Analyse"],["glossar","Glossar"],["quellen","Quellen"]].map(([k,l])=>(<div key={k} style={{padding:"6px 14px",cursor:"pointer",fontSize:10,fontFamily:mono,letterSpacing:"0.1em",textTransform:"uppercase",color:tab===k?C.ac:C.txD,borderBottom:`2px solid ${tab===k?C.ac:"transparent"}`}} onClick={()=>setTab(k)}>{l}</div>))}
              </div>

              {tab==="analyse"&&<>
                <div style={{display:"flex",gap:0,overflowX:"auto",borderBottom:`1px solid ${C.bd}`,marginTop:6}}>
                  {res.theorien.map((t,i)=>{const c=TC[t.id]||C.ac;return<div key={i} style={{padding:"7px 12px",cursor:"pointer",whiteSpace:"nowrap",background:aT===i?`${c}12`:"transparent",border:`1px solid ${aT===i?c:C.bd}`,borderBottom:aT===i?`2px solid ${c}`:`1px solid ${C.bd}`,borderRadius:"3px 3px 0 0",color:aT===i?c:C.txD,fontSize:10,fontFamily:mono}} onClick={()=>setAT(i)}>{t.icon} {t.name.split(" ")[0]}</div>;})}
                </div>
                {res.theorien.map((t,i)=>{
                  if(aT!==i)return null;
                  const c=TC[t.id]||C.ac;
                  const th=ALL_THEORIES.find(x=>x.id===t.id);
                  return(<div key={i} style={{padding:"18px 0",animation:"fadeIn .2s"}}>
                    <h3 style={{fontSize:16,fontWeight:500,color:c,margin:0}}>{t.icon} {t.name}</h3>
                    <span style={S.badge(c)}>{t.tradition}</span>
                    <div style={{padding:"8px 12px",background:`${c}08`,borderLeft:`3px solid ${c}`,borderRadius:"0 3px 3px 0",marginTop:10,fontSize:14,fontStyle:"italic",color:c}}>{t.prueffrage}</div>
                    <div style={S.fl}>Analyse</div><div style={S.ft}>{t.analyse}</div>
                    <div style={S.fl}>Schlüsselargument</div><div style={{...S.ft,padding:"9px 12px",background:`${c}06`,border:`1px solid ${c}15`,borderRadius:3,fontWeight:500}}>{t.schluesselargument}</div>
                    {t.gegenargument&&<><div style={S.fl}>Gegenargument</div><div style={{...S.ft,fontStyle:"italic",color:C.txM}}>{t.gegenargument}</div></>}
                    <div style={S.fl}>Vorläufiges Urteil</div><div style={{...S.ft,padding:"9px 12px",background:C.bg,border:`1px solid ${C.bd}`,borderRadius:3,fontWeight:500}}>{t.urteil}</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:5}}>
                      <div><div style={S.fl}>✓ Stärken</div><div style={{fontSize:13,lineHeight:1.7,color:C.success}}>{t.staerken}</div></div>
                      <div><div style={S.fl}>⚠ Blinde Flecken</div><div style={{fontSize:13,lineHeight:1.7,color:C.txM}}>{t.schwaechen}</div></div>
                    </div>
                    {t.fachbegriffe_verwendet?.length>0&&<><div style={S.fl}>Fachbegriffe</div><div style={{display:"flex",flexWrap:"wrap",gap:3}}>{t.fachbegriffe_verwendet.map((f,j)=><span key={j} style={S.badge(c)}>{f}</span>)}</div></>}
                    {th&&<><div style={S.fl}>Primärliteratur</div><div style={{fontSize:11,lineHeight:1.7,color:C.txM,fontFamily:mono}}>{th.sources.map((s,j)=><div key={j} style={{marginBottom:3}}>{fmtCite(s,cite)}</div>)}</div></>}
                  </div>);
                })}
              </>}

              {tab==="glossar"&&(<div style={{padding:"14px 0",animation:"fadeIn .2s"}}>
                <input type="text" value={gSearch} onChange={e=>setGSearch(e.target.value)} placeholder="Suchen…"
                  style={{width:"100%",padding:"7px 11px",background:C.bg,border:`1px solid ${C.bd}`,borderRadius:3,color:C.tx,fontSize:12,fontFamily:mono,boxSizing:"border-box",marginBottom:10}}/>
                {glossary.map((g,i)=>(<div key={i} style={{padding:"8px 0",borderBottom:`1px solid ${C.bd}08`}}>
                  <span style={{fontWeight:600,color:g.color,fontSize:14}}>{g.term}</span>
                  <span style={{fontSize:9,color:C.txD,fontFamily:mono,marginLeft:7}}>{g.theory.split("(")[0].trim()}</span>
                  <div style={{fontSize:13,color:C.txM,lineHeight:1.7,marginTop:2}}>{g.definition}</div>
                </div>))}
              </div>)}

              {tab==="quellen"&&(<div style={{padding:"14px 0",animation:"fadeIn .2s"}}>
                <div style={{display:"flex",gap:5,marginBottom:12,flexWrap:"wrap"}}>
                  {Object.entries(CITE_STYLES).map(([k,v])=>(<button key={k} style={{...S.btn(cite===k?"primary":"xs"),fontSize:9,padding:"3px 9px"}} onClick={()=>setCite(k)}>{v}</button>))}
                </div>
                {res.theorien.map((t,i)=>{const th=ALL_THEORIES.find(x=>x.id===t.id);if(!th)return null;const c=TC[t.id];return(<div key={i} style={{marginBottom:14}}><div style={{fontSize:11,fontWeight:600,color:c,fontFamily:mono,marginBottom:5}}>{t.icon} {t.name}</div>{th.sources.map((s,j)=>(<div key={j} style={{fontSize:11,lineHeight:1.7,color:C.txM,fontFamily:mono,paddingLeft:10,borderLeft:`2px solid ${c}30`,marginBottom:4}}>{fmtCite(s,cite)}</div>))}</div>);})}
                <div style={{marginTop:14,display:"flex",gap:5}}>
                  <button style={S.btn("xs")} onClick={expBib}>BibTeX</button>
                  <button style={S.btn("xs")} onClick={expMD}>Vollexport</button>
                </div>
              </div>)}
            </div>

            <div style={S.sec}>
              <label style={S.lbl}>3. Theorienvergleich</label>
              <div style={S.fl}>Übereinstimmungen</div><div style={S.ft}>{res.vergleich.uebereinstimmungen}</div>
              <div style={S.fl}>Widersprüche</div><div style={{...S.ft,color:C.danger}}>{res.vergleich.widersprueche}</div>
              {res.vergleich.konfliktdimension&&<><div style={S.fl}>Konfliktdimension</div><div style={{display:"flex",flexWrap:"wrap",gap:3}}>{res.vergleich.konfliktdimension.split("|").map((d,i)=><span key={i} style={S.badge(Object.values(TC)[i%12])}>{d.trim()}</span>)}</div></>}
              <div style={S.fl}>Ursache</div><div style={S.ft}>{res.vergleich.konfliktursache}</div>
              <div style={S.fl}>Klärende Infos</div><div style={{...S.ft,fontStyle:"italic",color:C.txM}}>{res.vergleich.klaerende_infos}</div>
              <div style={S.fl}>Unauflösbar</div>
              <div style={{...S.ft,padding:"9px 12px",background:`${TC.rawls}06`,border:`1px solid ${TC.rawls}18`,borderRadius:3}}>{res.vergleich.unaufloesbare_spannungen}</div>
            </div>

            <div style={{...S.sec,borderColor:`${C.ac}22`}}>
              <label style={S.lbl}>Meta-Ebene</label>
              <div style={{...S.ft,marginTop:4}}>{res.meta.philosophische_erkenntnis}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:12}}>
                {res.meta.spannungsfelder.map((sp,i)=>(<span key={i} style={{padding:"4px 11px",background:`${Object.values(TC)[i%12]}10`,border:`1px solid ${Object.values(TC)[i%12]}25`,borderRadius:16,fontSize:11,color:Object.values(TC)[i%12],fontFamily:mono}}>{sp}</span>))}
              </div>
              {res.meta.weiterfuehrende_fragen&&<><div style={S.fl}>Weiterführende Fragen</div>{res.meta.weiterfuehrende_fragen.map((q,i)=>(<div key={i} style={{fontSize:14,lineHeight:1.7,color:C.txM,padding:"3px 0 3px 10px",borderLeft:`2px solid ${C.ac}30`}}>{q}</div>))}</>}
            </div>

            <div style={{...S.sec,background:C.acBg,borderColor:`${C.ac}20`}}>
              <label style={S.lbl}>Zitierhinweis</label>
              <div style={{fontSize:11,lineHeight:1.7,color:C.txM,fontFamily:mono}}>
                Schüller, T. ({new Date().getFullYear()}). Philosophische Entscheidungsanalyse [PDI v2.1 Academic Edition]. Niveau „{DEPTH_LEVELS[depth].label}". {res.theorien.length} Theorien: {res.theorien.map(t=>t.name).join("; ")}. Zitierstil: {CITE_STYLES[cite]}.
              </div>
              <div style={{fontSize:10,color:C.txD,marginTop:6,lineHeight:1.6}}>
                KI-gestützte Analyse (Claude, Anthropic). Ersetzt keine eigenständige philosophische Reflexion.
              </div>
              <div style={{fontSize:9,color:C.txD,marginTop:8,fontFamily:mono}}>
                CC BY 4.0 · Thomas Schüller · ORCID 0009-0003-9799-6747 · forschung@tschueller.com
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('pdi-root'));
root.render(<App />);
