import os
import requests
from dotenv import load_dotenv

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

def verify_github_repo(repo_url: str) -> bool:
    """
    Verifies that a valid github repository exists, is public, and has a README.
    Format should be: https://github.com/owner/repo
    """
    if "github.com/" not in repo_url:
        return False
        
    parts = repo_url.rstrip("/").split("github.com/")
    if len(parts) < 2:
        return False
        
    repo_path = parts[1]
    api_url = f"https://api.github.com/repos/{repo_path}"
    
    headers = {}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
        
    try:
        # Check repo exists and is public
        response = requests.get(api_url, headers=headers)
        if response.status_code != 200:
            return False
            
        data = response.json()
        if data.get("private", True):
            return False
            
        # Check README exists
        readme_url = f"https://api.github.com/repos/{repo_path}/readme"
        readme_response = requests.get(readme_url, headers=headers)
        if readme_response.status_code != 200:
            return False
            
        return True
    except Exception as e:
        print(f"GitHub Verification Exception: {e}")
        return False
