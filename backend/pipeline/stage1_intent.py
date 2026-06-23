import os, json, re
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

INTENT_PROMPT = """You are an expert software architect. Extract structured intent from the user's app description.

Return ONLY valid JSON with this exact structure:
{
  "app_name": "string",
  "app_type": "string (CRM/ECommerce/SaaS/Dashboard/Social/Other)",
  "core_features": ["feature1", "feature2"],
  "entities": ["User", "Product"],
  "auth_required": true,
  "roles": ["admin", "user"],
  "has_payments": true,
  "has_analytics": true,
  "assumptions": ["assumption1"]
}

Rules:
- If something is unclear, make a reasonable assumption and add it to assumptions array
- Always include at least User in entities
- Return ONLY JSON, no explanation, no markdown"""

def extract_intent(prompt: str) -> dict:
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": INTENT_PROMPT},
                {"role": "user", "content": f"Extract intent from: {prompt}"}
            ],
            temperature=0.1,
            max_tokens=1000
        )
        raw = response.choices[0].message.content.strip()
        raw = re.sub(r"```json|```", "", raw).strip()
        return json.loads(raw)
    except Exception as e:
        print(f"Stage 1 error: {e}")
        return {
            "app_name": "Generated App",
            "app_type": "SaaS",
            "core_features": ["authentication", "dashboard"],
            "entities": ["User"],
            "auth_required": True,
            "roles": ["admin", "user"],
            "has_payments": False,
            "has_analytics": False,
            "assumptions": [f"Used defaults due to: {str(e)}"]
        }