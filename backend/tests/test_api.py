import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_health_and_root():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/")
        assert res.status_code == 200
        data = res.json()
        assert data["engine"] == "SAFRA"

        res_health = await client.get("/api/health")
        assert res_health.status_code == 200
        assert res_health.json()["status"] == "HEALTHY"

@pytest.mark.asyncio
async def test_financial_reality_score():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/analytics/financial-reality")
        assert res.status_code == 200
        data = res.json()
        assert "overall_reality_score" in data
        assert 0.0 <= data["overall_reality_score"] <= 100.0

@pytest.mark.asyncio
async def test_where_is_my_money_hero_payment():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/payments/PAY-4999-HERO")
        assert res.status_code == 200
        payment = res.json()
        assert payment["amount"] == 4999.0
        assert payment["status"] == "PENDING"
        assert payment["bank_debited"] == "YES"
        assert payment["merchant_confirmed"] == "NO"

@pytest.mark.asyncio
async def test_agentic_investigation_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.post("/api/investigations/PAY-4999-HERO")
        assert res.status_code == 200
        data = res.json()
        assert data["confidence"] > 0.8
        assert len(data["hypotheses"]) > 0
        assert len(data["reasoning_steps"]) >= 5
        assert "DO_NOT_PAY_AGAIN" in data["recommendation"]
