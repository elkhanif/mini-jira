from tests.conftest import login


def _create_project(client, key="IT"):
    response = client.post(
        "/api/v1/projects", json={"key": key, "name": "IT Ops", "description": "desc"}
    )
    assert response.status_code == 201
    return response.json()


def test_create_issue_generates_sequential_key(client, admin_user):
    login(client, "admin@test.app", "admin123")
    project = _create_project(client)

    r1 = client.post(
        f"/api/v1/projects/{project['id']}/issues",
        json={"title": "First bug", "type": "bug", "priority": "high"},
    )
    r2 = client.post(
        f"/api/v1/projects/{project['id']}/issues",
        json={"title": "Second task", "type": "task", "priority": "low"},
    )

    assert r1.status_code == 201
    assert r2.status_code == 201
    assert r1.json()["issue_key"] == "IT-001"
    assert r2.json()["issue_key"] == "IT-002"


def test_non_member_cannot_create_issue(client, admin_user, member_user):
    login(client, "admin@test.app", "admin123")
    project = _create_project(client)

    login(client, "member@test.app", "member123")
    response = client.post(
        f"/api/v1/projects/{project['id']}/issues",
        json={"title": "Should fail", "type": "task", "priority": "low"},
    )
    assert response.status_code == 403


def test_status_update_logs_history(client, admin_user):
    login(client, "admin@test.app", "admin123")
    project = _create_project(client)
    issue = client.post(
        f"/api/v1/projects/{project['id']}/issues",
        json={"title": "Track me", "type": "task", "priority": "medium"},
    ).json()

    response = client.patch(f"/api/v1/issues/{issue['id']}/status", json={"status": "in_progress"})
    assert response.status_code == 200
    assert response.json()["status"] == "in_progress"

    history = client.get(f"/api/v1/issues/{issue['id']}/history").json()
    field_changes = [h["field_changed"] for h in history]
    assert "created" in field_changes
    assert "status" in field_changes
