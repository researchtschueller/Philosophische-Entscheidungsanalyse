# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/de/1.1.0/) · SemVer.

---

## [2.3.0] — 2026-05-13

### Hinzugefügt
- **Provider-Modul v1.0** integriert (17 LLM-Provider in 3 Tiers)
- Neue Tiers: 🏠 Lokal (5), 🟢 Gratis (5), 💳 Bezahlt (7)
- Provider: Ollama, LM Studio, llama.cpp, text-gen-webui, vLLM, OpenRouter Free, Google Gemini Free-Tier, Groq, Hugging Face, Cerebras, Anthropic, OpenAI, OpenRouter Paid, Mistral, Cohere, Together, Custom Endpoint
- LOCAL-FIRST + FREE-FIRST UI-Sortierung
- Custom-Endpoint-Eingabe für Self-Hosted und neue Anbieter

### Geändert
- Provider-Code aus PDI entfernt → Universal-Modul (`provider-modul.js`)
- Tool ist jetzt ohne Account-Pflicht nutzbar (Ollama, OpenRouter Free)

### Hinweis
- Diese Version ist auf Wunsch des Autors **ohne abschließenden Browser-Test** veröffentlicht. Bug-Reports willkommen.

---

## [2.2.0] — 2026-05-12

### Hinzugefügt
- Multi-Provider-Architektur (3 Anbieter: Anthropic, OpenAI-compat, Google)

---

## [2.1.0] — 2026-05-12

### Hinzugefügt
- Initial-Release: BYOK-Edition mit Anthropic
- 12 philosophische Theorien
- 3 Niveau-Stufen (Sek/Bachelor/Master)
- 4 Zitationsstile (APA, Harvard, Chicago, MLA)
- Standalone-HTML
