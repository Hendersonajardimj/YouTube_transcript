# YouTube ► LLM — Product Requirements & Delivery Roadmap

## 1  Vision

“Paste a YouTube link; get an LLM‑powered summary on any device in under a minute.”

## 2  Problem Statement

Manual caption downloads and copy‑pasting into free tools is slow, lossy, and does not scale. Users need a single drop‑in field that fetches captions, processes them with an LLM, and stores results for later search.

## 3  Goals & Non‑Goals (MVP)

| Goal                                                                 | Non‑Goal                                    |
| -------------------------------------------------------------------- | ------------------------------------------- |
| 1. Fetch English (or fallback) captions for any public YouTube video | Multilingual UI                             |
| 2. Chunk transcript within model context limits                      | Whisper STT for no‑caption videos           |
| 3. Summarise each chunk via LLM and return stitched result           | Multiple summary formats (blog, Q\&A, etc.) |
| 4. Persist `{url, transcript, summary, createdAt}` in one table      | Multi‑tenant SaaS billing                   |
| 5. Minimal mobile‑friendly web page to paste links & list jobs       | Native iOS / Android app                    |

## 4  Personas & Use Cases

* **Analyst (Josh)** — researches AI talks; needs fast skimmable summaries.
* **Educator** — curates playlists and distributes condensed notes.
* **Podcaster** — mines transcripts for show‑note highlights.

## 5  Functional Requirements

1. **POST `/api/process`** → trigger fetch + LLM; return `{status, transcript?, summary?}`.
2. If work >30 s, return `202 Accepted` with `jobId`; UI polls **GET `/api/status/:id`**.
3. On completion, insert row into **`transcripts`** `(id, url, transcript, summary, createdAt)`.
4. **GET `/api/list`** returns recent rows for current user (anon in MVP).
5. Front‑end: input bar, progress spinner, read‑only summary, download full transcript link.

## 6  Non‑Functional Requirements

* **Reliability:** 99 % uptime; graceful error handling.
* **Performance:** 500 ms TTFB; <60 s median latency for 30‑min video.
* **Security:** HTTPS, secrets via env vars, CORS limited post‑MVP.
* **Scalability:** 1–5 concurrent users on free tier; queue + worker later.
* **Portability:** single Docker image.

## 7  Tech Stack

| Layer            | Choice                                      | Reason                        |
| ---------------- | ------------------------------------------- | ----------------------------- |
| Transcript fetch | `youtube-transcript-plus`                   | Lightweight, no API key       |
| Back‑end         | Express + TypeScript                        | Familiar, minimal             |
| LLM              | OpenAI Chat Completion API (env‑switchable) | Fast to MVP                   |
| Storage          | SQLite via Drizzle ORM                      | 0‑setup; migrates to Postgres |
| Queue (phase 2)  | BullMQ + Redis                              | Async jobs                    |
| Front‑end        | Static HTML (+ Tiny JS)                     | Mobile‑friendly & lightweight |
| Container        | `node:20‑slim` in Docker                    | Works everywhere              |

## 8  Major Risks & Mitigations

| Risk                   | Mitigation                                                         |
| ---------------------- | ------------------------------------------------------------------ |
| YouTube markup changes | Catch `NoTranscriptAvailable`; fallback to Captions API or Whisper |
| Free‑tier sleep/limits | Choose platform with always‑on hours (Render)                      |
| LLM cost spikes        | Token budgeting & per‑user quotas                                  |

## 9  Success Metrics (first 60 days)

* **Activation:** ≥80 % first‑time users finish a summary.
* **Latency P50:** <60 s for videos ≤30 min.
* **7‑Day Retention:** ≥30 %.
* **Infra + API cost:** ≤\$10 / month for ≤500 videos.

## 10  Delivery Roadmap

| Phase                   | Week    | Deliverables                                                  |
| ----------------------- | ------- | ------------------------------------------------------------- |
| **0 Kick‑off**          | 0.5 day | Repo scaffolding, CI, Dockerfile                              |
| **1 Thin MVP**          | 1       | Transcript fetch wrapper, `/api/process`, in‑memory store     |
|                         | 2       | SQLite + Drizzle, persistence, basic HTML page                |
| **2 Mobile Polish**     | 3       | Responsive CSS, tighter CORS, `meta viewport`                 |
| **3 Async Queue**       | 4       | BullMQ worker, `/api/status` polling                          |
| **4 Deploy & Dog‑food** | 4       | Push to Render; public HTTPS URL                              |
| **5 Beta Enhancements** | 5–6     | Auth (Clerk), embeddings + pgvector (if Postgres), PWA banner |
| **6 GA**                | 7–8     | Whisper fallback, rate‑limiting, metrics dashboard            |

## 11  Deployment Recommendation

**Render** is recommended:

* 750 free instance‑hours ≈ 1 always‑on container/month.
* Local disk persistence supports SQLite.
* One‑click GitHub deploy; background worker & cron built‑in.

### Quick Deploy Steps (Render)

1. Push repo to GitHub.
2. **Render → New → Web Service**; select repo.
3. Set `BUILD_COMMAND="npm i"`, `START_COMMAND="node index.js"`.
4. Add env var `OPENAI_API_KEY`.
5. Click **Create Web Service** → get `https://<app>.onrender.com`.

## 12  Appendix — Transcript Fetch Internals

1. Scrapes `ytInitialPlayerResponse` → finds caption tracks.
2. Chooses English (or requested) track, manual first then ASR.
3. Downloads XML captions → returns array `{text, start, duration}`.
4. Throws `NoTranscriptAvailable` if none (enqueue Whisper fallback).

---

**End of Document**
