from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from flashtext import KeywordProcessor

app = FastAPI()

# Allow Next.js to talk to Python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize FlashText Engine (0% chance of DLL errors!)
keyword_processor = KeywordProcessor()

# Train the AI to recognize these skills (including abbreviations)
keyword_processor.add_keywords_from_dict({
    "JavaScript": ["javascript", "js"],
    "Python": ["python"],
    "React": ["react", "reactjs", "react.js"],
    "Node.js": ["node.js", "node", "nodejs"],
    "Docker": ["docker"],
    "AWS": ["aws", "amazon web services"],
    "SQL": ["sql", "mysql", "postgresql"],
    "TypeScript": ["typescript", "ts"],
    "Git": ["git", "github"]
})

class ResumeInput(BaseModel):
    text: str

# The API Endpoint
@app.post("/parse-resume")
async def parse_resume(data: ResumeInput):
    # Read the document and extract skills instantly
    extracted_skills = list(set(keyword_processor.extract_keywords(data.text)))
    
    # Format the data exactly how our Next.js frontend expects it
    skills_formatted = [
        {"skill": skill, "confidence": 0.85, "source": "resume"} 
        for skill in extracted_skills
    ]
    
    return {"skills": skills_formatted}