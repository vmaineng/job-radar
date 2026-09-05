# check.py
from fastapi.testclient import TestClient
import main

print("type:", type(main.app))
client = TestClient(main.app)
resp = client.get("/api/jobs")
print(resp.status_code, resp.text)