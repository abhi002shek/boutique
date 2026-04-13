import os
import uuid
from fastapi import APIRouter, File, UploadFile, Form, HTTPException, Header
from typing import Optional, List
from app.services.supabase_client import supabase

router = APIRouter()

ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "trisha2024")

def verify_admin(authorization: str = Header(...)):
    if authorization != f"Bearer {ADMIN_PASSWORD}":
        raise HTTPException(status_code=401, detail="Unauthorized")

@router.post("/sarees")
async def add_saree(
    name: str = Form(...),
    fabric: str = Form(...),
    occasion: str = Form(...),
    price: int = Form(...),
    colors: str = Form(...),
    description: str = Form(""),
    care: str = Form("Dry clean only"),
    available: bool = Form(True),
    images: List[UploadFile] = File(...),
    authorization: str = Header(...)
):
    verify_admin(authorization)
    try:
        image_urls = []
        for image in images:
            image_bytes = await image.read()
            filename = f"{uuid.uuid4()}.jpg"
            supabase.storage.from_("saree-images").upload(
                filename, image_bytes, {"content-type": image.content_type}
            )
            image_urls.append(supabase.storage.from_("saree-images").get_public_url(filename))

        res = supabase.table("sarees").insert({
            "name": name,
            "fabric": fabric,
            "occasion": occasion,
            "price": price,
            "colors": colors,
            "description": description,
            "care": care,
            "available": available,
            "image_url": image_urls[0],
            "image_urls": image_urls
        }).execute()
        return {"success": True, "saree": res.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/sarees/{saree_id}")
async def update_saree(
    saree_id: str,
    available: Optional[bool] = Form(None),
    price: Optional[int] = Form(None),
    authorization: str = Header(...)
):
    verify_admin(authorization)
    updates = {}
    if available is not None:
        updates["available"] = available
    if price is not None:
        updates["price"] = price
    res = supabase.table("sarees").update(updates).eq("id", saree_id).execute()
    return {"success": True, "saree": res.data[0]}

@router.delete("/sarees/{saree_id}")
def delete_saree(saree_id: str, authorization: str = Header(...)):
    verify_admin(authorization)
    supabase.table("sarees").delete().eq("id", saree_id).execute()
    return {"success": True}
