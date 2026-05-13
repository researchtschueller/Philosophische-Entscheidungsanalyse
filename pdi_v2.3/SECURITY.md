# Sicherheitsrichtlinie

## Sicherheitslücken melden

Falls du eine Sicherheitslücke im PDI-Tool oder in den begleitenden
Dokumentationen entdeckst, melde sie bitte **nicht öffentlich** in einem
Issue, sondern direkt per E-Mail.

**Kontakt:** forschung@tschueller.com
**PGP-Key:** (auf Anfrage)

Bitte gib in der Meldung an:

- Welche Komponente betroffen ist (Tool-Code, Begleitdokumentation, Hosting-Setup)
- Reproduktionsschritte
- Mögliche Auswirkungen
- Falls bekannt: Vorschlag für eine Behebung

## Verantwortliche Offenlegung

Bitte räume mir **60 Tage** Zeit ein, eine Behebung zu erarbeiten, bevor du
Details öffentlich machst. Falls die Schwere und Dringlichkeit eine
schnellere Reaktion erfordert, sprich das in der Meldung explizit an.

## Anerkennung

Wer Sicherheitslücken verantwortlich meldet, wird auf Wunsch in einer
Anerkennungsliste (Hall of Fame) genannt.

## Bekannte Sicherheits-Eigenschaften

### Was das Tool tut
- **Anthropic-API-Aufrufe:** Direkt aus dem Frontend (Single-Page-Application).
  Bei einer typischen Installation muss der API-Key serverseitig oder durch BYOK
  (siehe Roadmap v2.3) abgesichert werden.
- **Persistente Speicherung:** Browser-internes `window.storage`, keine Server-Übertragung.
- **Keine Cookies, kein Tracking, kein Analytics.**

### Was Nutzer:innen beachten sollten
- **Eingegebene Texte** werden an die Anthropic-API übertragen. Sensible
  personenbezogene Daten vor Eingabe anonymisieren (siehe DATENSCHUTZ.md).
- **Lokal gespeicherte Analysen** sind nicht verschlüsselt im Browser-Storage.
  Bei Mehrnutzer-Geräten ggf. Browser-Profile trennen oder Verlauf manuell
  löschen.
- **Cross-Tool-JSON-Exporte** enthalten den vollen Analysetext. Vor Weitergabe
  ggf. anonymisieren.

### Bekannte Limitierungen
- Kein TLS-Pinning für API-Calls (Browser-Standard)
- Kein Schutz vor Malicious-Browser-Extensions
- Kein Tamper-Protection für lokal gespeicherte Analysen

## Lieferketten-Sicherheit

Das Tool nutzt:
- **React** (Standard-Bibliothek, weit verbreitet)
- **Anthropic SDK / API** (offizielles Endpoint)

Keine weiteren externen Abhängigkeiten in der Single-File-Variante.

## Updates

Bei Sicherheits-relevanten Updates wird in folgenden Kanälen informiert:

- `CHANGELOG.md` (Version-Eintrag mit Hinweis)
- E-Mail an Interessenten (auf Anfrage Mailing-Liste)
- Zenodo-Versionierung (neue Version mit Hinweis)

---

*SECURITY.md · CC BY 4.0 · Mai 2026 · Thomas Schüller*
