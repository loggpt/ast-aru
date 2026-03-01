# Unified API Contract: Esoteric Wrappers (v1)

## Endpoint: `POST /api/v1/timing/analyze`

### Request Payload
```json
{
  "date": "2026-03-01T12:00:00.000Z",
  "location": {
    "latitude": 21.4225,
    "longitude": 39.8262,
    "timezone": "Asia/Riyadh"
  }
}
```

### Proposed Aggregated Response
This endpoint acts as a multiplexer, routing the input Date and Location parameters through all currently active TypeScript wrapper engines. The output is a strict, Zod-validated JSON tree perfect for ingestion by the DeepSeek LangGraph RAG.

```json
{
  "status": "success",
  "data": {
    "bazi": {
      "pillars": {
        "year": { "heavenlyStem": "Fire", "earthlyBranch": "Horse" },
        "month": { "heavenlyStem": "Wood", "earthlyBranch": "Tiger" },
        "day": { "heavenlyStem": "Earth", "earthlyBranch": "Dragon" },
        "hour": { "heavenlyStem": "Metal", "earthlyBranch": "Monkey" }
      },
      "elementBalance": {
        "wood": 1,
        "fire": 2,
        "earth": 2,
        "metal": 1,
        "water": 0
      },
      "dayMaster": "Earth"
    },
    "zmanim": {
      "isShabbat": false,
      "nextSunset": "2026-03-01T18:31:00.000Z",
      "chatzot": "2026-03-01T12:15:00.000Z"
    },
    "adhan": {
      "isPrayerTime": true,
      "currentPrayer": "dhuhr",
      "nextPrayer": "asr",
      "nextPrayerTime": "2026-03-01T15:45:00.000Z",
      "prayerTimes": {
        "fajr": "2026-03-01T05:20:00.000Z",
        "sunrise": "2026-03-01T06:35:00.000Z",
        "dhuhr": "2026-03-01T12:30:00.000Z",
        "asr": "2026-03-01T15:45:00.000Z",
        "maghrib": "2026-03-01T18:31:00.000Z",
        "isha": "2026-03-01T19:55:00.000Z"
      }
    },
    "jalali": {
      "jYear": 1404,
      "jMonth": 12,
      "jDay": 10,
      "season": "Winter",
      "isNowruz": false
    },
    "tibetan": {
      "rabjung": 17,
      "dailyMewa": 9,
      "element": "Fire"
    },
    "mayan": {
      "kin": 240,
      "tzolkin": "Yellow Sun",
      "haab": "10 Mac",
      "galacticTone": 6
    }
  }
}
```

### Usage
This exact JSON is expected to be piped into the Python orchestrator. The Python layer will serialize this JSON into an LLM context window to generate deeply synced, multicultural prognostications based on the intersection of these astrological systems.
