# PDI v2.3 — Philosophische Entscheidungsanalyse

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-c4a04e.svg)](https://creativecommons.org/licenses/by/4.0/)
[![Version](https://img.shields.io/badge/Version-2.3.0-blue.svg)](./VERSION)
[![ORCID](https://img.shields.io/badge/ORCID-0009--0003--9799--6747-A6CE39.svg)](https://orcid.org/0009-0003-9799-6747)

**Universal-Provider-Edition** · Mai 2026 · Thomas Schüller

> ⚠️ **Hinweis:** Diese Version wurde nach Wunsch des Autors **ohne abschließenden Browser-Test** veröffentlicht. Bugs sind willkommen unter forschung@tschueller.com oder als GitHub-Issue.

---

## Was ist das?

Ein **interaktives Werkzeug zur systematischen Analyse ethischer Entscheidungssituationen** durch **zwölf philosophische Traditionen**. Pluralistischer Strukturvergleich statt monistische Synthese.

**v2.3 Neuerung:** Universal-Provider-Modul integriert — wähle aus **17 LLM-Anbietern**:

### 🏠 Lokal (offline, gratis)
Ollama · LM Studio · llama.cpp · text-generation-webui · vLLM

### 🟢 Gratis (Cloud, Free-Tier)
OpenRouter Free · Google Gemini Free-Tier · Groq · Hugging Face · Cerebras

### 💳 Bezahlt (höchste Qualität)
Anthropic · OpenAI · OpenRouter · Mistral (EU) · Cohere · Together · Custom Endpoint

---

## Schnellstart

### Variante A — komplett kostenlos
1. `pdi-v2.3.html` doppelklicken
2. Tier "🟢 Gratis" wählen → "OpenRouter (GRATIS-Modelle)"
3. Modell `gemini-2.0-flash-exp:free` oder `llama-3.3-70b:free`
4. Auf [openrouter.ai/keys](https://openrouter.ai/keys) gratis Key holen
5. Eingeben → Speichern → Analysieren

### Variante B — komplett offline
1. [Ollama](https://ollama.com) installieren
2. `ollama pull llama3.2` (Terminal)
3. `pdi-v2.3.html` doppelklicken
4. Tier "🏠 Lokal" → "Ollama" → Modell `llama3.2`
5. Kein Key nötig → Speichern → Analysieren

### Variante C — bezahlt für beste Qualität
1. [console.anthropic.com](https://console.anthropic.com) → Key ($5 Prepaid)
2. `pdi-v2.3.html` öffnen → Tier "💳 Bezahlt" → "Anthropic Claude"

---

## Datei-Inventar

| Datei | Zweck |
|---|---|
| `pdi-v2.3.html` | **Standalone-Tool** (doppelklicken) |
| `pdi-v2.3.jsx` | React-Source |
| `provider-modul.js` | Universal-LLM-Modul v1.0 |
| `werkstattlinie.css` | Design-System |
| `PAPER-strukturvergleich-v1.0.md` | Methodisches Working Paper |
| `LEHRERHANDREICHUNG.md` | Didaktische Anleitung |
| `DATENSCHUTZ.md` / `.html` | DSGVO-Hinweise |
| `SCHEMA-konkordanz-v1.md` | Cross-Tool-Datenschema |
| `LICENSE` / `CITATION.cff` | Lizenz + Zitation |

---

## BYOK-Prinzip (Memory-Regel #9 + #22)

- API-Key bleibt im Browser (`localStorage`)
- Geht direkt an den gewählten Anbieter
- Niemand sonst sieht ihn (auch der Tool-Autor nicht)
- Bei lokalen Modellen: gar keine externe Verbindung

---

## Lizenz

CC BY 4.0 (Doku) + MIT (Code)
© 2026 Thomas Schüller · ORCID 0009-0003-9799-6747
