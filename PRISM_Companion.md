---
title: "PRISM — Companion Paper"
author: "Thomas Schüller"
date: 2026-05-12
version: v0.6
license: AGPL-3.0 (Code) / CC BY 4.0 (Dokumentation)
orcid: 0009-0003-9799-6747
contact: forschung@tschueller.com
schliessungstyp: VERSIONSSCHLUSS
---

# PRISM — Companion Paper

**Multi-Linsen-Analyseplattform für Konflikte, Verhandlungen und strategische Entscheidungen**

v0.6 — Mai 2026 — Thomas Schüller

---

## 1. Zweck und Kontext

PRISM (Parallel Reasoning & Integrated Scenario Modelling) ist eine Browser-basierte Analyseplattform, die komplexe Entscheidungssituationen gleichzeitig durch mehrere theoretische Modelle betrachtet. Das System erzwingt Multiperspektivität, legt Annahmen offen und macht Modellkonflikte sichtbar.

Dieses Companion Paper dokumentiert Funktion, Architektur, theoretische Grundlagen, Anwendungsbedingungen und Grenzen.

**Track:** ANWENDUNG/TOOL (nicht FORSCHUNG, nicht SCHICHTWERK-OPS).

## 2. Problem

Entscheidungsträger in Verhandlungen, Wettbewerbssituationen und Krisen leiden unter systematischen Verzerrungen:

- **Monolens-Bias**: Ein einziges Modell dominiert die Analyse, alternative Perspektiven werden ignoriert.
- **Scheingenauigkeit**: Zahlen suggerieren Präzision, die nicht existiert.
- **Kipppunkt-Blindheit**: Kleine Parameteränderungen mit großer Wirkung werden übersehen.
- **Annahmen-Amnesie**: Tragende Annahmen werden nicht dokumentiert oder getestet.

PRISM adressiert diese Probleme durch erzwungenen Parallellauf von mindestens zwei Modellen, automatische Konflikterkennung und Sensitivitätsanalyse.

## 3. Theoriemodule (9)

| # | Modul | Kern | Stärke | Schwäche |
|---|-------|------|--------|----------|
| 1 | Game Theory | Nash-GGW, dominierte Strategien | Klare Akteure, Payoff-Matrizen | >4 Akteure, Emotionen |
| 2 | Prospect Theory | Value Function v(x)=x^0.88 / -2.25·|x|^0.88 | Irrationales Verhalten | Individuen, nicht Gruppen |
| 3 | Bargaining Theory | ZOPA, Nash-Lösung, Erstangebote | Bilaterale Verhandlungen | >3 Parteien |
| 4 | Deterrence/Escalation | 5-stufige Leiter, Glaubwürdigkeit | Krisen, Konflikte | Kooperative Szenarien |
| 5 | Principal-Agent | Moral Hazard, Monitoring, Anreize | Delegationsbeziehungen | Symmetrische Beziehungen |
| 6 | System Dynamics | Feedback-Schleifen, Trajektorien | Langfristige Systemeffekte | Kurzfristige Entscheidungen |
| 7 | Scenario Planning | 2×2-Unsicherheitsmatrix, 4 Szenarien | Strategische Unsicherheit | Klare Datenlage |
| 8 | Coopetition | Kooperationspotenzial aus Payoff-Analyse | Win-Win-Identifikation | Nullsummenspiele |
| 9 | Real Options | Volatilität, Wartewert, Staging-Plan | Irreversible Entscheidungen | Schnell schließende Fenster |

## 4. Architektur

### 4.1 Datenfluss

1. Nutzer gibt Fall ein (Akteure, Ziele, Optionen, Payoffs, Annahmen)
2. Wählt Linsen (min. 2)
3. Engine berechnet jedes Modell isoliert
4. Ergebnisse werden normalisiert
5. Vergleichsmatrix + Konflikterkennung
6. Sensitivitätsanalyse
7. Summary + Export

### 4.2 Normalisierungsebene

Jedes Modell liefert strukturell verschiedene Outputs. Die Normalisierung bildet alle auf drei Dimensionen ab:

- Handlungsempfehlung pro Akteur (Aktion + Konfidenz)
- Stabilitätsbewertung (stabil / fragil / instabil)
- Sensitivste Variable (welcher Parameter kippt das Ergebnis?)

### 4.3 Konflikterkennung

Automatischer Vergleich aller Modellpaare. Ein Konflikt wird registriert, wenn zwei Modelle für denselben Akteur unterschiedliche Aktionen empfehlen. Konflikte werden nicht aufgelöst, sondern hervorgehoben.

### 4.4 Sensitivitätsberechnung

- Game Theory: echte Payoff-Perturbation (±10) mit Prüfung ob Nash-GGW sich verschiebt
- Andere Modelle: Identifikation der einflussreichsten Variable basierend auf Modellstruktur

### 4.5 What-If Sandbox

Live-Parametervariation: Payoffs ändern und sofort sehen, wie sich Gleichgewichte, Empfehlungen und Stabilitäten über alle aktiven Modelle verschieben. Side-by-side Original vs. Modifiziert.

## 5. Implementierung

- **Stack**: React JSX, Recharts — rein clientseitig, kein Backend
- **Persistenz**: window.storage API für Fälle
- **Export**: Markdown-Generierung im Browser
- **Analyse**: Deterministische Berechnung, kein LLM in der Analyse-Pipeline
- **Eingabe**: Wizard mit collapsible Sections, Payoff-Matrix-Editor, Slider für Eskalation/Glaubwürdigkeit
- **i18n**: DE/EN Toggle mit localStorage-Persistenz
- **Lizenz**: AGPL-3.0 (Code), CC BY 4.0 (Dokumentation)

## 6. Grenzen und Warnungen

- **Garbage In, Garbage Out**: Schöne Vergleichsmatrizen über schlechte Eingaben sind wertlos.
- **Modell ≠ Realität**: Jedes Ergebnis gilt nur unter den getroffenen Annahmen.
- **False Consensus**: Übereinstimmung zwischen Modellen kann an ähnlichen Annahmen liegen.
- **Kein Orakel**: Das System sagt nicht voraus, was passieren wird.
- **2-Akteur-Fokus**: Die aktuelle Engine ist auf bilaterale Interaktionen optimiert.
- **Keine WCAG-Prüfung in v0.6**: Barrierefreiheit ist noch nicht vollständig implementiert (offener Faden).

Pflicht-Warnung im System: „Modellergebnisse sind keine Prognosen. Sie zeigen, was unter bestimmten Annahmen folgt."

## 7. API-Schutz (Regel #9)

PRISM v0.6 nutzt keine externen APIs. Keine API-Keys, Tokens oder Secrets im Code. Geprüft per `grep "sk-\|api[_-]key\|bearer\|token\|anthropic\|openai"` — 0 Treffer.

## 8. Schließungstyp (Regel #20)

**VERSIONSSCHLUSS**: v0.6 = Freeze. Erweiterungen nur als v0.7+. Patches (Bugfixes) als v0.6.x. v1.0 erst nach externem Review und Browser-Test (Regel #29).

## 9. Dateien im Paket

| Datei | Beschreibung | Lizenz |
|-------|-------------|--------|
| PRISM_v0.6.jsx | Haupt-Anwendung (React, 9 Module) | AGPL-3.0 |
| PRISM_Systemkonzept.docx | Produktkonzept (11 Kapitel, API, MVP) | CC BY 4.0 |
| PRISM_Companion.md | Dieses Dokument | CC BY 4.0 |
| PRISM_Companion.docx | Dieses Dokument (DOCX) | CC BY 4.0 |
| PRISM_Flyer.pdf | A4-Produktflyer | CC BY 4.0 |
| README.md | Kurzübersicht und Deploy | CC BY 4.0 |
| SESSION-MEMORY-2026-05-12.md | Session-Dokumentation | — |

## 10. Offene Fäden

1. Browser-Test (Regel #29: rendert / Hauptaktion / Export)
2. DE/EN-Lokalisierung vollständig durchziehen (i18n-System angelegt, aber nicht alle Strings migriert)
3. WCAG 2.1 AA Audit (Regel #3)
4. FastAPI Backend mit nashpy für Produktions-Engine
5. SYNTHWERK Cross-Tool-Schema (Regel #27)
6. >2 Akteure: Engine-Erweiterung
7. werkstattlinie.css: nicht anwendbar auf React JSX — eigenes Design-System dokumentiert

---

Thomas Schüller — CC BY 4.0 — ORCID 0009-0003-9799-6747 — forschung@tschueller.com

ca. 1.400 Wörter — v0.6 — 2026-05-12
