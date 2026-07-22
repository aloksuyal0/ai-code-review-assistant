from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    code: str
    language: str


@app.get("/")
def home():
    return {"message": "Backend Running 🚀"}


@app.post("/review")
def review_code(data: CodeRequest):
    return {
        "score": 95,
        "bugs": [
            "No syntax errors found."
        ],
        "performance": "Good",
        "security": "Good",
        "suggestions": [
            "Use docstrings.",
            "Add exception handling.",
            "Improve variable naming."
        ]
    }