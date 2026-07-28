from pydantic import BaseModel, Field, field_validator

MAX_CODE_LENGTH = 50_000


class CodeRequest(BaseModel):
    code: str = Field(..., min_length=1, max_length=MAX_CODE_LENGTH)
    language: str = Field(..., min_length=1, max_length=40)

    @field_validator("code")
    @classmethod
    def code_must_not_be_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Code cannot be blank.")
        return value

    @field_validator("language")
    @classmethod
    def language_must_be_safe_label(cls, value: str) -> str:
        language = value.strip().lower()
        if not language.replace("+", "").replace("#", "").replace("-", "").isalnum():
            raise ValueError("Language contains unsupported characters.")
        return language


class ReviewResponse(BaseModel):
    review: str


class RepositoryRequest(BaseModel):
    repo_url: str = Field(..., min_length=1)

    @field_validator("repo_url")
    @classmethod
    def validate_repo_url(cls, value: str) -> str:
        value = value.strip()

        if not (
            value.startswith("https://github.com/")
            or value.startswith("http://github.com/")
        ):
            raise ValueError("Please enter a valid GitHub repository URL.")

        return value