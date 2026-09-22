"""Seed development data. Run with: python -m app.seed.seed_data

Safe to run multiple times: users are created once, and each project is
created only if its key doesn't already exist.
"""
from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.issue import Issue, IssuePriority, IssueStatus, IssueType
from app.models.project import Project
from app.models.project_member import ProjectMember
from app.models.user import User, UserRole


def _ensure_users(db):
    admin = db.query(User).filter(User.email == "admin@minijira.app").first()
    if admin is None:
        admin = User(
            name="Admin",
            email="admin@minijira.app",
            password_hash=hash_password("admin123"),
            role=UserRole.ADMIN,
        )
        db.add(admin)

    member1 = db.query(User).filter(User.email == "khanif@minijira.app").first()
    if member1 is None:
        member1 = User(
            name="Khanif",
            email="khanif@minijira.app",
            password_hash=hash_password("member123"),
            role=UserRole.MEMBER,
        )
        db.add(member1)

    member2 = db.query(User).filter(User.email == "dian@minijira.app").first()
    if member2 is None:
        member2 = User(
            name="Dian",
            email="dian@minijira.app",
            password_hash=hash_password("member123"),
            role=UserRole.MEMBER,
        )
        db.add(member2)

    db.flush()
    return admin, member1, member2


def _ensure_project(db, *, key, name, description, admin, members, issues):
    if db.query(Project).filter(Project.key == key).first() is not None:
        print(f"Project {key} already exists, skipping.")
        return

    project = Project(key=key, name=name, description=description, created_by=admin.id)
    db.add(project)
    db.flush()

    db.add_all(ProjectMember(project_id=project.id, user_id=user.id) for user in members)

    for i, (title, itype, priority, status, assignee_id) in enumerate(issues, start=1):
        project.issue_counter = i
        db.add(
            Issue(
                project_id=project.id,
                number=i,
                title=title,
                type=itype,
                priority=priority,
                status=status,
                assignee_id=assignee_id,
                reporter_id=admin.id,
            )
        )
    print(f"Project {key} created.")


def run() -> None:
    db = SessionLocal()
    try:
        admin, member1, member2 = _ensure_users(db)
        team = [admin, member1, member2]

        _ensure_project(
            db,
            key="IT",
            name="IT Operations",
            description="Internal IT team tracker",
            admin=admin,
            members=team,
            issues=[
                ("Setup VPN access for new hire", IssueType.TASK, IssuePriority.MEDIUM, IssueStatus.TODO, member1.id),
                ("Email server intermittent downtime", IssueType.BUG, IssuePriority.CRITICAL, IssueStatus.IN_PROGRESS, member2.id),
                ("Migrate file storage to new NAS", IssueType.STORY, IssuePriority.HIGH, IssueStatus.REVIEW, member1.id),
                ("Password reset self-service portal", IssueType.STORY, IssuePriority.LOW, IssueStatus.DONE, member2.id),
            ],
        )

        _ensure_project(
            db,
            key="WEB",
            name="IT Web Developer",
            description="Website and internal web application development",
            admin=admin,
            members=team,
            issues=[
                ("Redesign internal employee portal homepage", IssueType.STORY, IssuePriority.MEDIUM, IssueStatus.TODO, member1.id),
                ("Fix broken image upload on careers page", IssueType.BUG, IssuePriority.HIGH, IssueStatus.IN_PROGRESS, member2.id),
                ("Add dark mode toggle to intranet site", IssueType.TASK, IssuePriority.LOW, IssueStatus.REVIEW, member1.id),
                ("Migrate portal frontend from Bootstrap 4 to Tailwind", IssueType.STORY, IssuePriority.MEDIUM, IssueStatus.DONE, member2.id),
            ],
        )

        _ensure_project(
            db,
            key="SYS",
            name="IT System Developer",
            description="Internal systems, integrations, and backend services development",
            admin=admin,
            members=team,
            issues=[
                ("Integrate SSO with Azure AD", IssueType.STORY, IssuePriority.HIGH, IssueStatus.IN_PROGRESS, member1.id),
                ("Database replication lag on reporting server", IssueType.BUG, IssuePriority.CRITICAL, IssueStatus.TODO, member2.id),
                ("Automate nightly backup verification", IssueType.TASK, IssuePriority.MEDIUM, IssueStatus.REVIEW, member1.id),
                ("Upgrade internal API gateway to v2", IssueType.STORY, IssuePriority.MEDIUM, IssueStatus.DONE, member2.id),
            ],
        )

        _ensure_project(
            db,
            key="AST",
            name="IT Asset Management",
            description="Hardware and software asset tracking, procurement, and lifecycle management",
            admin=admin,
            members=team,
            issues=[
                ("Audit unused software licenses Q3", IssueType.TASK, IssuePriority.MEDIUM, IssueStatus.TODO, member2.id),
                ("Laptop inventory mismatch in warehouse", IssueType.BUG, IssuePriority.HIGH, IssueStatus.IN_PROGRESS, member1.id),
                ("Set up asset tagging for new monitor batch", IssueType.TASK, IssuePriority.LOW, IssueStatus.REVIEW, member2.id),
                ("Decommission end-of-life servers", IssueType.STORY, IssuePriority.HIGH, IssueStatus.DONE, member1.id),
            ],
        )

        db.commit()
        print("Seed complete: admin@minijira.app / admin123, khanif@minijira.app / member123, dian@minijira.app / member123")
    finally:
        db.close()


if __name__ == "__main__":
    run()
