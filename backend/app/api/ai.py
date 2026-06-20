import json

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse

from app.api.dependencies import get_current_user
from app.models.user import User
from app.schemas.ai import GenerateRequest, GenerateResponse
from app.services.ai_service import ai_service

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/generate", response_model=GenerateResponse)
async def generate(payload: GenerateRequest, _: User = Depends(get_current_user)):
    try:
        text, provider = await ai_service.generate(payload)
        return GenerateResponse(generated_text=text, provider=provider)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"AI provider error: {exc}") from exc


@router.post("/stream")
async def stream(payload: GenerateRequest, _: User = Depends(get_current_user)):
    async def event_stream():
        try:
            async for chunk in ai_service.stream(payload):
                yield f"data: {json.dumps({'chunk': chunk})}\n\n"
            yield f"data: {json.dumps({'done': True})}\n\n"
        except Exception as exc:
            yield f"data: {json.dumps({'error': str(exc)})}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream", headers={"Cache-Control": "no-cache"})
