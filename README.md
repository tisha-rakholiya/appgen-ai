# AppGen — AI App Compiler 🚀

> Natural Language → Working App Schema in seconds

## What is AppGen?
AppGen is a multi-stage AI pipeline that converts plain English descriptions into complete, validated app schemas — just like a compiler, but for software architecture.

## Live Demo
🔗 [Live URL here]

## Architecture — 4 Stage Pipeline
User Prompt

↓

Stage 1: Intent Extraction      → Parses features, roles, entities

↓

Stage 2: System Architecture    → Pages, API endpoints, services

↓

Stage 3: Schema Generation      → DB schema, UI schema, Auth rules

↓

Stage 4: Validation & Repair    → Auto-fixes inconsistencies

↓

Final JSON Schema (Production Ready)

## Evaluation Results
| Metric | Result |
|--------|--------|
| Success Rate | 100% (10/10) |
| Normal Prompts | 5/5 ✅ |
| Edge Cases | 5/5 ✅ |
| Avg Latency | ~15s |
| Avg Retries | 0 |

## Tech Stack
- **Frontend**: React + Vite
- **Backend**: FastAPI (Python)
- **AI**: Groq API (llama-3.3-70b-versatile)

## Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
# Add GROQ_API_KEY to backend/.env
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Features
- ✅ Multi-stage pipeline (not single prompt)
- ✅ Auto validation + repair engine
- ✅ Cross-layer consistency checks
- ✅ Evaluation framework (10 test cases)
- ✅ 100% success rate on edge cases