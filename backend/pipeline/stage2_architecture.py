import os, json, re
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

ARCHITECTURE_PROMPT = """You are a senior software architect. Return ONLY valid JSON.
{
  "pages": [{"name": "Login", "route": "/login", "auth_required": false, "components": ["LoginForm"]}],
  "api_endpoints": [{"method": "POST", "path": "/api/auth/login", "description": "Login", "request_body": {"email": "string", "password": "string"}, "response": {"token": "string"}}],
  "services": ["AuthService"],
  "tech_stack": {"frontend": "React", "backend": "FastAPI", "database": "PostgreSQL"}
}
Return ONLY JSON, no explanation."""

def design_architecture(intent: dict) -> dict:
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": ARCHITECTURE_PROMPT},
                {"role": "user", "content": f"Design architecture for: {json.dumps(intent)}"}
            ],
            temperature=0.1,
            max_tokens=2000
        )
        raw = response.choices[0].message.content.strip()
        raw = re.sub(r"```json|```", "", raw).strip()
        return json.loads(raw)
    except Exception as e:
        print(f"Stage 2 error: {e}")
        return {
            "pages": [{"name": "Login", "route": "/login", "auth_required": False, "components": ["LoginForm"]},
                      {"name": "Dashboard", "route": "/dashboard", "auth_required": True, "components": ["StatsCard"]}],
            "api_endpoints": [{"method": "POST", "path": "/api/auth/login", "description": "Login",
                               "request_body": {"email": "string", "password": "string"}, "response": {"token": "string"}}],
            "services": ["AuthService"],
            "tech_stack": {"frontend": "React", "backend": "FastAPI", "database": "PostgreSQL"}
        }