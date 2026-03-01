# Architecture Decision Record: Async Thread-Pooling for Astronomy Extensions
**Date**: 2026-03-01
**Status**: Accepted

## Context
The `astro-engine` microservice in the Sovereign Architect OS requires highly precise planetary and celestial node calculations (Vedic, Hellenistic). We have adopted `pyswisseph` (the Python binding for the Swiss Ephemeris) as the mathematical backbone.

However, `pyswisseph` and legacy wrappers like `flatlib` are purely synchronous C-extensions. If executed directly inside FastAPI's native `async` request handlers, a single complex ephemeris calculation will stall the entire event loop, destroying the framework's concurrency benefits and severely impacting throughput under load.

Additionally, the compiled nature of these C-extensions introduces significant bloat and OS-level dependencies (`gcc`, `python3-dev`) during the dependency installation phase, which bloats the runtime Docker container if not managed carefully.

## Decision
1. **Thread-Pooling for CPU-Bound Math**: All interactions with synchronous ephemeris libraries MUST be pushed to a separate thread pool. We will enforce the use of `asyncio.to_thread()` (or a dedicated `ThreadPoolExecutor`) in the core calculator services (`src/core/ephemeris.py`). The FastAPI routing layer will remain strictly `async` and await the results from the thread pool.
2. **Multi-Stage Docker Builds**: The `astro-engine` Dockerfile MUST utilize a multi-stage build. A `builder` stage will install the necessary `apt` C-compilers and build the `pyswisseph` wheels. The final runtime image will be strictly `python:3.12-slim`, copying only the resulting `.local/lib/site-packages` directory, discarding the massive compilation toolchain.

## Consequences
- **Positive**: The FastAPI event loop remains unblocked, allowing high concurrent throughput for incoming validation and orchestration tasks.
- **Positive**: The final runtime Docker container size is drastically reduced, mitigating vulnerability surfaces and improving deployment velocity.
- **Negative**: Adds a slight context-switching overhead (~1-2ms) when offloading to the thread pool, though this is negligible compared to the event-loop starvation it prevents.
