/* ===================================================================
   PROVIDER-MODUL v1.0 — Universal LLM-Anbindung
   Memory-Regel #22 (Provider-Agnostik) — LOCAL-FIRST + FREE-FIRST
   -------------------------------------------------------------------
   Autor: Thomas Schüller · ORCID 0009-0003-9799-6747
   Lizenz: CC BY 4.0 (Doku) + MIT (Code)
   
   ZWECK:
   Drop-in-Modul für alle LLM-Tools im Ökosystem (PDI, WertKompass,
   ETHOSLAB, MYZEL, GOVERNANCE, RECHERCHETOOL, etc.).
   Bietet einheitliches API für ~13 Provider:
   - LOKAL: Ollama, LM Studio, llama.cpp, text-gen-webui, vLLM
   - GRATIS: OpenRouter (Free), Google Gemini (Free-Tier), Groq, HuggingFace
   - BEZAHLT: Anthropic, OpenAI, Mistral, Cohere, Together, Custom
   
   NUTZUNG (in einem Tool):
   1. <script src="provider-modul.js"><\/script>
   2. const cfg = ProviderModul.loadConfig("mein-tool");
   3. if (!cfg) ProviderModul.showSetupGate(onConfig);
   4. const result = await ProviderModul.call(cfg, systemPrompt, userPrompt);
   =================================================================== */

(function(global) {
  'use strict';

  // ─── PROVIDER-DEFINITIONEN ───────────────────────────────────────
  const PROVIDERS = {
    // ======= TIER 1: LOKAL (offline, gratis, DSGVO-konform) =======
    ollama: {
      tier: "local",
      label: "🏠 Ollama (lokal)",
      hint: "Vollständig offline. Installation: ollama.com",
      url: "https://ollama.com/download",
      keyOptional: true,
      needsEndpoint: true,
      defaultEndpoint: "http://localhost:11434/v1/chat/completions",
      adapter: "openai_compat",
      models: [
        {id:"llama3.2", label:"Llama 3.2 3B (Standard, schnell)"},
        {id:"llama3.2:1b", label:"Llama 3.2 1B (kleinster, schnellster)"},
        {id:"llama3.3", label:"Llama 3.3 70B (groß, gute Qualität)"},
        {id:"qwen2.5:7b", label:"Qwen 2.5 7B"},
        {id:"qwen2.5:14b", label:"Qwen 2.5 14B (gute Balance)"},
        {id:"qwen2.5:32b", label:"Qwen 2.5 32B"},
        {id:"mistral", label:"Mistral 7B"},
        {id:"mistral-nemo", label:"Mistral Nemo 12B"},
        {id:"phi3.5", label:"Phi 3.5 Mini (Microsoft, klein)"},
        {id:"phi4", label:"Phi 4 (14B, Microsoft)"},
        {id:"gemma2", label:"Gemma 2 9B (Google)"},
        {id:"gemma2:27b", label:"Gemma 2 27B"},
        {id:"deepseek-r1", label:"DeepSeek R1 (Reasoning)"},
        {id:"deepseek-r1:14b", label:"DeepSeek R1 14B"},
        {id:"deepseek-r1:32b", label:"DeepSeek R1 32B"},
        {id:"command-r", label:"Command R (Cohere)"},
        {id:"command-r7b", label:"Command R7B (klein, EU)"},
        {id:"granite3.1-dense", label:"Granite 3.1 (IBM)"}
      ],
      info: "Offline. DSGVO-konform. Kein Token-Limit. Hardware: 8GB RAM für 7B, 16GB für 14B, 32+GB für 70B. GPU empfohlen."
    },

    lmstudio: {
      tier: "local",
      label: "🏠 LM Studio (lokal)",
      hint: "GUI für lokale Modelle. lmstudio.ai installieren, Server starten",
      url: "https://lmstudio.ai/",
      keyOptional: true,
      needsEndpoint: true,
      defaultEndpoint: "http://localhost:1234/v1/chat/completions",
      adapter: "openai_compat",
      customModel: true,
      models: [],
      info: "Beliebte GUI mit großer Modell-Auswahl (Hugging Face). Offline."
    },

    llamacpp: {
      tier: "local",
      label: "🏠 llama.cpp (lokal)",
      hint: "Maximale Effizienz, GGUF-Modelle. ./server -m model.gguf",
      url: "https://github.com/ggerganov/llama.cpp",
      keyOptional: true,
      needsEndpoint: true,
      defaultEndpoint: "http://localhost:8080/v1/chat/completions",
      adapter: "openai_compat",
      customModel: true,
      models: [],
      info: "C++ Server. Auch CPU-only. Niedrigste Hardware-Anforderung."
    },

    textgen: {
      tier: "local",
      label: "🏠 text-generation-webui (lokal)",
      hint: "Oobabooga's WebUI mit OpenAI-API-Extension",
      url: "https://github.com/oobabooga/text-generation-webui",
      keyOptional: true,
      needsEndpoint: true,
      defaultEndpoint: "http://localhost:5000/v1/chat/completions",
      adapter: "openai_compat",
      customModel: true,
      models: [],
      info: "WebUI mit vielen Backends. Offline."
    },

    vllm: {
      tier: "local",
      label: "🏠 vLLM (Self-Hosted)",
      hint: "Self-Hosted Production-Server mit GPU",
      url: "https://github.com/vllm-project/vllm",
      keyOptional: true,
      needsEndpoint: true,
      defaultEndpoint: "http://localhost:8000/v1/chat/completions",
      adapter: "openai_compat",
      customModel: true,
      models: [],
      info: "Performance-optimiert für Produktiv-Deployment."
    },

    // ======= TIER 2: GRATIS (Cloud, Free-Tier/Free-Models) =======
    openrouter_free: {
      tier: "free",
      label: "🟢 OpenRouter (GRATIS-Modelle)",
      hint: "openrouter.ai → Key erstellen (gratis)",
      url: "https://openrouter.ai/keys",
      keyPrefix: "sk-or-",
      defaultEndpoint: "https://openrouter.ai/api/v1/chat/completions",
      adapter: "openai_compat",
      models: [
        {id:"meta-llama/llama-3.3-70b-instruct:free", label:"Llama 3.3 70B (GRATIS)"},
        {id:"google/gemini-2.0-flash-exp:free", label:"Gemini 2.0 Flash (GRATIS)"},
        {id:"deepseek/deepseek-r1:free", label:"DeepSeek R1 (GRATIS, Reasoning)"},
        {id:"deepseek/deepseek-chat:free", label:"DeepSeek V3 (GRATIS)"},
        {id:"qwen/qwen-2.5-72b-instruct:free", label:"Qwen 2.5 72B (GRATIS)"},
        {id:"meta-llama/llama-3.2-3b-instruct:free", label:"Llama 3.2 3B (GRATIS, schnell)"},
        {id:"google/gemma-2-9b-it:free", label:"Gemma 2 9B (GRATIS)"},
        {id:"microsoft/phi-3-medium-128k-instruct:free", label:"Phi 3 Medium (GRATIS)"},
        {id:"nousresearch/hermes-3-llama-3.1-405b:free", label:"Hermes 3 405B (GRATIS)"},
        {id:"mistralai/mistral-7b-instruct:free", label:"Mistral 7B (GRATIS)"}
      ],
      info: "200+ kostenlose Modelle. Rate-Limits, aber kein Bezahl-Zwang. Bester Einstieg."
    },

    google_free: {
      tier: "free",
      label: "🟢 Google Gemini (Free-Tier)",
      hint: "aistudio.google.com → Get API key (1500 Req/Tag gratis)",
      url: "https://aistudio.google.com/apikey",
      defaultEndpoint: "",
      adapter: "google",
      models: [
        {id:"gemini-2.0-flash-exp", label:"Gemini 2.0 Flash (GRATIS, neuestes)"},
        {id:"gemini-1.5-flash", label:"Gemini 1.5 Flash (GRATIS)"},
        {id:"gemini-1.5-flash-8b", label:"Gemini 1.5 Flash 8B (GRATIS, schnell)"},
        {id:"gemini-1.5-pro", label:"Gemini 1.5 Pro (50/Tag GRATIS)"}
      ],
      info: "Free-Tier: 1500 Req/Tag bei Flash, 50/Tag bei Pro."
    },

    groq_free: {
      tier: "free",
      label: "🟢 Groq (GRATIS, ultraschnell)",
      hint: "console.groq.com → Key (gratis, großzügiges Rate-Limit)",
      url: "https://console.groq.com/keys",
      keyPrefix: "gsk_",
      defaultEndpoint: "https://api.groq.com/openai/v1/chat/completions",
      adapter: "openai_compat",
      models: [
        {id:"llama-3.3-70b-versatile", label:"Llama 3.3 70B (GRATIS, ~500 Tok/s)"},
        {id:"llama-3.1-70b-versatile", label:"Llama 3.1 70B (GRATIS)"},
        {id:"llama-3.1-8b-instant", label:"Llama 3.1 8B (GRATIS, blitzschnell)"},
        {id:"mixtral-8x7b-32768", label:"Mixtral 8x7B (GRATIS)"},
        {id:"gemma2-9b-it", label:"Gemma 2 9B (GRATIS)"},
        {id:"deepseek-r1-distill-llama-70b", label:"DeepSeek R1 Distill 70B (GRATIS)"}
      ],
      info: "LPU-Hardware: 10x schneller als GPUs. Großzügige Rate-Limits."
    },

    huggingface_free: {
      tier: "free",
      label: "🟢 Hugging Face Inference (GRATIS)",
      hint: "huggingface.co → Settings → Access Tokens",
      url: "https://huggingface.co/settings/tokens",
      keyPrefix: "hf_",
      needsEndpoint: true,
      defaultEndpoint: "https://api-inference.huggingface.co/v1/chat/completions",
      adapter: "openai_compat",
      models: [
        {id:"meta-llama/Llama-3.3-70B-Instruct", label:"Llama 3.3 70B (GRATIS)"},
        {id:"Qwen/Qwen2.5-72B-Instruct", label:"Qwen 2.5 72B (GRATIS)"},
        {id:"mistralai/Mistral-7B-Instruct-v0.3", label:"Mistral 7B (GRATIS)"},
        {id:"microsoft/Phi-3.5-mini-instruct", label:"Phi 3.5 Mini (GRATIS)"}
      ],
      info: "Direkter Zugriff auf HF-Hub-Modelle. Free-Tier mit Rate-Limits."
    },

    cerebras_free: {
      tier: "free",
      label: "🟢 Cerebras (GRATIS, ultraschnell)",
      hint: "cloud.cerebras.ai → API Keys (gratis Tier)",
      url: "https://cloud.cerebras.ai/",
      defaultEndpoint: "https://api.cerebras.ai/v1/chat/completions",
      adapter: "openai_compat",
      models: [
        {id:"llama-3.3-70b", label:"Llama 3.3 70B (GRATIS, schnellste Inferenz weltweit)"},
        {id:"llama3.1-8b", label:"Llama 3.1 8B (GRATIS)"}
      ],
      info: "Wafer-Scale-Chips. Schnellste Inferenz. Free-Tier verfügbar."
    },

    // ======= TIER 3: BEZAHLT (höchste Qualität) =======
    anthropic: {
      tier: "paid",
      label: "💳 Anthropic Claude",
      hint: "console.anthropic.com → API Keys (mind. $5 Prepaid)",
      url: "https://console.anthropic.com/settings/keys",
      keyPrefix: "sk-ant-",
      defaultEndpoint: "https://api.anthropic.com/v1/messages",
      adapter: "anthropic",
      models: [
        {id:"claude-sonnet-4-20250514", label:"Claude Sonnet 4 (empfohlen)"},
        {id:"claude-opus-4-20250514", label:"Claude Opus 4 (höchste Qualität)"},
        {id:"claude-haiku-4-5-20251001", label:"Claude Haiku 4.5 (schnell, günstig)"}
      ],
      info: "Höchste Qualität für komplexes Reasoning. Pay-as-you-go."
    },

    openai: {
      tier: "paid",
      label: "💳 OpenAI GPT",
      hint: "platform.openai.com → API Keys",
      url: "https://platform.openai.com/api-keys",
      keyPrefix: "sk-",
      defaultEndpoint: "https://api.openai.com/v1/chat/completions",
      adapter: "openai_compat",
      models: [
        {id:"gpt-4o", label:"GPT-4o (Standard)"},
        {id:"gpt-4o-mini", label:"GPT-4o mini (günstig)"},
        {id:"o1", label:"o1 (Reasoning, teuer)"},
        {id:"o1-mini", label:"o1-mini (Reasoning, günstiger)"},
        {id:"o3-mini", label:"o3-mini (Reasoning)"}
      ],
      info: "Industrie-Standard. Pay-as-you-go."
    },

    openrouter_paid: {
      tier: "paid",
      label: "💳 OpenRouter (alle Modelle)",
      hint: "openrouter.ai → Credits aufladen",
      url: "https://openrouter.ai/keys",
      keyPrefix: "sk-or-",
      defaultEndpoint: "https://openrouter.ai/api/v1/chat/completions",
      adapter: "openai_compat",
      models: [
        {id:"anthropic/claude-sonnet-4", label:"Claude Sonnet 4"},
        {id:"anthropic/claude-opus-4", label:"Claude Opus 4"},
        {id:"openai/gpt-4o", label:"GPT-4o"},
        {id:"openai/o1", label:"OpenAI o1"},
        {id:"google/gemini-2.0-flash-exp", label:"Gemini 2.0 Flash"},
        {id:"mistralai/mistral-large", label:"Mistral Large"},
        {id:"meta-llama/llama-3.3-70b-instruct", label:"Llama 3.3 70B"},
        {id:"deepseek/deepseek-chat", label:"DeepSeek V3"}
      ],
      info: "200+ Modelle über eine API. ~5% Aufschlag."
    },

    mistral: {
      tier: "paid",
      label: "💳 Mistral (EU-Provider)",
      hint: "console.mistral.ai → API Keys (Frankreich, DSGVO)",
      url: "https://console.mistral.ai/api-keys/",
      defaultEndpoint: "https://api.mistral.ai/v1/chat/completions",
      adapter: "openai_compat",
      models: [
        {id:"mistral-large-latest", label:"Mistral Large"},
        {id:"mistral-medium-latest", label:"Mistral Medium"},
        {id:"mistral-small-latest", label:"Mistral Small (günstig)"},
        {id:"open-mistral-nemo", label:"Open Mistral Nemo (open weights)"}
      ],
      info: "EU-Anbieter, DSGVO-stark. Open Models verfügbar."
    },

    cohere: {
      tier: "paid",
      label: "💳 Cohere Command",
      hint: "dashboard.cohere.com → API Keys",
      url: "https://dashboard.cohere.com/api-keys",
      defaultEndpoint: "https://api.cohere.com/v2/chat",
      adapter: "cohere",
      models: [
        {id:"command-r-plus", label:"Command R+ (Top)"},
        {id:"command-r", label:"Command R"}
      ],
      info: "Enterprise-RAG-Spezialist. Trial-Tier verfügbar."
    },

    together: {
      tier: "paid",
      label: "💳 Together AI",
      hint: "api.together.ai → Keys",
      url: "https://api.together.xyz/settings/api-keys",
      defaultEndpoint: "https://api.together.xyz/v1/chat/completions",
      adapter: "openai_compat",
      models: [
        {id:"meta-llama/Llama-3.3-70B-Instruct-Turbo", label:"Llama 3.3 70B Turbo"},
        {id:"Qwen/Qwen2.5-72B-Instruct-Turbo", label:"Qwen 2.5 72B Turbo"},
        {id:"deepseek-ai/DeepSeek-V3", label:"DeepSeek V3"},
        {id:"mistralai/Mixtral-8x22B-Instruct-v0.1", label:"Mixtral 8x22B"}
      ],
      info: "Open-Weight-Modelle. Günstige Preise."
    },

    custom: {
      tier: "paid",
      label: "⚙️ Custom Endpoint (frei)",
      hint: "Beliebige OpenAI-kompatible API",
      url: "",
      keyOptional: true,
      needsEndpoint: true,
      defaultEndpoint: "",
      adapter: "openai_compat",
      customModel: true,
      models: [],
      info: "Self-Hosted, Cloud-Proxy, neue Anbieter. Frei eingebbar."
    }
  };

  // ─── REQUEST-ADAPTER (3 Standards) ──────────────────────────────
  const ADAPTERS = {
    anthropic: function(key, model, system, user, endpoint) {
      return {
        url: endpoint || "https://api.anthropic.com/v1/messages",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: {model, max_tokens: 8000, system, messages: [{role:"user", content:user}]},
        extract: (d) => {
          if (d.error) throw new Error(d.error.message || "Anthropic API-Fehler");
          return d.content.filter(b => b.type === "text").map(b => b.text).join("");
        }
      };
    },

    openai_compat: function(key, model, system, user, endpoint) {
      return {
        url: endpoint,
        headers: {
          "Content-Type": "application/json",
          ...(key ? {"Authorization": "Bearer " + key} : {})
        },
        body: {
          model,
          max_tokens: 8000,
          messages: [{role:"system", content:system}, {role:"user", content:user}]
        },
        extract: (d) => {
          if (d.error) throw new Error(typeof d.error === "string" ? d.error : (d.error.message || JSON.stringify(d.error)));
          if (!d.choices || !d.choices[0]) throw new Error("Unerwartetes Antwortformat");
          return d.choices[0].message.content;
        }
      };
    },

    google: function(key, model, system, user, endpoint) {
      return {
        url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        headers: {"Content-Type": "application/json"},
        body: {
          systemInstruction: {parts: [{text: system}]},
          contents: [{parts: [{text: user}]}],
          generationConfig: {maxOutputTokens: 8000, responseMimeType: "application/json"}
        },
        extract: (d) => {
          if (d.error) throw new Error(d.error.message || "Google API-Fehler");
          if (!d.candidates || !d.candidates[0]) throw new Error("Keine Antwort von Gemini");
          return d.candidates[0].content.parts.map(p => p.text).join("");
        }
      };
    },

    cohere: function(key, model, system, user, endpoint) {
      return {
        url: endpoint || "https://api.cohere.com/v2/chat",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + key
        },
        body: {
          model,
          messages: [{role:"system", content:system}, {role:"user", content:user}]
        },
        extract: (d) => {
          if (d.error) throw new Error(typeof d.error === "string" ? d.error : (d.error.message || "Cohere API-Fehler"));
          if (!d.message?.content) throw new Error("Cohere: kein Inhalt");
          return Array.isArray(d.message.content) ? d.message.content.map(c => c.text).join("") : d.message.content;
        }
      };
    }
  };

  // ─── HAUPT-API ──────────────────────────────────────────────────

  /** Konfiguration aus localStorage laden. */
  function loadConfig(toolName) {
    try {
      const key = "provider-cfg-" + (toolName || "default");
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch(e) { return null; }
  }

  /** Konfiguration speichern. */
  function saveConfig(toolName, cfg) {
    try {
      const key = "provider-cfg-" + (toolName || "default");
      localStorage.setItem(key, JSON.stringify(cfg));
    } catch(e) {}
  }

  /** Konfiguration löschen. */
  function clearConfig(toolName) {
    try {
      const key = "provider-cfg-" + (toolName || "default");
      localStorage.removeItem(key);
    } catch(e) {}
  }

  /** LLM-Aufruf mit gegebener Konfiguration. */
  async function call(cfg, systemPrompt, userPrompt) {
    if (!cfg || !cfg.provider) throw new Error("Keine Provider-Konfiguration");
    const p = PROVIDERS[cfg.provider];
    if (!p) throw new Error("Unbekannter Provider: " + cfg.provider);

    const adapter = ADAPTERS[p.adapter];
    if (!adapter) throw new Error("Unbekannter Adapter: " + p.adapter);

    const req = adapter(cfg.key || "", cfg.model, systemPrompt, userPrompt, cfg.endpoint || p.defaultEndpoint);

    const r = await fetch(req.url, {
      method: "POST",
      headers: req.headers,
      body: JSON.stringify(req.body)
    });

    if (!r.ok) {
      const errText = await r.text();
      let msg = errText;
      try {
        const parsed = JSON.parse(errText);
        msg = parsed.error?.message || parsed.error || parsed.message || errText;
      } catch(e) {}
      throw new Error(`HTTP ${r.status}: ${typeof msg === "string" ? msg.slice(0, 300) : JSON.stringify(msg).slice(0, 300)}`);
    }

    const d = await r.json();
    return req.extract(d);
  }

  /** Provider gruppiert nach Tier zurückgeben (lokal → gratis → bezahlt). */
  function getProvidersByTier() {
    const grp = {local: [], free: [], paid: []};
    Object.entries(PROVIDERS).forEach(([k, v]) => grp[v.tier].push([k, v]));
    return grp;
  }

  /** Validierung: ist eine Config vollständig? */
  function isConfigValid(cfg) {
    if (!cfg || !cfg.provider) return false;
    const p = PROVIDERS[cfg.provider];
    if (!p) return false;
    if (!cfg.model || cfg.model.length === 0) return false;
    if (p.needsEndpoint && (!cfg.endpoint || cfg.endpoint.length < 5)) return false;
    if (!p.keyOptional && (!cfg.key || cfg.key.length < 3)) return false;
    return true;
  }

  // ─── EXPORT ─────────────────────────────────────────────────────
  global.ProviderModul = {
    version: "1.0.0",
    PROVIDERS,
    ADAPTERS,
    loadConfig,
    saveConfig,
    clearConfig,
    call,
    getProvidersByTier,
    isConfigValid,
    TIER_LABELS: {
      local: "🏠 LOKAL — Offline, deine Hardware, gratis",
      free: "🟢 GRATIS — Cloud-Provider mit Free-Tier",
      paid: "💳 BEZAHLT — Höchste Qualität, kostenpflichtig"
    }
  };

})(typeof window !== "undefined" ? window : globalThis);
