from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from dotenv import load_dotenv
import os
import time

from openai import OpenAI

# Load environment variables
load_dotenv()

# OpenRouter API Key
api_key = os.getenv("OPENROUTER_API_KEY")

client = OpenAI(
    api_key=api_key,
    base_url="https://openrouter.ai/api/v1",
)

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
    try:
        prompt = f"""
You are an expert code reviewer.

Review the following {data.language} code.

Provide:
1. Bugs (if any)
2. Code Improvements
3. Best Practices
4. Optimized Version (if possible)

Code:
{data.code}
"""

        response = None

        for i in range(3):
            try:
                response = client.chat.completions.create(
                    model="openrouter/free",
                    messages=[
                        {
                            "role": "system",
                            "content": "You are a senior software engineer and code reviewer.",
                        },
                        {
                            "role": "user",
                            "content": prompt,
                        },
                    ],
                    temperature=0.3,
                )
                break

            except Exception as e:
                if i == 2:
                    raise e
                time.sleep(2)

        return {
            "review": response.choices[0].message.content
        }

    except Exception as e:
        return {
            "error": str(e)
        }