def test_run_now_skips_if_already_ran(client, mock_supabase):
    mock_supabase.table.return_value.select.return_value.gte.return_value.execute.return_value.data = [
        {"id": "abc123"}
    ]

    resp = client.post("/api/run-now")

    assert resp.status_code == 200
    assert resp.json() == {"status": "skipped", "reason": "already ran today"}