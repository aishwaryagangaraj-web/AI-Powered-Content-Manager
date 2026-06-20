import os

os.environ["DATABASE_URL"] = "sqlite:///./test_content_manager.db"
os.environ["SECRET_KEY"] = "test-secret"

import pytest
from fastapi.testclient import TestClient

from app.db.base import Base
from app.db.session import engine
from app.main import app


@pytest.fixture(autouse=True)
def reset_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def auth_headers(client):
    response = client.post("/api/auth/register", json={"name": "Test User", "email": "test@example.com", "password": "strongpass123"})
    return {"Authorization": f"Bearer {response.json()['access_token']}"}
