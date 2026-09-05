import pytest
from unittest.mock import MagicMock, AsyncMock
from fastapi.testclient import TestClient

import main

@pytest.fixture
def client():
    print("DEBUG type(main.app):", type(main.app), main.app)
    return TestClient(main.app)

@pytest.fixture
def mock_supabase(monkeypatch):
    mock = MagicMock()
    monkeypatch.setattr(main, "supabase", mock)
    return mock