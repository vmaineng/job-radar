import main

def test_list_jobs_default(client, monkeypatch):
    
    fake_jobs = [{"id": 1, "title": "Junior SWE", "score": 75}]
    monkeypatch.setattr(main, "get_dashboard_jobs", lambda **kwargs: fake_jobs)

    resp = client.get("/api/jobs")

    assert resp.status_code == 200
    assert resp.json() == fake_jobs

    