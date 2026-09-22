from tests.conftest import login


def test_login_success(client, admin_user):
    response = client.post(
        "/api/v1/auth/login", json={"email": "admin@test.local", "password": "admin123"}
    )
    assert response.status_code == 200
    assert response.json()["user"]["email"] == "admin@test.local"
    assert "access_token" in response.cookies


def test_login_wrong_password(client, admin_user):
    response = client.post(
        "/api/v1/auth/login", json={"email": "admin@test.local", "password": "wrong"}
    )
    assert response.status_code == 401


def test_me_requires_auth(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401


def test_me_returns_current_user(client, admin_user):
    login(client, "admin@test.local", "admin123")
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 200
    assert response.json()["email"] == "admin@test.local"


def test_logout_clears_session(client, admin_user):
    login(client, "admin@test.local", "admin123")
    response = client.post("/api/v1/auth/logout")
    assert response.status_code == 200

    me_response = client.get("/api/v1/auth/me")
    assert me_response.status_code == 401
