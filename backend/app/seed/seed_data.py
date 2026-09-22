"""Seed development data. Run with: python -m app.seed.seed_data"""
from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.issue import Issue, IssuePriority, IssueStatus, IssueType
from app.models.project import Project
from app.models.project_member import ProjectMember
from app.models.user import User, UserRole


def run() -> None:
    db = SessionLocal()
    try:
        if db.query(User).first() is not None:
            print("Seed data already present, skipping.")
            return

        admin = User(
            name="Admin",
            email="admin@minijira.app",
            password_hash=hash_password("admin123"),
            role=UserRole.ADMIN,
        )
        member1 = User(
            name="Khanif",
            email="khanif@minijira.app",
            password_hash=hash_password("member123"),
            role=UserRole.MEMBER,
        )
        member2 = User(
            name="Dewi",
            email="dewi@minijira.app",
            password_hash=hash_password("member123"),
            role=UserRole.MEMBER,
        )
        db.add_all([admin, member1, member2])
        db.flush()

        project = Project(key="IT", name="IT Operations", description="Internal IT team tracker", created_by=admin.id)
        db.add(project)
        db.flush()

        db.add_all(
            [
                ProjectMember(project_id=project.id, user_id=admin.id),
                ProjectMember(project_id=project.id, user_id=member1.id),
                ProjectMember(project_id=project.id, user_id=member2.id),
            ]
        )

        seed_issues = [
            ("Setup VPN access for new hire", IssueType.TASK, IssuePriority.MEDIUM, IssueStatus.TODO, member1.id),
            ("Email server intermittent downtime", IssueType.BUG, IssuePriority.CRITICAL, IssueStatus.IN_PROGRESS, member2.id),
            ("Migrate file storage to new NAS", IssueType.STORY, IssuePriority.HIGH, IssueStatus.REVIEW, member1.id),
            ("Password reset self-service portal", IssueType.STORY, IssuePriority.LOW, IssueStatus.DONE, member2.id),
        ]
        for i, (title, itype, priority, status, assignee_id) in enumerate(seed_issues, start=1):
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

        db.commit()
        print("Seed data created: admin@minijira.app / admin123, khanif@minijira.app / member123")
    finally:
        db.close()


if __name__ == "__main__":
    run()
