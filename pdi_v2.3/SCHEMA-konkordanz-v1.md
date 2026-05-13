# konkordanz-v1 — Schema-Spezifikation

**Cross-Tool-Datenformat für die Analyse-Werkzeugkette**
Version 1.0 · Mai 2026 · Thomas Schüller

---

## 1. Zweck

Das Schema `konkordanz-v1` ist ein **gemeinsames JSON-Format** für die Übergabe von Analysedaten zwischen den fünf Analyse-Werkzeugen:

```
PDI ──▶ ETHOSLAB ──▶ WertKompass ──▶ PRISM ──▶ GOVERNANCE
(normativ)  (institutionell)  (gesellschaftlich)  (strategisch)  (strukturell)
```

Jedes Werkzeug kann Schema-konformes JSON erzeugen und konsumieren. Damit lassen sich Analyseketten bauen, ohne Daten manuell zu übertragen.

## 2. Top-Level-Struktur

```json
{
  "_schema": "konkordanz-v1",
  "_tool": "PDI" | "ETHOSLAB" | "WertKompass" | "PRISM" | "GOVERNANCE",
  "_version": "string (semver des erzeugenden Tools)",
  "_timestamp": "ISO-8601-Datum",
  "_config": { /* tool-spezifische Konfiguration */ },
  "_author": {
    "name": "string",
    "orcid": "string|null",
    "email": "string|null"
  },
  "_license": "CC BY 4.0 (default)",
  "situation": "string (Originaltext der zu analysierenden Situation)",
  /* tool-spezifische Felder folgen */
  "_export_targets": {
    "ETHOSLAB":    { "compatible": bool, "map": "string" },
    "WertKompass": { "compatible": bool, "map": "string" },
    "PRISM":       { "compatible": bool, "map": "string" },
    "GOVERNANCE":  { "compatible": bool, "map": "string" }
  }
}
```

## 3. PDI-spezifisches Schema

```json
{
  "_schema": "konkordanz-v1",
  "_tool": "PDI",
  "_version": "2.1",
  "_timestamp": "2026-05-06T14:32:00.000Z",
  "_config": {
    "depth": "Schule (Sek. II) | Bachelor / Einführung | Master / Seminararbeit",
    "cite_style": "apa | harvard | chicago | mla",
    "theories": ["kant", "util", "tugend", "rawls", "care"]
  },
  "_author": { "name": "Thomas Schüller", "orcid": "0009-0003-9799-6747", "email": "forschung@tschueller.com" },
  "_license": "CC BY 4.0",
  "situation": "string",
  "fallstruktur": {
    "kurzbeschreibung": "string",
    "akteur": "string",
    "optionen": ["string", "..."],
    "stakeholder": ["string", "..."],
    "folgen": [
      {
        "option": "A",
        "kurzfristig_positiv": "string",
        "kurzfristig_negativ": "string",
        "langfristig_positiv": "string",
        "langfristig_negativ": "string"
      }
    ],
    "motive": "string",
    "pflichten": "string",
    "unsicherheiten": "string",
    "fehlende_info": "string"
  },
  "theorien": [
    {
      "id": "kant | util | tugend | rawls | care | diskurs | existenz | femin | konfuz | ubuntu | naturrecht | pragma",
      "name": "string",
      "icon": "string (emoji)",
      "tradition": "string",
      "prueffrage": "string",
      "analyse": "string (mehrere Sätze)",
      "schluesselargument": "string",
      "gegenargument": "string|null",
      "urteil": "string",
      "staerken": "string",
      "schwaechen": "string",
      "fachbegriffe_verwendet": ["string", "..."]
    }
  ],
  "vergleich": {
    "uebereinstimmungen": "string",
    "widersprueche": "string",
    "konfliktdimension": "Folgen | Pflichten | Charakter | Fairness | Beziehungen",
    "konfliktursache": "string",
    "klaerende_infos": "string",
    "unaufloesbare_spannungen": "string"
  },
  "meta": {
    "philosophische_erkenntnis": "string",
    "spannungsfelder": ["string", "..."],
    "weiterfuehrende_fragen": ["string", "..."]
  },
  "_export_targets": {
    "ETHOSLAB": { "compatible": true, "map": "fallstruktur → Vorhabenbeschreibung; theorien → Ethische Pluralanalyse; vergleich → Kommissionsvotum-Input" },
    "WertKompass": { "compatible": true, "map": "fallstruktur.akteur → Rolle; theorien[].urteil → Framework-Werte" },
    "PRISM": { "compatible": true, "map": "fallstruktur.optionen → Akteur-Strategien; fallstruktur.stakeholder → Akteure" },
    "GOVERNANCE": { "compatible": true, "map": "vergleich.konfliktdimension → Governance-Dimension; meta → Strukturfragen" }
  },
  "literatur": ["string (formatierter Zitiereintrag)", "..."]
}
```

## 4. Mapping-Tabellen

### PDI → ETHOSLAB

| PDI-Feld | ETHOSLAB-Feld | Bemerkung |
|---|---|---|
| `situation` | `vorhaben.beschreibung` | direkter Übertrag |
| `fallstruktur.akteur` | `vorhaben.antragsteller` | wenn natürliche Person |
| `fallstruktur.stakeholder` | `vorhaben.betroffene_gruppen` | direkter Übertrag |
| `theorien[]` | `pluralanalyse.linsen[]` | je Theorie eine Linse |
| `theorien[].urteil` | `pluralanalyse.linsen[].votum` | direkter Übertrag |
| `vergleich.unaufloesbare_spannungen` | `kommissionsvotum.dissens_punkte` | Anker für Mehrheitsvotum |
| `meta.weiterfuehrende_fragen` | `auflagen.empfehlungen` | als Anknüpfungspunkt |

### PDI → WertKompass

| PDI-Feld | WertKompass-Feld | Bemerkung |
|---|---|---|
| `fallstruktur.akteur` | `analyse.rolle` | als Tätigkeit/Position interpretieren |
| `fallstruktur.optionen` | `analyse.handlungsalternativen` | direkter Übertrag |
| `theorien[].urteil` | `framework.{id}.normative_basis` | je Theorie ein Framework-Wert |
| `vergleich.konfliktdimension` | `meta.bewertungs_dimension` | Folgen → Outcome, Pflichten → Norm, etc. |

### PDI → PRISM

| PDI-Feld | PRISM-Feld | Bemerkung |
|---|---|---|
| `fallstruktur.akteur` | `akteure.A` | Hauptakteur |
| `fallstruktur.stakeholder` | `akteure.B+` | weitere Akteure |
| `fallstruktur.optionen` | `akteure.A.strategien` | Strategieraum |
| `fallstruktur.folgen` | `payoffs` | Zeitliche Differenzierung als Diskontierungsfaktor |
| `meta.spannungsfelder` | `linsen.dilemma_typen` | direkter Übertrag |

### PDI → GOVERNANCE

| PDI-Feld | GOVERNANCE-Feld | Bemerkung |
|---|---|---|
| `vergleich.konfliktdimension` | `analyse.governance_dimension` | Pflichten → Compliance, Fairness → Verteilungsregel, etc. |
| `vergleich.unaufloesbare_spannungen` | `asymmetrien` | Trade-off-Inventar |
| `meta.weiterfuehrende_fragen` | `offene_strukturfragen` | direkter Übertrag |

## 5. Versionierung

Schema-Versionen folgen Semantic Versioning:
- **Major:** Breaking changes (Pflichtfelder geändert/entfernt)
- **Minor:** Neue optionale Felder, neue Tools im Ökosystem
- **Patch:** Klärungen, Mapping-Verfeinerungen

Aktuelle Version: **v1.0**

## 6. Validierung

Eine JSON-Schema-Datei (`konkordanz-v1.schema.json`) ist geplant für v1.1. Bis dahin: minimale Pflicht-Validierung über die Top-Level-Felder `_schema`, `_tool`, `_version`, `_timestamp`, `situation`.

## 7. Datenschutz

Das Schema enthält **keinen Mechanismus zur automatischen Anonymisierung**. Bei Übergabe zwischen Werkzeugen ist die Verantwortung für Pseudonymisierung beim erzeugenden Tool oder beim Nutzer.

Für sensible Fälle empfohlen:
- Akteursnamen vor PDI-Eingabe pseudonymisieren
- `_author`-Feld vor Weitergabe entfernen, falls Anonymität erforderlich
- `situation`-Text vor öffentlicher Verwendung redigieren

---

*konkordanz-v1 · Spec v1.0 · Mai 2026 · CC BY 4.0*
*Thomas Schüller · ORCID 0009-0003-9799-6747*
