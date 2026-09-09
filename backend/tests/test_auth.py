import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from fastapi import HTTPException
from main import app
from auth import get_current_user

fake_user = MagicMock(id="test-user-id")

def override_get_current_user():
    return fake_user

app.dependency_overrides[get_current_user] = override_get_current_user

client = TestClient(app)

@pytest.mark.asyncio
async def test_raises_401_when_no_authorization_header():
    with pytest.raises(HTTPException) as exc_info:
        await get_current_user(authorization=None)
    assert exc_info.value.status_code == 401
    assert exc_info.value.detail == 'Not authorized'