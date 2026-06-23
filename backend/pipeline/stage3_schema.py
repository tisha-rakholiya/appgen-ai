import os, json, re
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SCHEMA_PROMPT = """You are a database and UI architect. Return ONLY valid JSON with this structure:
{
  "database_schema": {"tables": [{"name": "users", "fields": [{"name": "id", "type": "UUID", "primary_key": true}, {"name": "email", "type": "VARCHAR(255)", "unique": true, "nullable": false}, {"name": "role", "type": "VARCHAR(50)", "default": "user"}, {"name": "created_at", "type": "TIMESTAMP", "default": "NOW()"}], "relations": []}]},
  "ui_schema": {"components": [{"name": "LoginForm", "type": "form", "fields": [{"name": "email", "type": "email", "label": "Email", "required": true}, {"name": "password", "type": "password", "label": "Password", "required": true}], "actions": [{"label": "Login", "type": "submit", "endpoint": "/api/auth/login"}]}]},
  "auth_schema": {"strategy": "JWT", "roles": ["admin", "user"], "permissions": {"admin": ["read", "write", "delete"], "user": ["read", "write"]}, "protected_routes": ["/dashboard"]},
  "business_logic": [{"rule": "Only admins can access analytics", "type": "role_guard", "applies_to": "/api/analytics"}]
}
Return ONLY JSON, no explanation."""

def generate_schema(intent: dict, architecture: dict) -> dict:
    try:
        combined = {"intent": intent, "architecture": architecture}
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SCHEMA_PROMPT},
                {"role": "user", "content": f"Generate schema for: {json.dumps(combined)}"}
            ],
            temperature=0.1,
            max_tokens=3000
        )
        raw = response.choices[0].message.content.strip()
        raw = re.sub(r"```json|```", "", raw).strip()
        return json.loads(raw)
    except Exception as e:
        print(f"Stage 3 error: {e}")
        return {
            "database_schema": {"tables": [{"name": "users", "fields": [{"name": "id", "type": "UUID", "primary_key": True}, {"name": "email", "type": "VARCHAR(255)", "unique": True, "nullable": False}, {"name": "role", "type": "VARCHAR(50)", "default": "user"}, {"name": "created_at", "type": "TIMESTAMP", "default": "NOW()"}], "relations": []}]},
            "ui_schema": {"components": [{"name": "LoginForm", "type": "form", "fields": [{"name": "email", "type": "email", "label": "Email", "required": True}, {"name": "password", "type": "password", "label": "Password", "required": True}], "actions": [{"label": "Login", "type": "submit", "endpoint": "/api/auth/login"}]}]},
            "auth_schema": {"strategy": "JWT", "roles": intent.get("roles", ["user"]), "permissions": {"admin": ["read", "write", "delete"], "user": ["read"]}, "protected_routes": ["/dashboard"]},
            "business_logic": []
        }