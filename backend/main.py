import os
from dotenv import load_dotenv
load_dotenv()

import httpx
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from bs4 import BeautifulSoup
from google import genai

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found!")

client = genai.Client(api_key=api_key)

MODELS_TO_TRY = [
    "models/gemini-2.5-flash",
    "models/gemini-2.0-flash-001",
    "models/gemini-2.0-flash-lite",
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FANDOM_HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; GrimoireBot/1.0)"
}


class LookupRequest(BaseModel):
    query: str
    game: str


class ChatRequest(BaseModel):
    query: str
    game: str
    boss_context: str
    message: str
    arcane_mode: bool = False


async def scrape_fandom(query: str, game: str) -> tuple[str, str]:
    game_slug = game.lower().replace(" ", "-").replace("'", "")
    query_slug = query.replace(" ", "_")

    urls_to_try = [
        f"https://{game_slug}.fandom.com/wiki/{query_slug}",
        f"https://{game_slug}.fandom.com/wiki/Special:Search?query={query.replace(' ', '+')}",
    ]

    async with httpx.AsyncClient(headers=FANDOM_HEADERS, timeout=10, follow_redirects=True) as client_http:
        for url in urls_to_try:
            try:
                response = await client_http.get(url)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, "html.parser")
                    for tag in soup(["script", "style", "nav", "footer", "aside"]):
                        tag.decompose()

                    # Grab first image from infobox
                    image_url = ""
                    # Try multiple selectors Fandom uses
                    img = None
                    infobox = soup.find("aside", {"class": "portable-infobox"})
                    if infobox:
                        img = infobox.find("img")
                    if not img:
                        # Try figure tags
                        figure = soup.find("figure", {"class": "pi-item"})
                        if figure:
                            img = figure.find("img")
                    if not img:
                        # Try first image in content
                        content_div = soup.find("div", {"class": "mw-parser-output"})
                        if content_div:
                            img = content_div.find("img")
                    if img and img.get("src"):
                        src = img.get("src", "")
                        if "data:image" not in src and src.startswith("http"):
                            image_url = src.split("/revision")[0]

                    content = soup.find("div", {"class": "mw-parser-output"})
                    if content:
                        text = content.get_text(separator="\n", strip=True)
                        return text[:4000], image_url
            except Exception:
                continue
    return "", ""


async def ask_gemini_lookup(query: str, game: str, scraped_text: str) -> dict:
    if scraped_text:
        context = f"Here is information scraped from the {game} wiki about '{query}':\n\n{scraped_text}"
    else:
        context = f"Use your training knowledge about the game '{game}' to answer about '{query}'."

    prompt = f"""You are Grimoire, a mystical familiar spirit who helps RPG players.

{context}

Extract information about '{query}' from '{game}' and return ONLY a valid JSON object with exactly this structure:
{{
  "name": "exact name of the boss/enemy/item",
  "type": "boss" or "enemy" or "item" or "location",
  "lore": "2-3 sentence atmospheric lore description",
  "weaknesses": ["weakness1", "weakness2"],
  "resistances": ["resistance1", "resistance2"],
  "loot": [
    {{"item": "item name", "chance": "drop rate or guaranteed"}}
  ],
  "tips": ["tip1", "tip2", "tip3"],
  "difficulty": "Easy" or "Medium" or "Hard" or "Legendary"
}}

If a field has no information, use an empty array [] or "Unknown".
Return ONLY the JSON object, no other text."""

    for model_name in MODELS_TO_TRY:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt
            )
            text = response.text.strip()
            if text.startswith("```"):
                text = text.split("```")[1]
                if text.startswith("json"):
                    text = text[4:]
            return json.loads(text.strip())
        except Exception as e:
            if "503" in str(e) or "UNAVAILABLE" in str(e) or "429" in str(e):
                continue
            return {
                "name": query,
                "type": "unknown",
                "lore": "The ancient tomes are unclear on this matter...",
                "weaknesses": [],
                "resistances": [],
                "loot": [],
                "tips": ["Grimoire could not retrieve data. Try a different spelling."],
                "difficulty": "Unknown",
                "error": str(e)
            }

    return {
        "name": query,
        "type": "unknown",
        "lore": "The ancient tomes are overwhelmed with seekers. Try again in a moment.",
        "weaknesses": [],
        "resistances": [],
        "loot": [],
        "tips": ["All models are currently busy. Please try again in 30 seconds."],
        "difficulty": "Unknown",
        "error": "All models unavailable"
    }


@app.post("/lookup")
async def lookup(req: LookupRequest):
    scraped, image_url = await scrape_fandom(req.query, req.game)
    result = await ask_gemini_lookup(req.query, req.game, scraped)
    result["image_url"] = image_url
    return result


@app.post("/chat")
async def chat(req: ChatRequest):
    if req.arcane_mode:
        personality = "Speak as an ancient cryptic familiar spirit — mysterious, poetic, archaic. Use 'thee', 'thy', 'hath'. Keep answers helpful but dramatic."
    else:
        personality = "Speak as a knowledgeable gaming companion — friendly, direct, and helpful. Keep answers concise."

    prompt = f"""You are Grimoire, a magical familiar spirit helping a player with {req.game}.

{personality}

The player is asking about: {req.boss_context}
Their question: {req.message}

Answer helpfully in 2-4 sentences. Stay in character."""

    for model_name in MODELS_TO_TRY:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt
            )
            return {"reply": response.text.strip()}
        except Exception as e:
            if "503" in str(e) or "UNAVAILABLE" in str(e) or "429" in str(e):
                continue
            return {"reply": "The grimoire pages blur... try again, seeker."}

    return {"reply": "The ancient tomes are overwhelmed. Please try again in a moment."}


@app.get("/health")
async def health():
    return {"status": "Grimoire is awakened"}
