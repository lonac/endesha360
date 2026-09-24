-- Apply to the student-service PostgreSQL database before deploying if schema
-- updates are managed manually. No ownership is inferred for existing rows.
BEGIN;
ALTER TABLE students ADD COLUMN IF NOT EXISTS tenant_code varchar(255);
ALTER TABLE students ADD COLUMN IF NOT EXISTS instructor_user_id bigint;
CREATE INDEX IF NOT EXISTS idx_students_tenant_user ON students (tenant_code, user_id);
CREATE INDEX IF NOT EXISTS idx_students_tenant_instructor ON students (tenant_code, instructor_user_id);
COMMIT;
