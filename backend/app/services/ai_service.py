import os
from collections.abc import Generator
from contextlib import contextmanager

from fastapi import HTTPException, status
from openai import (
    APIConnectionError,
    APIError,
    AuthenticationError,
    OpenAI,
    RateLimitError,
)

DEFAULT_MODEL = "openrouter/free"


@contextmanager
def openrouter_client() -> Generator[OpenAI, None, None]:
    api_key = os.getenv("OPENROUTER_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The review service is not configured. Add OPENROUTER_API_KEY to backend/.env.",
        )

    client = OpenAI(
        api_key=api_key,
        base_url="https://openrouter.ai/api/v1",
        timeout=45.0,
        max_retries=2,
    )

    try:
        yield client
    finally:
        client.close()


def generate_ai_review(prompt: str) -> str:
    try:
        with openrouter_client() as client:
            response = client.chat.completions.create(
                model=os.getenv("OPENROUTER_MODEL", DEFAULT_MODEL),
                messages=[
                    {
                        "role": "system",
                        "content": "You are a senior software engineer and expert code reviewer.",
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    },
                ],
                temperature=0.3,
                max_tokens=2000,
            )

        review = response.choices[0].message.content

        if not review:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="The AI provider returned an empty review.",
            )

        return review

    except HTTPException:
        raise
    except AuthenticationError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication failed.",
        )
    except RateLimitError:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded.",
        )
    except (APIConnectionError, APIError):
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="AI provider error.",
        )