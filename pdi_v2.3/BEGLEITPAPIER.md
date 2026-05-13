# PDI v2.3 — Begleitpapier

**Universal-Provider-Edition · Mai 2026**
Autor: Thomas Schüller · ORCID 0009-0003-9799-6747 · forschung@tschueller.com
Lizenz: CC BY 4.0 (Doku) + MIT (Code)
Schließungstyp: VERSIONSSCHLUSS auf v2.3 — Patches möglich, Breaking Changes erst in v3.x

---

## Was ist neu in v2.3?

**Provider-Modul-Integration.** PDI verwendet jetzt das eigenständige Provider-Modul v1.0 statt eigene Provider-Logik. Damit stehen 17 LLM-Anbieter zur Wahl, sortiert nach Tier (lokal → gratis → bezahlt).

### Architektur-Konsequenz

PDI ist nicht mehr für die LLM-Anbindung verantwortlich. Das Modul kümmert sich darum. Wenn das Modul aktualisiert wird (z.B. neue Provider, Bugfixes), erhält PDI das automatisch beim nächsten Build.

### Praktischer Vorteil für Nutzer:innen

- **Kein Anthropic-Account mehr nötig** für Erst-Test
- Drei kostenlose Wege: Ollama lokal, OpenRouter Free-Modelle, Google Free-Tier
- Schul-Setups können mit lokalen Modellen DSGVO-konform laufen

---

## Funktion (unverändert seit v2.1)

12 philosophische Traditionen werden parallel auf die eingegebene Situation angewendet:
1. Kantische Pflichtenethik
2. Klassischer Utilitarismus
3. Aristotelische Tugendethik
4. Rawls'sche Gerechtigkeitsethik
5. Care-Ethik (Gilligan, Noddings)
6. Diskursethik (Habermas)
7. Existentialistische Ethik (Sartre, de Beauvoir)
8. Feministische Ethik
9. Konfuzianische Ethik
10. Ubuntu-Ethik
11. Naturrechtsethik
12. Pragmatistische Ethik (Dewey)

Jede Theorie liefert separate Analyse. **Kein Gesamturteil**, keine Synthese — bewusste Pluralität.

---

## Bedienung

### Erst-Einrichtung (einmalig)

1. `pdi-v2.3.html` öffnen → Setup-Gate erscheint
2. **Tier wählen** (Lokal/Gratis/Bezahlt)
3. **Anbieter** auswählen aus Dropdown
4. (bei Lokal/Custom) **Endpoint** prüfen
5. **Modell** auswählen
6. **API-Key** eingeben (bei lokalen oft leer)
7. Speichern → Hauptansicht

### Analyse durchführen

1. **Situation** in Textfeld eingeben (mind. 100 Zeichen)
2. **Theorien** auswählen (2-12)
3. **Niveau**: Sek I, Bachelor oder Master
4. **Zitationsstil**: APA, Harvard, Chicago, MLA
5. **"Analyse starten"** klicken
6. Warten (5-60 Sek je nach Modell und Niveau)
7. Ergebnis erscheint, alle Theorien getrennt

### Export

- **Markdown** (.md): für Dokumentation
- **JSON** (konkordanz-v1-Schema): für Weiterverarbeitung in anderen Tools
- **BibTeX** (.bib): Quellenangaben für Hausarbeit/Paper

---

## Datenmodell

### localStorage-Schlüssel
- `provider-cfg-pdi` — Provider-Konfiguration
- `pdi-history` — bis zu 50 letzte Analysen (Datum, Situation, Ergebnis, Modell)

### Konkordanz-Schema (Cross-Tool-Export)
Siehe `SCHEMA-konkordanz-v1.md`. JSON-Format, das andere Tools im Ökosystem (WertKompass, ETHOSLAB) als Input akzeptieren.

---

## Deploy

### Single-File-Mode
`pdi-v2.3.html` enthält alles inline (React, Provider-Modul, App-Code, Styles). Doppelklicken reicht. Nur Schriftarten werden von fonts.googleapis.com geladen, der Rest läuft offline.

### Web-Mode (z.B. pdi.tschueller.com)
Datei auf Webserver hochladen, fertig. Keine Backend-Logik. Keine Datenbank. Keine Cookies.

---

## Sicherheit und Datenschutz

Siehe `DATENSCHUTZ.md`. Kernpunkte:
- API-Keys verlassen den Browser nicht — gehen direkt an gewählten Anbieter
- Bei lokalen Modellen: gar keine externe Verbindung
- Keine Analytics, Tracking, Cookies
- Lokaler Verlauf nur in localStorage des Browsers

---

## Limitierungen

- **JSON-Output-Stabilität**: Manche Modelle (vor allem kleine lokale wie llama3.2:1b) liefern manchmal JSON in Markdown-Blocks. PDI parst beides, aber bei sehr kleinen Modellen kann der Parse fehlschlagen.
- **Qualität schwankt stark** mit dem Modell. Empfehlung: für Schulaufsätze reichen Gratis-Modelle, für Master-Arbeiten Anthropic Sonnet 4 oder besser.
- **Token-Limits**: Lange Situationen + viele Theorien + Master-Niveau können einige Modelle überfordern. Faustregel: maxal 8 Theorien gleichzeitig auf kleinen Modellen.

---

## Tests vor Release

⚠️ **Diese Version wurde nicht abschließend getestet** (Memory-Regel #30 wurde auf Wunsch des Autors umgangen, da die Veröffentlichung explizit ohne Test gewünscht wurde).

Geplante End-Checks (vom Autor noch durchzuführen):
- [ ] Ollama lokal mit llama3.2 — Vollständige Analyse
- [ ] OpenRouter Free mit Gemini Flash — Vollständige Analyse
- [ ] Anthropic mit Sonnet 4 — Vollständige Analyse (sobald Key vorhanden)
- [ ] Export-Funktionen (MD, JSON, BibTeX)
- [ ] Provider-Wechsel zur Laufzeit
- [ ] localStorage-Persistenz nach Browser-Reload

---

## Versionsgeschichte

- **v2.3** (2026-05-13): Provider-Modul v1.0 integriert, 17 Provider
- **v2.2** (2026-05-12): Multi-Provider inline (3 Anbieter)
- **v2.1** (2026-05-12): Initial Release, BYOK Anthropic
- **v2.0** und früher: interne Iterationen

---

*PDI v2.3 · Universal-Provider-Edition · Thomas Schüller · ORCID 0009-0003-9799-6747 · CC BY 4.0*
