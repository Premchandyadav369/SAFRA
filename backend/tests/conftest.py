import pytest
import asyncio
from app.database.session import engine, Base, AsyncSessionLocal
from app.services.simulation_service import SimulationService
from app.ml.models import safra_ml_engine

@pytest.fixture(scope="session", autouse=True)
async def setup_test_database():
    """Initializes schema, ML models, and seed topology for test suite."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    safra_ml_engine.load_or_train_models()
    
    async with AsyncSessionLocal() as session:
        await SimulationService.initialize_seed_data(session)
    
    yield
