# Sovereign Architect OS: Technical Findings

## Tibetan Mewa Implementation
Date: 2026-03-01

**Finding**: Direct programmatic calculation was used for the Tibetan Mewa engine rather than relying on external npm packages (like `@hnw/date-tibetan` or `tibetan-date-calculator`). 
**Reasoning**: Many available tools bundle unnecessary astrological overhead or lack precise TypeScript exports for just the Rabjung cycle and daily Mewa string mappings. By creating a lightweight, mathematically derived `TibetanEngine` mapped directly from the Gregorian UTC offset to the 1027 CE epoch, we avoid heavy dependencies while retaining full execution speed inside the container.

## Python Async Astronomy Constraint
Date: 2026-03-01

**Finding**: `pyswisseph` and `flatlib` are strictly synchronous C-extensions. Under load, these libraries will entirely block the Python event loop if used directly inside a native FastAPI `async` handler.
**Reasoning**: High-precision astrological ephemeris requires intense single-threaded C computation. To protect the asynchronous concurrency model of the `astro-engine` microservice, all calculations interacting with the SWISSEPH bindings must be offloaded using `asyncio.to_thread()` or an explicit `ThreadPoolExecutor`. This mandates a strict boundary between our Pydantic validation (I/O bound) and the planetary calculus (CPU bound).
