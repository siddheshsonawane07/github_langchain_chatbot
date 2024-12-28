import requests


def fetch_repositories():
    """Fetch repository details from the Express server."""
    try:
        response = requests.get("http://localhost:3000/user/repos")
        response.raise_for_status()
        print(response.json())
    except requests.exceptions.RequestException as e:
        print(f"Error fetching repositories: {e}")
        return []


fetch_repositories()
