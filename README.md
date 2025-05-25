Product Requirements Document

“Clipboard Transcript” — Cross-Platform Single-Page Progressive Web Application

Version 2.0 — revised May 25 2025

⸻

1 · Purpose and Vision

Provide a one-tap, cross-device tool that turns any YouTube link into usable text and instantly processes that text with prompt-driven large-language-model workflows. The app ships as a single-page application (SPA) packaged as a progressive web application (PWA) so it can be installed to an iPhone home screen, Android launcher, or desktop dock while remaining just a website.

Key value:
	•	Zero-friction capture – users simply share or paste a link; transcripts arrive in seconds.
	•	Built-in prompts – ready-made “Summarise”, “Rewrite for readability”, “Rate relevance”, etcetera.
	•	Scalable workflows – batch playlists, semantic scoring, optional export to a vector database for retrieval-augmented generation (RAG).

⸻

2 · Problem Statement

Switching between apps or pasting links into multiple tools kills momentum. Researchers, creators and autodidacts want instant transcript extraction and immediate large-language-model processing on every device they use. Native share extensions solve only one platform; a web application removes installation barriers and maintains a single codebase.

⸻

3 · Goals and Success Metrics

Goal	Indicator
Seamless install	PWA passes Lighthouse installability audit ≥ 95 points.
Speed	≤ 3 s median from link submission to transcript copy on a 5 Mbps network.
Prompt utility	≥ 80 percent of processed transcripts use a saved template.
Batch throughput (Phase 2)	Ten-video playlist processed in < 4 minutes on Wi-Fi.
Cross-device adoption	≥ 60 percent of weekly active users launch the app on two different form factors (mobile + desktop) within 30 days.


⸻

4 · Personas

Persona	Scenario	Need
Grace – postgraduate student	Reviews research talks on phone, edits notes on laptop.	Same summarisation workflow everywhere.
Leo – content creator	Mines transcripts for highlights on desktop Premiere Pro rig.	Readability rewrite at paste-time.
Alex – strategist	Skims dozens of industry videos on iPad, decides watchlist.	Playlist scoring against custom preferences.


⸻

5 · Core User Stories
	1.	Mobile quick-summary – As Grace, I tap Share→“Clipboard Transcript” on iPhone YouTube, pick Summarise, and the summary is automatically copied so I can paste into Obsidian.
	2.	Desktop readability – As Leo, I paste a link into the web app, choose Readable Script, and get a cleaned transcript for scripts.
	3.	Playlist triage – As Alex, I paste a playlist Uniform Resource Locator, run Rate relevance, and download a comma-separated file sorted by score.

⸻

6 · Scope

6·1 Functional Requirements

Ref	Requirement
F-1	Accept YouTube Uniform Resource Locator via (a) direct paste, (b) Web Share Target (Android/desktop Chrome), (c) iOS Shortcut bridge.
F-2	Fetch full transcript through backend scraper or client-side caption extraction.
F-3	Display transcript in viewer with Copy button that writes to clipboard.
F-4	Offer list of prompt templates; default templates bundled; user can add/edit/delete.
F-5	Send transcript + prompt to OpenAI Chat Completions; show streaming response; copy result on tap.
F-6	Batch mode (Phase 2): accept playlist or channel Uniform Resource Locator, queue jobs, and present downloadable Markdown/CSV and optional vector-store upload.
F-7	Persist user API key, templates, and job history using IndexedDB and encrypted localStorage.
F-8	Implement offline fallback cache and “Retry when online” queue.

6·2 Non-Functional Requirements
	•	Technology stack: React 18 + Vite, TypeScript, Tailwind, TanStack Query.
	•	PWA features: manifest.json with icons (512 px+), display: standalone, service-worker for offline shell and transcript cache.
	•	Responsive design: Mobile-first; desktop wide-pane layout.
	•	Accessibility: WCAG 2.2 AA, prefers-reduced-motion.
	•	Privacy: No server-side user profiles; transcripts and prompts remain client-side except when sent directly to OpenAI.
	•	Security: HTTPS only, Content-Security-Policy strict; openai key stored in Encrypted Storage wrapper.

6·3 Out of Scope (Version 1)
	•	Native share extension; we rely on web share or manual paste for iOS.
	•	In-browser local LLM inference (consider for offline Phase 3).
	•	Non-YouTube video platforms.

⸻

7 · Technical Design Overview

Layer	Choice	Rationale
Front-end	React SPA with react-router	Universal code, SEO not required.
State + data	TanStack Query + IndexedDB	Caching transcripts and playlist jobs offline.
Service worker	Workbox generateSW	Precaches shell and runtime-caches transcripts; enables offline mode.
Backend	Cloudflare Workers REST endpoint /transcript?url=…	Small, scalable, update without client redeploy.
LLM Service	LLMService wrapper over OpenAI API with abort & exponential backoff.	Abstract future model providers.
Share Target	web_share_target manifest (Android / desktop) + iOS Shortcut receiving URL and opening https://cliptr.app/?url=<encoded>	Bridges iOS limitation.
Deployment	Cloudflare Pages (static) + Workers (API).	Global edge, no servers to manage.


⸻

8 · Milestones & Timeline

Week	Deliverable
1	React scaffold, router, transcript fetch by paste.
2	Prompt template UI, OpenAI integration, clipboard copy.
3	PWA manifest, service-worker, Lighthouse ≥ 95.
4	iOS Shortcut and Android Web Share Target; internal alpha.
5	Playlist batch processor, downloadable CSV.
6	Public beta, telemetry, bug fixes.
7-8	Channel crawler + vector database export, RAG proof.


⸻

9 · Risks & Mitigations

Risk	Likelihood	Impact	Mitigation
Web Share Target not supported on iOS Safari	High	Medium	Provide Shortcut bridge and prominent Paste input.
Service-worker cache staleness	Medium	Low	Use cache-first-but-refresh strategy, versioned assets.
OpenAI cost escalation	Medium	High	Token budgeting, per-user daily limit, option to supply own key.


⸻

10 · Analytics
	•	Install prompts accepted / dismissed.
	•	Success-rate of transcript fetch.
	•	Average token cost per user per day.

Analytics are anonymous, event-count only; no Uniform Resource Locators or transcript content logged.

⸻

11 · Open Questions
	1.	Should we build a minimal native wrapper to gain iOS share-sheet integration, or wait for Safari Web Share Target?
	2.	Would users pay for a hosted OpenAI key to avoid bringing their own?
	3.	What vector database is most accessible for entry-level users—Supabase, Weaviate, or Pinecone?

⸻

12 · Future Directions
	•	Offline summarisation with Apple-on-device models (A18 Bionic, M-series).
	•	Community template marketplace.
	•	Multi-platform browser extension that injects “Get transcript & summarise” button directly on YouTube.
