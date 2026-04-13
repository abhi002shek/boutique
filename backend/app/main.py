from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import sarees, tryon, admin

app = FastAPI(title="Trisha Fancy Sarees API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sarees.router, prefix="/sarees", tags=["sarees"])
app.include_router(tryon.router, prefix="/tryon", tags=["tryon"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])

@app.get("/")
def root():
    return {"status": "Trisha Fancy Sarees API is running"}
