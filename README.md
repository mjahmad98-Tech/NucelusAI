# NucleusAI

**Autonomous biology reasoning agent with a web interface**

Status: Prototype completed
Author: Mujtaba Ahmed, Tariq Lab, LUMS

---

## What this is

NucleusAI is an autonomous biology reasoning agent I built as a web application covering biology from foundational concepts to research-level questions. It runs as a conversational interface powered by the Anthropic Claude API with real-time streaming, and was designed to function as a scientific reasoning partner rather than a simple question-answering tool.

The core idea behind it was that biology reasoning requires more than retrieval. A useful biology agent needs to track epistemic confidence, distinguish between primary experimental evidence and textbook consensus, generate testable hypotheses, propose experimental protocols with appropriate controls, and be explicit about uncertainty rather than papering over it with confident language. NucleusAI was built around those requirements from the start.

Building and running it clarified what a general-purpose biology agent can and cannot do well. For specialist chromatin biology questions — reasoning about specific histone modification mechanisms, integrating signalling pathway context with chromatin state, reasoning bidirectionally between chromatin and signalling — a general agent running against the full breadth of biology is not the right architecture. That realisation is what drove the subsequent development of EpiSignal, a domain-specific reasoning agent focused entirely on the chromatin-signalling interface.

---

## What it does

The agent covers 32+ biological domains including molecular biology, genetics, epigenetics, chromatin biology, developmental biology, cancer biology, computational biology, genomics, biochemistry, and more. Every response carries epistemic tags that distinguish between primary paper evidence, textbook consensus, and reasoning by analogy. Confidence scores are rendered as visual badges rather than stated in prose.

The system operates in two modes. In conversational mode it prioritises warmth and accessibility. In work mode it switches to precision-first output with minimal padding. Mode detection runs automatically on every message but can be overridden manually.

Custom slash commands provide structured outputs for specific research tasks: hypothesis generation with Bayesian ranking and testability scoring, experimental protocol design with positive and negative controls, manuscript drafting in IMRaD structure, peer review simulation, and figure critique. Database queries route to over 80 integrated scientific databases including GEO, ENCODE, UniProt, STRING, BioGRID, FlyBase, Reactome, AlphaFold, PubMed, COSMIC, and Ensembl.

---

## Tech stack

The application is built on Next.js 14 with the App Router and TypeScript. The AI layer uses the Anthropic Claude API with server-sent event streaming so responses render progressively rather than appearing all at once. The UI uses Tailwind CSS with Framer Motion animations. State is managed with Zustand. Persistent chat history and user memory corrections are stored in Supabase.

---

## Architecture

```
nucleusai/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                  splash screen
│   ├── chat/page.tsx             main chat interface
│   └── api/chat/route.ts         streaming Claude API endpoint
├── components/
│   ├── chat/                     chat UI components
│   ├── ui/                       buttons, cards, badges
│   └── layout/                   sidebar, header, status bar
├── lib/
│   ├── systemPrompt.ts           full system prompt
│   ├── claude.ts                 Anthropic SDK client
│   ├── tagParser.ts              parse certainty and evidence tags
│   ├── modeDetector.ts           detect conversational vs work mode
│   └── streamParser.ts           handle SSE streaming chunks
├── store/                        Zustand state stores
├── supabase/                     database schema and queries
└── styles/                       global CSS and animations
```

---

## Key design decisions

Epistemic tagging is architectural, not optional. Every response the agent generates carries a certainty score between 0 and 1 and an evidence type tag indicating whether a claim comes from a primary paper, a textbook, direct reasoning, analogy, or unknown provenance. These are parsed from the streaming output and rendered as floating visual badges so the user always knows the evidential basis of what they are reading.

The system prompt is never inlined in the API route. It lives in a dedicated file and is loaded cleanly on every request. This keeps the API route readable and makes the reasoning specification easy to inspect and modify independently.

User corrections persist indefinitely. When a user corrects the agent, that correction is stored with a `user_override` tag in Supabase and is never subject to the confidence decay that applies to other stored information. The agent learns from corrections and does not revert them.

---

## Custom commands

| Command | Output |
|---|---|
| `/hypothesis` | Bayesian-ranked hypotheses with testability scores |
| `/experiment` | Protocol with controls and power analysis |
| `/manuscript` | IMRaD-structured manuscript draft |
| `/peer-review` | Full peer review simulation |
| `/figure-review` | Critical figure analysis |
| `/rnaseq` | RNA-seq analysis workflow |
| `/crispr` | CRISPR guide design and validation |
| `/brainstorm` | Divergent hypothesis generation |
| `/calculate` | Unit-safe lab calculations |
| `/database-query` | Query 80+ scientific databases |

---

## Relationship to EpiSignal

NucleusAI demonstrated that an autonomous biology reasoning agent is buildable and useful. Running it against real chromatin biology research questions made clear that general coverage across all biology domains comes at the cost of the depth and context-specificity that specialist mechanistic reasoning requires. EpiSignal is the direct successor to this work: a narrower system that reasons only about the chromatin-signalling interface but does so with organism-specific evidence weighting, calibrated uncertainty propagation, bidirectional signalling-chromatin traversal, and explicit parameter interaction encoding. The two projects represent successive stages of the same research direction rather than separate efforts.

---

## Running locally

```bash
npm install
cp .env.example .env.local
# add your ANTHROPIC_API_KEY and Supabase credentials to .env.local
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## Environment variables

```
ANTHROPIC_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=
```

---

## Contact

Mujtaba Ahmed
MS in Biology, LUMS
Tariq Lab, Epigenetics and Chromatin Biology
22140008@lums.edu.pk
