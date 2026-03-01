# Sovereign Architect OS: Technical Findings

## Tibetan Mewa Implementation
Date: 2026-03-01

**Finding**: Direct programmatic calculation was used for the Tibetan Mewa engine rather than relying on external npm packages (like `@hnw/date-tibetan` or `tibetan-date-calculator`). 
**Reasoning**: Many available tools bundle unnecessary astrological overhead or lack precise TypeScript exports for just the Rabjung cycle and daily Mewa string mappings. By creating a lightweight, mathematically derived `TibetanEngine` mapped directly from the Gregorian UTC offset to the 1027 CE epoch, we avoid heavy dependencies while retaining full execution speed inside the container.
