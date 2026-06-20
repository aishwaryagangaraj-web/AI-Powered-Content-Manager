from io import BytesIO
from urllib.parse import quote

from fastapi import APIRouter, Depends
from fastapi.responses import Response
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.utils import simpleSplit
from reportlab.pdfgen import canvas

from app.api.dependencies import get_current_user
from app.models.user import User
from app.schemas.export import ExportRequest

router = APIRouter(prefix="/export", tags=["Export"])


def safe_filename(title: str, extension: str) -> str:
    name = "".join(char for char in title if char.isalnum() or char in "-_ ").strip() or "content"
    return quote(f"{name}.{extension}")


@router.post("/pdf")
def export_pdf(payload: ExportRequest, _: User = Depends(get_current_user)):
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=LETTER)
    width, height = LETTER
    styles = getSampleStyleSheet()
    y = height - 60
    pdf.setTitle(payload.title)
    pdf.setFont("Helvetica-Bold", 18)
    for line in simpleSplit(payload.title, "Helvetica-Bold", 18, width - 80):
        pdf.drawString(40, y, line)
        y -= 24
    y -= 10
    pdf.setFont("Helvetica", 10)
    for paragraph in payload.text.splitlines() or [payload.text]:
        lines = simpleSplit(paragraph or " ", styles["BodyText"].fontName, 10, width - 80)
        for line in lines:
            if y < 50:
                pdf.showPage()
                pdf.setFont("Helvetica", 10)
                y = height - 50
            pdf.drawString(40, y, line)
            y -= 14
        y -= 5
    pdf.save()
    return Response(buffer.getvalue(), media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename*=UTF-8''{safe_filename(payload.title, 'pdf')}"})


@router.post("/txt")
def export_txt(payload: ExportRequest, _: User = Depends(get_current_user)):
    body = f"{payload.title}\n{'=' * len(payload.title)}\n\n{payload.text}"
    return Response(body, media_type="text/plain", headers={"Content-Disposition": f"attachment; filename*=UTF-8''{safe_filename(payload.title, 'txt')}"})
