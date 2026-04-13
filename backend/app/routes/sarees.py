from fastapi import APIRouter, HTTPException
from app.services.supabase_client import supabase

router = APIRouter()

@router.get("/")
def get_sarees():
    try:
        res = supabase.table("sarees").select("*").order("created_at", desc=True).execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{saree_id}")
def get_saree(saree_id: str):
    try:
        res = supabase.table("sarees").select("*").eq("id", saree_id).single().execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Saree not found")
        return res.data
    except Exception as e:
        raise HTTPException(status_code=404, detail="Saree not found")
