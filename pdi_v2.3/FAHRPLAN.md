# FAHRPLAN — PDI v2.3 veröffentlichen

**Ein Tool. Eine Veröffentlichung. Fertig.**

Datum: 2026-05-13

---

## Was du hast

`backup_pdi-v2.3_final_2026-05-13.zip` — komplettes Bundle, hochladebereit.

⚠️ **Hinweis:** Ohne abschließenden Browser-Test veröffentlicht. Community findet Bugs, du iterierst später. Hinweis steht im README.

---

## Was schon erledigt ist (von dir)

- ✓ Zenodo-Account angelegt (ORCID-verknüpft)
- ✓ GitHub-Repo erstellt

---

## Schritte zur Veröffentlichung

### 1. ZIP entpacken
`backup_pdi-v2.3_final_2026-05-13.zip` entpacken. Inhalt: 18 Dateien im Ordner `pdi_v2.3/`.

### 2. In dein GitHub-Repo pushen

Im Terminal:
```bash
cd /pfad/zum/entpackten/pdi_v2.3

# Falls noch nicht init:
git init
git branch -M main
git config user.name "Thomas Schüller"
git config user.email "forschung@tschueller.com"

# Dateien hinzufügen
git add .
git commit -m "PDI v2.3.0 — Universal-Provider-Edition

17 LLM-Anbieter in 3 Tiers (lokal/gratis/bezahlt).
Tool ohne Account-Pflicht nutzbar.
Veröffentlicht ohne abschließenden Browser-Test.
CC BY 4.0 (Doku) + MIT (Code)."

# Push (Repo-URL anpassen)
git remote add origin https://github.com/DEIN-USERNAME/DEIN-REPO.git
# Falls Remote schon existiert:
# git remote set-url origin https://github.com/DEIN-USERNAME/DEIN-REPO.git

git push -u origin main
```

### 3. Zenodo-Release erstellen

Auf GitHub-Repo:
1. Rechts: **Releases → "Create a new release"**
2. **Tag:** `v2.3.0`
3. **Title:** `PDI v2.3.0 — Universal-Provider-Edition`
4. **Description:** (siehe Vorlage unten)
5. **"Publish release"**

Zenodo-Hook erkennt den Release automatisch (falls aktiviert). Falls nicht: zenodo.org → Profil → GitHub → Repo auf "On" schalten.

DOI wird automatisch vergeben (~30 Sek). Steht dann in deinem Zenodo-Profil.

### 4. DOI in Files nachtragen

```bash
# Ersetze XXXXX mit deiner DOI-Nummer
DOI="10.5281/zenodo.XXXXX"

# In CITATION.cff:
# Zeile "identifiers:" → doi-Wert einfügen

# In README.md oben das DOI-Badge:
# [![DOI](https://zenodo.org/badge/DOI/$DOI.svg)](https://doi.org/$DOI)

git add CITATION.cff README.md
git commit -m "Add Zenodo DOI: $DOI"
git push
```

### 5. GitHub Pages aktivieren (optional, einfach)

Settings → Pages → Source: `main` / `(root)` → Save.

Nach 1-2 Min ist `pdi-v2.3.html` live unter:
`https://USERNAME.github.io/REPO/pdi-v2.3.html`

### 6. Fertig

Tool ist live. Mit DOI zitierbar. Code auf GitHub. Community kann Issues melden.

---

## Release-Notes-Vorlage

```markdown
# PDI v2.3.0 — Universal-Provider-Edition

Interaktives Werkzeug zur systematischen Analyse ethischer Entscheidungssituationen durch zwölf philosophische Traditionen.

## Was es kann
- 12 philosophische Theorien (Kant, Utilitarismus, Tugendethik, Rawls, Care-Ethik, Diskursethik, Existentialismus, Feministische Ethik, Konfuzianismus, Ubuntu, Naturrecht, Pragmatismus)
- 3 Niveau-Stufen (Sek I, Bachelor, Master)
- 4 Zitationsstile (APA, Harvard, Chicago, MLA)
- 50+ Glossar-Begriffe
- Cross-Tool-Export (konkordanz-v1 JSON, Markdown, BibTeX)
- Standalone-HTML — doppelklicken reicht

## Provider-Auswahl (17 in 3 Tiers)
- **🏠 Lokal (5)**: Ollama, LM Studio, llama.cpp, text-generation-webui, vLLM
- **🟢 Gratis (5)**: OpenRouter Free, Google Gemini Free-Tier, Groq, Hugging Face, Cerebras
- **💳 Bezahlt (7)**: Anthropic, OpenAI, OpenRouter Paid, Mistral, Cohere, Together, Custom Endpoint

## Hinweis
Diese Version wurde ohne abschließenden Browser-Test veröffentlicht. Bug-Reports willkommen als GitHub-Issue.

## Lizenz
CC BY 4.0 (Doku) + MIT (Code) · © 2026 Thomas Schüller · ORCID 0009-0003-9799-6747
```

---

## Bei Problemen

- Tool startet nicht im Browser → Browser-Konsole öffnen (F12), Fehler kopieren, GitHub Issue
- API-Aufruf schlägt fehl → Key falsch eingegeben oder Endpoint nicht erreichbar
- Modell antwortet komisch → kleine lokale Modelle (1B-3B) sind schwach bei Master-Niveau. Größeres Modell wählen.

---

*Eine Version. Eine Veröffentlichung. Community-Feedback abwarten.*
