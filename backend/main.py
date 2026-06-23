from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pipeline.stage1_intent import extract_intent
from pipeline.stage2_architecture import design_architecture
from pipeline.stage3_schema import generate_schema
from pipeline.stage4_validation import validate_and_repair
import json, time

app = FastAPI(title="App Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str

@app.get("/")
def root():
    return {"status": "App Generator is running!"}

@app.post("/generate")
def generate_app(request: PromptRequest):
    start_time = time.time()
    results = {
        "prompt": request.prompt,
        "stages": {},
        "final_schema": None,
        "metrics": {}
    }
    retries = 0

    try:
        print("Stage 1: Extracting intent...")
        intent = extract_intent(request.prompt)
        results["stages"]["intent"] = intent

        print("Stage 2: Designing architecture...")
        architecture = design_architecture(intent)
        results["stages"]["architecture"] = architecture

        print("Stage 3: Generating schemas...")
        schema = generate_schema(intent, architecture)
        results["stages"]["schema"] = schema

        print("Stage 4: Validating and repairing...")
        validated, retries = validate_and_repair(schema)
        results["stages"]["validation"] = {"status": "passed", "retries": retries}
        results["final_schema"] = validated

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    end_time = time.time()
    results["metrics"] = {
        "latency_seconds": round(end_time - start_time, 2),
        "retries": retries,
        "success": True
    }

    return results