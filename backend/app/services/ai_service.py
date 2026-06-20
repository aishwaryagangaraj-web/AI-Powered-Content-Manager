import asyncio
from collections.abc import AsyncIterator

import httpx

from app.core.config import settings
from app.schemas.ai import GenerateRequest

SYSTEM_PROMPTS = {
    "blog": "Write a structured, engaging blog post with a strong title, introduction, useful sections, and conclusion.",
    "linkedin": "Write a compelling LinkedIn post with a hook, concise insights, natural formatting, and relevant hashtags.",
    "instagram": "Write an engaging Instagram caption with a hook, clear voice, call to action, and relevant hashtags.",
    "email": "Write a polished email with a useful subject line, greeting, concise body, and sign-off.",
    "resume": "Write a concise achievement-oriented professional resume summary. Do not invent facts.",
    "seo": "Write search-optimized content with a natural title, headings, keywords, useful detail, and meta description.",
    "product": "Write persuasive product copy with a clear benefit-led headline, key features, proof, and a concise call to action.",
    "youtube": "Write a YouTube description with a strong opening, useful summary, chapter-ready structure, call to action, and relevant keywords.",
    "general": "Write clear, original, useful content that directly fulfills the request.",
}


class AIService:
    def _messages(self, request: GenerateRequest) -> list[dict[str, str]]:
        instruction = SYSTEM_PROMPTS.get(request.content_type, SYSTEM_PROMPTS["general"])
        system = f"{instruction} Use a {request.tone} tone and {request.length} length. Return only the finished content."
        return [{"role": "system", "content": system}, {"role": "user", "content": request.prompt}]

    async def generate(self, request: GenerateRequest) -> tuple[str, str]:
        provider = settings.ai_provider.lower()
        if provider == "groq" and settings.groq_api_key:
            return await self._groq(request), "groq"
        if provider == "gemini" and settings.gemini_api_key:
            return await self._gemini(request), "gemini"
        return self._demo(request), "demo"

    async def _groq(self, request: GenerateRequest) -> str:
        async with httpx.AsyncClient(timeout=90) as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {settings.groq_api_key}"},
                json={"model": "llama-3.3-70b-versatile", "messages": self._messages(request), "temperature": 0.7},
            )
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]

    async def _gemini(self, request: GenerateRequest) -> str:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={settings.gemini_api_key}"
        messages = self._messages(request)
        prompt = f"{messages[0]['content']}\n\nRequest: {messages[1]['content']}"
        async with httpx.AsyncClient(timeout=90) as client:
            response = await client.post(url, json={"contents": [{"parts": [{"text": prompt}]}]})
            response.raise_for_status()
            return response.json()["candidates"][0]["content"]["parts"][0]["text"]

    def _demo(self, request: GenerateRequest) -> str:
        topic = request.prompt.strip()
        drafts = {
            "blog": f"# {topic[:80]}\n\nGreat content starts with a clear problem and a useful point of view. {topic}\n\n## Why it matters\n\nA focused approach helps readers understand the idea, apply it quickly, and remember the central message.\n\n## A practical way forward\n\nStart with the desired outcome, support it with concrete examples, and end with one action the reader can take today.\n\n## Final thought\n\nClarity earns attention. Make every section useful, specific, and easy to act on.",
            "linkedin": f"Most people overcomplicate this:\n\n{topic}\n\nThe better approach is simple:\n\n• Start with the outcome\n• Focus on one useful insight\n• Back it with a real example\n• Give readers a clear next step\n\nUseful beats impressive. Every time.\n\nWhat would you add?\n\n#ContentStrategy #Growth #Productivity",
            "instagram": f"Stop scrolling—this is your reminder to make the idea happen. ✨\n\n{topic}\n\nKeep it clear. Keep it useful. Make the next step easy.\n\nSave this for later and share it with someone building something meaningful.\n\n#ContentCreator #CreativeWork #BuildInPublic",
            "email": f"Subject: A focused next step\n\nHi there,\n\nI’m reaching out regarding {topic}.\n\nThe goal is to keep the next step clear, practical, and aligned with the outcome we discussed. Please let me know what works for you, and I’ll take care of the details.\n\nBest,\nYour Name",
            "resume": f"Results-driven professional with experience in {topic}. Known for translating complex priorities into clear execution, collaborating across teams, and delivering measurable outcomes. Brings strong communication, ownership, and a continuous-improvement mindset.",
            "seo": f"# {topic[:80]}: A Practical Guide\n\n**Meta description:** Learn the essential principles, practical steps, and common mistakes related to {topic[:120]}.\n\n## What you need to know\n\n{topic} is most effective when the strategy is specific, useful, and built around genuine reader intent.\n\n## Best practices\n\n1. Define the audience and desired outcome.\n2. Organize the answer with descriptive headings.\n3. Use keywords naturally and support claims with evidence.\n4. End with a relevant next step.\n\n## Conclusion\n\nPrioritize usefulness first. Search performance follows content that answers real questions well.",
            "product": f"# Make the next step easier\n\n{topic}\n\nBuilt for people who value clarity, speed, and dependable results. Get the core benefits without unnecessary complexity, backed by a workflow designed to fit how you already work.\n\n**Why you will love it**\n\n• Clear value from day one\n• Simple, focused experience\n• Designed for reliable results\n\nReady to get started? Try it today.",
            "youtube": f"Discover a practical approach to {topic}.\n\nIn this video, we break down the essential ideas, show how to apply them, and share the mistakes worth avoiding.\n\nCHAPTERS\n00:00 Introduction\n01:15 Core principles\n04:30 Practical workflow\n08:00 Next steps\n\nSubscribe for more clear, useful guides and share your biggest takeaway in the comments.\n\n#ContentStrategy #CreatorTips #Productivity",
            "general": f"# Draft\n\n{topic}\n\nFocus the message around one clear outcome, support it with useful detail, and close with an actionable next step.",
        }
        return drafts.get(request.content_type, drafts["general"])

    async def stream(self, request: GenerateRequest) -> AsyncIterator[str]:
        text, _ = await self.generate(request)
        words = text.split(" ")
        for index, word in enumerate(words):
            yield word + (" " if index < len(words) - 1 else "")
            await asyncio.sleep(0.015)


ai_service = AIService()
