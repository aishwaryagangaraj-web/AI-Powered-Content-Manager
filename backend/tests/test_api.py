def test_register_login_and_profile(client):
    registered = client.post("/api/auth/register", json={"name": "Ada Lovelace", "email": "ada@example.com", "password": "analytical123"})
    assert registered.status_code == 201
    token = registered.json()["access_token"]
    profile = client.get("/api/auth/profile", headers={"Authorization": f"Bearer {token}"})
    assert profile.status_code == 200
    assert profile.json()["email"] == "ada@example.com"
    logged_in = client.post("/api/auth/login", json={"email": "ada@example.com", "password": "analytical123"})
    assert logged_in.status_code == 200
    headers = {"Authorization": f"Bearer {token}"}
    updated = client.put("/api/auth/profile", json={"name": "Ada Byron"}, headers=headers)
    assert updated.status_code == 200
    assert updated.json()["name"] == "Ada Byron"
    incorrect = client.put("/api/auth/password", json={"current_password": "incorrect1", "new_password": "new-password-123"}, headers=headers)
    assert incorrect.status_code == 400
    changed = client.put("/api/auth/password", json={"current_password": "analytical123", "new_password": "new-password-123"}, headers=headers)
    assert changed.status_code == 204
    assert client.post("/api/auth/login", json={"email": "ada@example.com", "password": "new-password-123"}).status_code == 200


def test_content_crud_and_analytics(client, auth_headers):
    payload = {"title": "Launch post", "content_type": "linkedin", "prompt": "Announce our launch", "generated_text": "We are live."}
    created = client.post("/api/content", json=payload, headers=auth_headers)
    assert created.status_code == 201
    content_id = created.json()["id"]
    detail = client.get(f"/api/content/{content_id}", headers=auth_headers)
    assert detail.status_code == 200
    assert detail.json()["title"] == "Launch post"
    updated = client.put(f"/api/content/{content_id}", json={"is_favorite": True}, headers=auth_headers)
    assert updated.json()["is_favorite"] is True
    listing = client.get("/api/content?favorite=true", headers=auth_headers)
    assert listing.json()["total"] == 1
    searched = client.get("/api/content?search=Launch&content_type=linkedin", headers=auth_headers)
    assert searched.json()["total"] == 1
    archived = client.put(f"/api/content/{content_id}", json={"is_archived": True}, headers=auth_headers)
    assert archived.json()["is_archived"] is True
    assert client.get("/api/content?archived=true", headers=auth_headers).json()["total"] == 1
    analytics = client.get("/api/analytics/dashboard", headers=auth_headers)
    assert analytics.json()["summary"]["total_content"] == 1
    assert client.delete(f"/api/content/{content_id}", headers=auth_headers).status_code == 204


def test_generate_and_exports(client, auth_headers):
    generated = client.post("/api/ai/generate", json={"prompt": "Explain useful content systems", "content_type": "blog"}, headers=auth_headers)
    assert generated.status_code == 200
    assert generated.json()["generated_text"]
    streamed = client.post("/api/ai/stream", json={"prompt": "Write a concise launch email", "content_type": "email"}, headers=auth_headers)
    assert streamed.status_code == 200
    assert '"done": true' in streamed.text
    exported = client.post("/api/export/txt", json={"title": "Draft", "text": "Hello world"}, headers=auth_headers)
    assert exported.status_code == 200
    assert "Hello world" in exported.text
    pdf = client.post("/api/export/pdf", json={"title": "Draft", "text": "Hello world"}, headers=auth_headers)
    assert pdf.status_code == 200
    assert pdf.headers["content-type"] == "application/pdf"


def test_extended_content_formats(client, auth_headers):
    for content_type in ("product", "youtube"):
        generated = client.post(
            "/api/ai/generate",
            json={"prompt": "Launch a focused creator tool", "content_type": content_type},
            headers=auth_headers,
        )
        assert generated.status_code == 200
        assert generated.json()["generated_text"]


def test_auth_protection_and_cors(client):
    assert client.get("/api/auth/profile").status_code == 401
    response = client.options(
        "/api/auth/profile",
        headers={"Origin": "http://127.0.0.1:5173", "Access-Control-Request-Method": "GET"},
    )
    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://127.0.0.1:5173"
