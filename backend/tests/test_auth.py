from unittest.mock import MagicMock

import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from auth import get_current_user
from main import app

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