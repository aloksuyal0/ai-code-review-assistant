import base64
import os
import re

import requests
from fastapi import HTTPException, status




def extract_repo_info(repo_url: str) -> tuple[str, str]:
    pattern = r"https?://github\.com/([^/]+)/([^/]+)"
    match = re.match(pattern, repo_url)

    if not match:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid GitHub repository URL.",
        )

    owner = match.group(1)
    repo = match.group(2).replace(".git", "")

    return owner, repo

def github_headers() -> dict:
    token = os.getenv("GITHUB_TOKEN")

    if token:
        return {
            "Authorization": f"Bearer {token}"
        }

    return {}
 


def fetch_repository(owner: str, repo: str) -> dict:
    url = f"https://api.github.com/repos/{owner}/{repo}"

    response = requests.get(
        url,
        headers=github_headers(),
        timeout=15,
    )

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="GitHub repository not found.",
        )

    return response.json()

def fetch_repository_contents(owner: str, repo: str):
    url = f"https://api.github.com/repos/{owner}/{repo}/contents"

    response = requests.get(
        url,
        headers=github_headers(),
        timeout=20,
    )

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Unable to fetch repository files.",
        )

    return response.json()

def fetch_readme(owner: str, repo: str) -> str:
    url = f"https://api.github.com/repos/{owner}/{repo}/readme"

    response = requests.get(
        url,
        headers=github_headers(),
        timeout=20,
    )

    if response.status_code != 200:
        return ""

    data = response.json()

    content = data.get("content", "")

    if not content:
        return ""

    return base64.b64decode(content).decode("utf-8", errors="ignore")

def fetch_file_content(download_url: str) -> str:
    response = requests.get(
        download_url,
        headers=github_headers(),
        timeout=20,
    )

    if response.status_code != 200:
        return ""

    return response.text


def collect_repository_files(
    owner: str,
    repo: str,
    path: str = "",
    collected: list | None = None,
):
    if collected is None:
        collected = []

    url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"

    response = requests.get(
        url,
        headers=github_headers(),
        timeout=20,
    )

    if response.status_code != 200:
        return collected

    items = response.json()

    if isinstance(items, dict):
        items = [items]

    allowed_extensions = (
        ".py",
        ".ts",
        ".tsx",
        ".js",
        ".jsx",
        ".java",
        ".cpp",
        ".c",
        ".go",
        ".rs",
        ".md",
    )

    for item in items:
        if item["type"] == "dir":
            collect_repository_files(
                owner,
                repo,
                item["path"],
                collected,
            )

        elif item["type"] == "file":
            if item["name"].endswith(allowed_extensions):
                collected.append(
                    {
                        "path": item["path"],
                        "download_url": item["download_url"],
                    }
                )

    return collected
