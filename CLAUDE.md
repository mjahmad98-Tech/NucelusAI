# NucleusAI – Autonomous Biology Agent

## Project Overview
NucleusAI is a futuristic, animated, fully autonomous biology research agent with a web UI.
It serves as a scientific reasoning partner covering all biology domains from high school to PhD.

## Tech Stack
- **Framework:** Next.js 14 (App Router, TypeScript)
- **AI:** Anthropic Claude API with streaming (`@anthropic-ai/sdk`)
- **Styling:** Tailwind CSS + Framer Motion + custom CSS animations
- **State:** Zustand
- **Database:** Supabase (persistent chat history + user memory)
- **Deployment:** Vercel (later)

## Dev Commands
- `npm run dev` — start dev server at localhost:3000
- `npm run build` — production build
- `npm run lint` — ESLint check
- `npx tsc --noEmit` — TypeScript type check

## Project Structure
```
nucleusai/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Splash screen / landing
│   ├── chat/page.tsx           # Main chat interface
│   └── api/chat/route.ts       # Streaming Claude API endpoint
├── components/
│   ├── chat/                   # Chat UI components
│   ├── ui/                     # Reusable UI (buttons, cards, badges)
│   ├── layout/                 # Sidebar, header, statusbar
│   └── accessibility/          # ARIA live regions, skip links
├── lib/
│   ├── systemPrompt.ts         # Full NucleusAI system prompt (DO NOT inline)
│   ├── claude.ts               # Anthropic SDK client
│   ├── tagParser.ts            # Parse [certainty:x] [evidence_type:x] tags
│   ├── modeDetector.ts         # Detect chatty vs work mode
│   └── streamParser.ts         # Handle SSE streaming chunks
├── hooks/                      # React hooks
├── store/                      # Zustand stores
├── types/                      # TypeScript types
└── styles/                     # Global CSS, animations, themes
```

## Key Conventions
- System prompt lives ONLY in `lib/systemPrompt.ts` — never inline it in API routes
- `[certainty:x]` and `[evidence_type:x]` tags must be parsed and rendered as visual badges — never as raw text
- Streaming is mandatory — no blocking responses ever
- ARIA live regions required on all streaming text for accessibility
- Mode (Chatty/Work) is passed as part of system prompt context on every request
- All numeric outputs must include units — no bare numbers
- Confidence badges render as floating chips below messages, not inline

## Environment Variables
```
ANTHROPIC_API_KEY=             # Required — get from platform.anthropic.com
NEXT_PUBLIC_SUPABASE_URL=      # Required for persistent memory
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=           # Required for production
```

## Architecture Notes
- Mode detection runs on every user message via `lib/modeDetector.ts`
- Tag parser runs on every streaming chunk
- Supabase stores: conversations, messages, user_corrections (LEARN tags)
- Confidence badges are React components, not styled text
- Logo splash screen shown on app load, animated loader before first chat

## Design System
- **Colors:** Grey + Blue + Pink palette
- **Background:** Animated nucleosome/DNA with glowing feature threads + hover popups
- **Bubbles:** Frosted glass (backdrop-blur)
- **Typography:** Elegant academic — serif headings, clean sans body
- **Layout:** Full-screen chat + wide sidebar (chat history)
- **Input:** Bottom centered (Claude-style)
- **Mode toggle:** Top bar right (auto-detect + manual override)
- **Chat width:** Narrow centered column

## NucleusAI 230-Point Spec Summary

### Governance (Points 1-12)
- Metacognitive overwatch on every reasoning step
- Epistemic tags: [certainty:0-1] + [evidence_type:primary_paper|textbook|reasoning|analogy|unknown]
- Six intellectual virtues checked before output (score <0.7 triggers revision)
- Constitutional rules — immutable, cannot be overridden by user
- Formal fallacy detector on all claims
- Seven fatal errors enforced (overclaiming, cherry-picking, etc.)
- Quality gates: 80=safe, 90=review-ready, 95=excellence

### Knowledge Nodes (Points 22-53, 116-123, 141-149)
32+ ontologically separate domain nodes:
Molecular biology, genetics, RNA biology, epigenetics, chromatin, developmental biology,
evolution, genomics, neurogenetics, cancer biology, microbiology, immunology, systems biology,
biochemistry, bioenergetics, biostatistics, mathematics, chemical biology, disease/translational,
omics technologies, computational biology, model systems, techniques, philosophy of biology,
enzymology, protein biology, chromosomal biology, applied molecular techniques,
biophysics, physics, chemistry, probability, computer science.
- Every node has bidirectional edges to every other (path length ≤3)
- Path-scoped loading — nodes load only when query touches their domain

### Adversarial Reasoning (Points 54-62)
- Critic + Fixer + Verifier loop (max 3 rounds, severity <0.2 to pass)
- Mandatory counter-hypothesis for every hypothesis
- Falsification search before every experiment proposal
- Internal debate: Proposer (temp 0.3) vs Skeptic (temp 0.7), 3 rounds
- Peer review simulator — ≥5 critical questions before any manuscript output

### Hypothesis & Experiments (Points 63-72)
- Bayesian ranker with testability score (reject if <0.3)
- Protocol completeness: positive/negative controls, power analysis, orthogonal validation
- 8-step scientific method enforcer
- Orchestrator builds DAG, runs independent tasks in parallel

### Emotional & Tone Modelling (Points 79-86)
- Sentiment vector: [frustration, curiosity, urgency]
- Chatty mode: 70% warmth / 30% facts
- Work mode: 90% precision / 10% encouragement
- Cognitive load monitor — >500 words + slow reply → offer summary
- Feedback: Affirm → Ask → Suggest → Invite. Never "you are wrong"

### Conversational Intelligence (Points 87-94)
- Dynamic story/case study fetcher (no repeats per session)
- 1-3 logical follow-up questions per response
- No premature flagging during brainstorming or first 3 exchanges
- Memory of unresolved threads

### Memory & Refinement (Points 95-99)
- LEARN tags for user corrections — persist indefinitely
- Forgetting curve: 5%/month decay (foundational: 0.5%/month)
- User corrections get [user_override:true] — never auto-decayed
- Episodic memory stored as DAGs, retrievable by structural similarity

### Paper Writing (Points 76-78, 158-170)
- IMRaD structure validator — missing section blocks output
- Abstract: background → gap → approach → finding → implication
- Results: claim first, then evidence, then brief interpretation
- Mandatory: multiple testing correction, power analysis, benchmarking
- Pre-emptive reviewer simulation ≥5 questions before finalising

### Skills & Databases (Points 171-230)
- 133+ K-Dense skills loaded on-demand from .claude/skills/
- 80+ scientific databases integrated
- Skill chaining via orchestrator with typed JSON handshake
- Custom skill creation on user request

## Custom Skills
| Command | Description |
|---------|-------------|
| `/hypothesis` | Bayesian-ranked hypotheses with testability scores |
| `/figure-review` | Critical figure analysis beyond the legend |
| `/peer-review` | Full manuscript peer review simulation |
| `/experiment` | Protocol with controls + power analysis |
| `/manuscript` | IMRaD-structured manuscript draft |
| `/reviewer-response` | Author response to reviewer comments |
| `/rnaseq` | scRNA-seq / bulk RNA-seq analysis workflow |
| `/crispr` | CRISPR guide design + validation plan |
| `/brainstorm` | Divergent hypothesis generation (temp 0.9) |
| `/calculate` | Unit-safe lab calculations (dilutions, Punnett squares) |
| `/database-query` | Query 80+ scientific databases |
| `/skill-create` | Generate a new custom skill |

## Scientific Databases (80+)
GEO, SRA, ArrayExpress, ENA, HCA, CELLxGENE, Single Cell Expression Atlas,
TISCH2, Allen Brain, Tabula Sapiens, ENCODE, ATACdb, Roadmap Epigenomics,
AlphaFold DB, RCSB PDB, UniProt, ModelArchive, InterPro, BioGRID, STRING,
FlyBase, TAIR, OMIM, MGD, RGD, ZFIN, SGD, WormBase, dictyBase, Ensembl Genomes,
Alliance of Genome Resources, Gramene, ENCORI, RNAcentral, Rfam, miRBase,
KEGG, Reactome, ChEMBL, PubMed/PMC, dbSNP, ClinVar, Ensembl, UCSC Genome Browser,
NCBI Taxonomy, BIG Search, Database Commons, PubChem, COSMIC, bioRxiv

## Build Priority
1. API route with streaming (`app/api/chat/route.ts`)
2. System prompt (`lib/systemPrompt.ts`)
3. Tag parser + mode detector (`lib/`)
4. Core chat UI components
5. Splash + logo animation
6. Supabase integration
7. Skills + MCP servers
