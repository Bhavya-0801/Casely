from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
async def login(req: LoginRequest):
    return {
        "access_token": "demo_casely_investigator_jwt_token_2026",
        "token_type": "bearer",
        "role": "investigator",
        "user": {
            "name": "Investigator Demo",
            "email": "investigator@casely.gov.in",
            "role": "Authorized Investigator"
        }
    }


@router.get("/me")
async def me():
    return {
        "name": "Investigator Demo",
        "email": "investigator@casely.gov.in",
        "role": "Authorized Investigator"
    }
