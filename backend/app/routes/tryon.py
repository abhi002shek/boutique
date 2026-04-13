import os
import base64
import tempfile
import httpx
from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from gradio_client import Client, handle_file
from app.services.supabase_client import supabase

router = APIRouter()

HF_TOKEN = os.environ.get("HF_TOKEN")

@router.post("/")
async def virtual_tryon(
    photo: UploadFile = File(...),
    saree_id: str = Form(...)
):
    try:
        res = supabase.table("sarees").select("image_url, name").eq("id", saree_id).single().execute()
        if not res.data or not res.data.get("image_url"):
            raise HTTPException(status_code=404, detail="Saree not found or has no image")

        saree_image_url = res.data["image_url"]

        # Save person photo to temp file
        photo_bytes = await photo.read()
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
            tmp.write(photo_bytes)
            person_path = tmp.name

        # Download saree image to temp file
        async with httpx.AsyncClient(timeout=60) as client:
            saree_res = await client.get(saree_image_url)
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp2:
            tmp2.write(saree_res.content)
            garment_path = tmp2.name

        print(f"Connecting to IDM-VTON with token: {bool(HF_TOKEN)}")
        gr_client = Client("yisol/IDM-VTON")

        print("Calling /tryon API...")
        result = gr_client.predict(
            vton_img=handle_file(person_path),
            garm_img=handle_file(garment_path),
            garment_des="A woman wearing a beautiful Indian saree",
            is_checked=True,
            is_checked_crop=False,
            denoise_steps=30,
            seed=42,
            api_name="/tryon"
        )

        print("Raw result:", result)
        # result is typically (output_image_path, masked_image_path)
        result_image_path = result[0] if isinstance(result, (list, tuple)) else result

        with open(result_image_path, "rb") as f:
            img_b64 = base64.b64encode(f.read()).decode()

        return {
            "result_url": f"data:image/png;base64,{img_b64}",
            "saree_name": res.data["name"]
        }

    except HTTPException:
        raise
    except Exception as e:
        print("Tryon error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
