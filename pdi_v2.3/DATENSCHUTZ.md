# Datenschutz-Hinweise — PDI v2.1

Stand: Mai 2026 · CC BY 4.0

---

## Zusammenfassung in einem Satz

Das PDI speichert deine Analysen ausschließlich lokal in deinem Browser; eingegebene Texte werden zur Analyse an die Anthropic-API geschickt und unterliegen deren Datenschutzbestimmungen.

---

## 1. Wer ist verantwortlich?

**Verantwortlich für das Tool (Code, Konzept):**
Thomas Schüller
Wien, Österreich
forschung@tschueller.com
ORCID: 0009-0003-9799-6747

**Verantwortlich für die KI-Verarbeitung:**
Anthropic, PBC
548 Market St, PMB 90375
San Francisco, CA 94104, USA
Datenschutzbestimmungen: https://www.anthropic.com/legal/privacy

---

## 2. Welche Daten werden verarbeitet?

### 2.1 Was du eingibst

- **Situationstext** (Freitext-Beschreibung deiner ethischen Frage)
- **Konfiguration** (Niveau, Zitierstil, Theorienauswahl)

### 2.2 Was lokal in deinem Browser gespeichert wird

- Bis zu 50 deiner letzten Analysen
- Speicherort: Browser-Storage (window.storage)
- Niemals an Server übertragen
- Löschbar über die "Archiv leeren"-Funktion oder durch Browser-Daten-Löschen

### 2.3 Was an Anthropic übertragen wird

Bei jeder Analyse:
- Deine Situationsbeschreibung
- Die Theorienauswahl
- Die Niveau-Einstellung

Anthropic verarbeitet diese Daten gemäß den eigenen Datenschutzbestimmungen. Anthropic kann Anfragen für Sicherheits- und Missbrauchsprüfung zwischenspeichern.

---

## 3. Rechtsgrundlagen (DSGVO)

| Verarbeitung | Rechtsgrundlage |
|---|---|
| Lokale Browser-Speicherung | Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse: Nutzbarkeit) |
| Übertragung an Anthropic | Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung: Du wählst die Analyse) |

---

## 4. Drittland-Übermittlung

Die Anthropic-API verarbeitet Daten in den USA. Anthropic verwendet EU-Standardvertragsklauseln (SCC) gemäß Art. 46 Abs. 2 lit. c DSGVO. Bitte informiere dich in Anthropics Datenschutzerklärung über aktuelle Details.

---

## 5. Empfehlungen für sensible Inhalte

**Anonymisiere personenbezogene Inhalte vor der Eingabe:**

- ❌ "Mein Kollege Markus Müller hat..."
- ✓ "Ein Kollege hat..."

- ❌ "Meine Tochter, die in der Schule [Schulname] in der 3B ist..."
- ✓ "Meine Tochter im Schulalter..."

**Verzichte auf Eingabe von:**
- Vollständigen Namen Dritter
- Adressen, Geburtsdaten
- Krankheitsbefunde mit Klarnamen
- Strafrechtlich relevanten Detailangaben

Diese Empfehlungen gelten umso strenger im **Schul-/Bildungskontext** (Minderjährigenschutz).

---

## 6. Deine Rechte

Nach DSGVO hast du Recht auf:

- **Auskunft** (Art. 15): Was wurde verarbeitet?
- **Berichtigung** (Art. 16)
- **Löschung** (Art. 17): Browser-Daten löschen löscht alle lokalen Analysen.
- **Datenübertragbarkeit** (Art. 20): JSON-Export aus dem Tool selbst möglich.
- **Beschwerde** bei der Datenschutzbehörde (für Österreich: dsb.gv.at)

Für Anfragen an den Tool-Betreiber: forschung@tschueller.com
Für Anfragen an Anthropic: privacy@anthropic.com

---

## 7. Was das Tool NICHT tut

- ❌ Kein Tracking, kein Analytics
- ❌ Keine Cookies (außer technische lokale Speicherung)
- ❌ Keine Werbung
- ❌ Kein Profiling
- ❌ Kein Weiterverkauf von Daten
- ❌ Keine Nutzer:innen-Accounts

---

## 8. Open Source

Der Quellcode ist unter CC BY 4.0 verfügbar. Du kannst:
- Den Code selbst inspizieren
- Eine eigene Instanz hosten (z.B. lokal, ohne Internet-Verbindung wäre eine eigene LLM-Anbindung erforderlich)
- Modifikationen vornehmen, solange die Lizenz eingehalten wird

---

*Datenschutz-Hinweise · v1.0 · Mai 2026 · CC BY 4.0*
*Thomas Schüller · Wien*
