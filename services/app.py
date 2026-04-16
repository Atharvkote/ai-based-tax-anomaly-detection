from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from middlewares.error_handler import unhandled_exception_handler
from routes.ml_routes import router as ml_router
from utils.response import success_response

app = FastAPI(title="Tax Evasion ML Service")
app.add_exception_handler(Exception, unhandled_exception_handler)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(ml_router)

@app.get("/")
def home():
    return success_response({"status": "ML Service Running"}, "Service healthy")

@app.get("/health")
def health():
    return success_response({"status": "ok"}, "Service healthy")