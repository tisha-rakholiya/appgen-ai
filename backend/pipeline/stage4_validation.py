import json, re, os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

REQUIRED_KEYS = ["database_schema", "ui_schema", "auth_schema", "business_logic"]

def check_missing_keys(schema: dict) -> list:
    return [key for key in REQUIRED_KEYS if key not in schema]

def check_cross_layer_consistency(schema: dict) -> list:
    issues = []
    try:
        db_tables = [t["name"] for t in schema["database_schema"].get("tables", [])]
        if "users" not in db_tables:
            issues.append("Missing users table")
    except:
        issues.append("DB schema error")
    try:
        if len(schema["ui_schema"].get("components", [])) == 0:
            issues.append("No UI components")
    except:
        issues.append("UI schema error")
    return issues

def repair_schema(broken_schema: dict, issues: list) -> dict:
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a JSON repair expert. Return ONLY valid JSON."},
                {"role": "user", "content": f"Fix these issues: {json.dumps(issues)}\nSchema: {json.dumps(broken_schema)}"}
            ],
            temperature=0.0,
            max_tokens=3000
        )
        raw = response.choices[0].message.content.strip()
        raw = re.sub(r"```json|```", "", raw).strip()
        return json.loads(raw)
    except:
        return broken_schema

def validate_and_repair(schema: dict, max_retries: int = 3) -> tuple:
    retries = 0
    for attempt in range(max_retries):
        issues = []
        missing = check_missing_keys(schema)
        if missing:
            issues.append(f"Missing keys: {missing}")
        issues.extend(check_cross_layer_consistency(schema))
        try:
            json.dumps(schema)
        except Exception as e:
            issues.append(f"JSON error: {str(e)}")
        if not issues:
            return schema, retries
        print(f"Repair attempt {attempt+1}: {issues}")
        schema = repair_schema(schema, issues)
        retries += 1
    return schema, retries