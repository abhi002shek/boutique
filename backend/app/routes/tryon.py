import os
import base64
import tempfile
from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from app.services.supabase_client import supabase
from gradio_client import Client, handle_file
import httpx

router = APIRouter()

@router.post("/")
async def virtual_tryon(
    photo: UploadFile = File(...),
    saree_id: str = Form(...)
):
    try:
        res = supabase.table("sarees").select("image_url, name").eq("id", saree_id).single().execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Saree not found")

        saree_image_url = res.data["image_url"]
        if not saree_image_url:
            raise HTTPException(status_code=400, detail="Saree has no image")

        photo_bytes = await photo.read()
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
            tmp.write(photo_bytes)
            tmp_path = tmp.name

        async with httpx.AsyncClient(timeout=30) as client:
            saree_res = await client.get(saree_image_url)
            with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp2:
                tmp2.write(saree_res.content)
                saree_path = tmp2.name

        print("Calling CatVTON...")
        gr_client = Client("zhengchong/CatVTON")

        result = gr_client.predict(
            handle_file(tmp_path),
            handle_file(saree_path),
            "upper",
            api_name="/submit"
        )

        print("Result:", result)
        result_image_path = result if isinstance(result, str) else result[0]

        with open(result_image_path, "rb") as f:
            img_bytes = f.read()
        img_b64 = base64.b64encode(img_bytes).decode()
        result_url = f"data:image/png;base64,{img_b64}"

        return {"result_url": result_url, "saree_name": res.data["name"]}

    except HTTPException:
        raise
    except Exception as e:
        print("Full error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
