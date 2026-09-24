# Student service access policy

The service verifies JWT signatures and uses the signed `tenantCode`, `userId`,
and `roles` claims. Body fields and request headers cannot select another school.
Missing school/user claims fail closed. There is no implicit platform-admin bypass.

| Action | School owner | Instructor | Student |
| --- | --- | --- | --- |
| Read students, enrollments, feedback, progress | Own school | Assigned students in own school | Own records |
| Create/update/delete students; assign instructor | Own school | Denied | Denied |
| Create/update/delete enrollments | Own school | Denied | Denied |
| Create/update progress and scores | Own school | Assigned students in own school | Denied |
| Create/update feedback | Own school | Assigned students in own school | Own records |
| Delete feedback/progress | Own school | Denied | Denied |

Student creation stamps the authenticated school code. Updates cannot change the
user identity or school. Related records cannot be reassigned to another student.
Course lists are filtered in the database through the owning student's school,
user identity or instructor assignment. Child rows without a valid owning student
are inaccessible. The `instructorUserId` field refers to a UserManagement account,
not another student record; only the school owner can set it.

## Existing data and deployment

`db/001_student_ownership.sql` adds nullable ownership columns and indexes for
PostgreSQL installations with manually managed schemas. The current application's
`ddl-auto=update` also adds columns, but does not backfill ownership. This change
has not been applied to any live database by the development task.

Before rollout, map each existing student's `user_id` to a verified school
membership in UserManagement, then populate `students.tenant_code`. Confirm the
school codes match the signed login tokens exactly. Do not infer ownership from
the first user accessing a record, or assign a blanket default school. Records
with a missing school remain hidden. Verify instructor memberships before
populating `instructor_user_id`; unassigned instructors cannot access records.

The current unique `user_id` constraint is preserved: one student record per user.
Supporting one account enrolled in multiple schools needs a separate data-model
migration. School-owner API creation/assignment does not yet validate account
membership against UserManagement; this must be added when building that workflow.
It cannot grant cross-school reads because the request school must still match.

## Integration boundaries

`GET /api/student-progress/comprehensive/me` resolves the student record from the
signed account ID and school. The frontend uses this endpoint instead of treating
an account ID as a student-record ID. Explicit student endpoints take record IDs.
The existing exam service uses account IDs, so comprehensive progress translates
back to `Student.userId` for that call.

`POST /api/student-progress/update-after-exam` now requires an owner or assigned
instructor. Student tokens cannot submit arbitrary grades. The existing exam
service callback sends no authentication and remains rejected; a separately
authenticated service-to-service integration with verified result ownership is
needed before automated grade synchronization can work. Do not fix this by
making the endpoint public or allowing students to write scores.

This change covers the student service only. The exam service's direct result
endpoints, other services, token issuance/membership validation, and role lifecycle
still need their own authorization review. This is not a claim of platform-wide
isolation. Comprehensive results still use the pre-existing optional exam call
and return no embedded exam results if that service is unavailable.

## Verification

Run `mvn -Dtest=StudentIsolationTests test` from this directory. The regression
suite uses signed JWTs, real security filters/controllers/services, and mocked
repositories/remote clients. It checks cross-school reads/writes/deletes, forged
ownership fields, student self-access, instructor assignment, scoped list calls,
related-record ID tampering, and score-write restrictions. It does not verify
SQL execution, live database migration, or deployed inter-service behavior.
