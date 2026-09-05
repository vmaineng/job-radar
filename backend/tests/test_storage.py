import main

def test_list_jobs_default(client, monkeypatch):
    
    fake_jobs = [{"id": 1, "title": "Junior SWE", "score": 75}]
    monkeypatch.setattr(main, "get_dashboard_jobs", lambda **kwargs: fake_jobs)

    resp = client.get("/api/jobs")

    assert resp.status_code == 200
    assert resp.json() == fake_jobs

def test_lists_jobs_passes_query_params(client, monkeypatch):
    captured={}

    def fake_get_dashboard_jobs(**kwargs):
        captured.update(kwargs)
        return []

    monkeypatch.setattr(main, "get_dashboard_jobs", fake_get_dashboard_jobs)
    client.get("/api/jobs?min_score=80&max_age_days=7&today_only=true")

    assert captured == {"min_score": 80, "max_age_days": 7, "today_only": True}