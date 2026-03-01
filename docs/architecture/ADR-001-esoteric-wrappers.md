# ADR-001: Esoteric Wrappers Schema Architecture

## Status
Accepted

## Context
The "Sovereign Architect OS" relies heavily on precise timing calculations from multiple distinct cultural/astrological systems (Chinese BaZi, Jewish Halacha, Islamic Adhan, Persian Jalali, Tibetan Mewa, and Mayan Tzolkin). The eventual goal is to pipe this diverse telemetry into a Python-based LangGraph engine backed by DeepSeek for Retrieval-Augmented Generation (RAG). 

We need an architecture that ensures high mathematical fidelity before handing data over to LLMs, which are notoriously prone to hallucination when performing math on raw date strings.

## Decision
1. **Strict Zod Schemas**: Every astrological or cultural timing engine MUST output its payload strictly typed and validated through a Zod schema (`*OutputSchema`). 
2. **TypeScript for Calculation Wrappers**: We are enforcing the separation of concerns by building these calculating engines in TypeScript (`esoteric-wrappers`) to leverage the robust npm ecosystem (e.g., `lunar-javascript`, `kosher-zmanim`, `adhan`, `jalaali-js`).
3. **Python for Orchestration/Vedic**: Complex predictive astrology (like Vedic Jyotish) and LLM orchestration (LangGraph) will be reserved for Python environments where AI and data-science libraries excel. The TypeScript server will act as a unified bridging API.

## Consequences
- **Positive**: Complete elimination of LLM hallucination for core timing mathematics. Zod guarantees that if an engine returns a value, it adheres flawlessly to the expected type and data structure.
- **Positive**: Clear boundaries between mathematical retrieval (TS) and AI orchestration (Python).
- **Negative**: Increased complexity due to maintaining a polyglot monorepo structure and requiring an API Gateway to bridge TS and Python components.
