# AICIT — Project Development Plan

> **Status:** Active Planning — October 2026
> **Methodology:** Phased delivery — architecture first, then implementation in small, verifiable increments
> **Principle:** Each phase must be stable, tested, and deployable before the next phase begins

---

## Overview

| Phase | Name | Focus | Estimated Duration |
|---|---|---|---|
| Phase 0 | Architecture & Planning | Docs, repo setup, DB schema | Week 1 |
| Phase 1 | Foundation | Backend skeleton, DB migrations, auth | Week 2–3 |
| Phase 2 | Institute Management | Registration, approval workflow | Week 4–5 |
| Phase 3 | Student Management | Student CRUD with data isolation | Week 6–7 |
| Phase 4 | Certificate System | Request, approve, generate, download | Week 8–10 |
| Phase 5 | Public Website | AICIT public pages, verification | Week 11–12 |
| Phase 6 | MCA Admin Portal | Full admin dashboard | Week 13–15 |
| Phase 7 | Institute Portal | Institute login and dashboard | Week 16–17 |
| Phase 8 | Hardening | Security audit, tests, production prep | Week 18–19 |
| Phase 9 | Launch | Deployment, monitoring, docs | Week 20 |

---

## Phase 0 — Architecture & Planning
**Goal:** Establish the complete plan before writing any application code.

### Tasks

- [x] Inspect all 4 repositories (Master-Computers, Master-Computer-Backend-, aicit-backend, aicit-frontend)
- [x] Understand existing MCA system architecture
- [x] Write `docs/AICIT-ARCHITECTURE.md`
- [x] Write `docs/AICIT-PROJECT-PLAN.md`
- [x] Write `docs/LEGAL-CHECKLIST.md`

### Deliverables
- Architecture document
- Project plan
- Legal checklist
- No application code yet

---

## Phase 1 — Foundation
**Goal:** Both repos have a working skeleton. Backend runs, connects to DB, passes health check. Frontend starts and renders a placeholder.

### 1.1 — Backend Setup (`aicit-backend`)

**Tasks:**
- [ ] Initialize Spring Boot 3.2 project
  - Group: `com.aicit`
  - Artifact: `aicit-platform`
  - Dependencies: Web, JPA, Security, Validation, PostgreSQL, Lombok, SpringDoc
- [ ] Set up Maven project structure
  - `controller/` — REST controllers
  - `service/` — business logic interfaces
  - `service/impl/` — business logic implementations
  - `repository/` — Spring Data JPA repos
  - `entity/` — JPA entities
  - `dto/request/` — inbound DTOs
  - `dto/response/` — outbound DTOs
  - `security/` — JWT filter, entry point, util
  - `config/` — CORS, Security, OpenAPI, Auditing
  - `exception/` — custom exceptions + GlobalExceptionHandler
- [ ] Configure `application.properties`, `application-dev.properties`, `application-prod.properties`
- [ ] Configure CORS (whitelist `AICIT_FRONTEND_URL` env var)
- [ ] Implement `GET /api/public/health` endpoint
- [ ] Write DB migration scripts (V1 through V4, see below)
- [ ] Verify `mvn clean verify` passes

**DB Migration Scripts:**
- `V1__create_admin_users.sql`
- `V2__create_institutes.sql`
- `V3__create_institute_users.sql`
- `V4__create_courses.sql`

**Tests:**
- [ ] `HealthControllerTest` — GET /api/public/health returns 200
- [ ] Application context loads without error

---

### 1.2 — Authentication Backend

**Tasks:**
- [ ] Create `AdminUser` entity (SUPER_ADMIN, MCA_ADMIN roles)
- [ ] Create `InstituteUser` entity (INSTITUTE_ADMIN, INSTITUTE_STAFF roles)
- [ ] Implement `JwtUtil` — generate / validate tokens (include `instituteId` in institute tokens)
- [ ] Implement `JwtAuthenticationFilter`
- [ ] Implement `AdminUserDetailsService` + `InstituteUserDetailsService`
- [ ] Implement `SecurityConfig` with two separate filter chains (or one with role-based paths)
- [ ] Implement `POST /api/auth/admin/login`
- [ ] Implement `POST /api/auth/institute/login`
- [ ] Implement admin user seeder (dev profile only)
- [ ] Configure rate limiting on login endpoints (Spring Security or Bucket4j)

**Tests:**
- [ ] `AuthControllerTest` — valid login returns JWT
- [ ] `AuthControllerTest` — wrong password returns 401
- [ ] `AuthControllerTest` — wrong role returns 403
- [ ] `JwtUtilTest` — generate + validate + extract claims

---

### 1.3 — Frontend Setup (`aicit-frontend`)

**Tasks:**
- [ ] Initialize React 18 + Vite project
- [ ] Install Tailwind CSS v3, configure `tailwind.config.js`
- [ ] Install React Router v6
- [ ] Install Axios
- [ ] Install React Hook Form + Zod
- [ ] Set up project structure:
  - `src/components/layout/` — Navbar, Footer
  - `src/components/ui/` — shared UI components
  - `src/pages/` — public pages
  - `src/pages/admin/` — MCA admin pages
  - `src/pages/institute/` — institute portal pages
  - `src/contexts/` — AuthContext, etc.
  - `src/services/` — API service modules
  - `src/hooks/` — custom hooks
  - `src/utils/` — helpers
  - `src/config/` — constants, site config
- [ ] Set up `.env.example` with `VITE_API_BASE_URL`
- [ ] Create placeholder routes (all render "Coming Soon" or blank)
- [ ] Create shared `ApiError` class and Axios interceptor
- [ ] Verify `npm run build` produces a clean build

---

**Phase 1 Definition of Done:**
- [ ] Backend: `mvn clean verify` passes, app starts, health endpoint returns 200
- [ ] Backend: Login endpoints work with correct credentials
- [ ] Backend: Login rate limiting tested
- [ ] Frontend: `npm run build` succeeds, no errors
- [ ] Frontend: Routes render without crashing
- [ ] Neither MCA repo has been touched

---

## Phase 2 — Institute Management
**Goal:** MCA Admin can view, approve, reject, and manage institutes. Institutes can self-register via the public form.

### 2.1 — Backend: Institute Entities & APIs

**Tasks:**
- [ ] Create `Institute` entity and repository
- [ ] DB migration `V5__create_institutes.sql` (finalize schema)
- [ ] Create `InstituteApplicationRequest` DTO (public registration form)
- [ ] Implement `POST /api/public/institutes/register`
  - Validate all required fields
  - Default status: `PENDING_REVIEW`
  - Send acknowledgment (log only in Phase 1; email in Phase 3)
- [ ] Implement `GET /api/admin/institutes` (paginated, filterable by status)
- [ ] Implement `GET /api/admin/institutes/{id}`
- [ ] Implement `POST /api/admin/institutes/{id}/approve`
  - Create `InstituteUser` with `INSTITUTE_ADMIN` role
  - Generate temporary password
  - Log to audit_logs
- [ ] Implement `POST /api/admin/institutes/{id}/reject` (with reason)
- [ ] Implement `POST /api/admin/institutes/{id}/suspend` (with reason)
- [ ] Implement `POST /api/admin/institutes/{id}/activate`
- [ ] Implement `POST /api/admin/institutes/{id}/deactivate`
- [ ] DB migration `V6__create_audit_logs.sql`
- [ ] Implement `AuditLogService` — log all admin actions

**Tests:**
- [ ] Institute registration creates a PENDING_REVIEW record
- [ ] Approve creates institute user with hashed temp password
- [ ] Reject stores reason
- [ ] Institute admin cannot approve/reject (403)
- [ ] Audit log entry created for each state change

---

### 2.2 — Frontend: Admin Institute Management

**Tasks:**
- [ ] Admin login page (`/admin/login`)
- [ ] Admin auth context + protected route wrapper
- [ ] Admin layout component (sidebar, topbar)
- [ ] Admin dashboard — placeholder stats cards
- [ ] Institute list page — paginated table, status filter
- [ ] Institute detail page — view full application
- [ ] Approve / Reject / Suspend / Activate action buttons with confirm dialogs
- [ ] Toast notification component

---

**Phase 2 Definition of Done:**
- [ ] Public registration form submits successfully
- [ ] MCA Admin can log in and see institute applications
- [ ] All institute status transitions work via UI
- [ ] All transitions are audit-logged
- [ ] Cross-institute security tests pass

---

## Phase 3 — Student Management
**Goal:** Approved institutes can add and manage their own students. MCA Admin can view all students across the platform.

### 3.1 — Backend: Students

**Tasks:**
- [ ] Create `Student` entity and repository
- [ ] Create `Enrollment` entity and repository
- [ ] DB migrations `V7__create_students.sql`, `V8__create_enrollments.sql`
- [ ] Implement institute-level data fence in `StudentService`
  - Every query includes `WHERE institute_id = :authenticatedInstituteId`
  - JWT provides `instituteId` claim
- [ ] Implement `GET /api/institute/students`
- [ ] Implement `POST /api/institute/students` (with photo upload multipart)
- [ ] Implement `GET /api/institute/students/{id}` (fence verified)
- [ ] Implement `PUT /api/institute/students/{id}` (fence verified)
- [ ] Implement `DELETE /api/institute/students/{id}` (INSTITUTE_ADMIN only)
- [ ] Implement `GET /api/admin/students` (all institutes, filterable)
- [ ] Implement `GET /api/admin/students/{id}`

**Tests:**
- [ ] Institute A students not visible to Institute B (data isolation test — critical)
- [ ] Institute user cannot access students of other institute by ID manipulation
- [ ] INSTITUTE_STAFF cannot delete students (403)
- [ ] Admin can see all students

---

### 3.2 — Frontend: Student Management

**Tasks:**
- [ ] Institute login page (`/institute/login`)
- [ ] Institute auth context + protected route wrapper
- [ ] Institute layout component (sidebar)
- [ ] Institute dashboard — student count, pending certs
- [ ] Student list page (searchable, paginated)
- [ ] Add student form — all fields, photo upload
- [ ] Student detail page
- [ ] Edit student form

---

**Phase 3 Definition of Done:**
- [ ] Institute can add, view, edit students
- [ ] Cross-institute data isolation verified by automated tests
- [ ] Admin can view all students across platform
- [ ] Student photos stored and displayed correctly
- [ ] All CRUD operations work end-to-end

---

## Phase 4 — Certificate System
**Goal:** Full certificate lifecycle — request, approve, generate PDF with QR code, download.

### 4.1 — Backend: Certificate Engine

**Tasks:**
- [ ] Create `Certificate` entity and repository
- [ ] Create `CertificateVerificationLog` entity and repository
- [ ] DB migrations `V9__create_certificates.sql`, `V10__create_verification_logs.sql`
- [ ] Implement certificate number generation service
  - Format: `AICIT-{YEAR}-{6-DIGIT}`
  - Uses DB sequence; year-prefixed; guaranteed unique
- [ ] Implement `POST /api/institute/certificates/request`
- [ ] Implement `GET /api/institute/certificates`
- [ ] Implement `GET /api/admin/certificates` (all, filterable by status)
- [ ] Implement `POST /api/admin/certificates/{id}/approve`
  - Set status = APPROVED
  - Trigger PDF generation
  - Store PDF bytes in DB
  - Set status = ISSUED
  - Log to audit_logs
- [ ] Implement `POST /api/admin/certificates/{id}/reject`
- [ ] Implement `POST /api/admin/certificates/{id}/revoke`
- [ ] Implement `GET /api/institute/certificates/{id}/download` — return PDF
- [ ] Implement `GET /api/public/certificates/verify/{number}`
  - Returns safe public fields only
  - Logs verification attempt
- [ ] Implement PDF generation service
  - Apache PDFBox or iText 7
  - Template with: AICIT header, student info, course, grade, dates, certificate number, institute, QR code
- [ ] Implement QR code generation (ZXing)
  - Encodes: `https://aicit.org/verify/{certificateNumber}`
  - Embedded in PDF

**Tests:**
- [ ] Certificate number is unique, in correct format, year-based
- [ ] Institute cannot download another institute's certificate
- [ ] Public verify returns correct fields, no PII
- [ ] Public verify logs the attempt
- [ ] REVOKED certificate shows REVOKED status on public verify
- [ ] NOT_FOUND returns 404

---

### 4.2 — Frontend: Certificate UI

**Tasks:**
- [ ] Certificate request form (institute side)
- [ ] Certificate list — filterable by status
- [ ] Certificate detail page
- [ ] Download certificate button (PDF download)
- [ ] Admin certificate queue page (REQUESTED status)
- [ ] Admin approve/reject workflow with confirm dialog
- [ ] Admin certificate detail — preview, revoke option
- [ ] Public certificate verification page
  - Input field for certificate number
  - Verification result card (success / revoked / not found)
  - QR scan hint

---

**Phase 4 Definition of Done:**
- [ ] Full certificate lifecycle works end-to-end
- [ ] PDF generates correctly with all fields
- [ ] QR code in PDF is scannable and points to correct URL
- [ ] Public verification works and logs every attempt
- [ ] Cross-institute certificate isolation verified
- [ ] Certificate number uniqueness enforced

---

## Phase 5 — Public Website
**Goal:** Professional, institutional-looking public website for AICIT.

### 5.1 — Frontend: Public Website

**Tasks:**
- [ ] Design token setup (colors, fonts, spacing) in Tailwind config
  - Primary: institutional blue / navy
  - Secondary: gold / amber accent
  - Professional, trustworthy institutional look
- [ ] Shared components:
  - `Navbar` — logo, nav links, Login button
  - `Footer` — links, contact, social
  - `SectionHeading`, `SectionWrapper`
  - `Button`, `Card`, `Badge` UI primitives
- [ ] Home page:
  - Hero section — AICIT mission statement, CTA to register institute and verify certificate
  - Stats section — institutes, students, certificates issued (fetched from API)
  - How it works section (3-step flow)
  - Featured courses section
  - Partners/institutes section
  - Certificate verification widget
  - Contact CTA
- [ ] About page — mission, vision, who operates AICIT, legal status note
- [ ] Courses page — paginated grid from `GET /api/public/courses`
- [ ] Institutes page — "Become a Partner" info + registration link
- [ ] Register Institute page — full multi-step form
- [ ] Certificate Verification page — standalone verify tool
- [ ] Contact page
- [ ] `/terms`, `/privacy` — placeholder pages with "Content pending legal review"

---

**Phase 5 Definition of Done:**
- [ ] All public pages render correctly and are responsive
- [ ] Certificate verification works from public page
- [ ] Institute registration form submits successfully
- [ ] All pages pass basic accessibility checks (keyboard nav, ARIA labels)
- [ ] `npm run build` produces clean production build

---

## Phase 6 — Full MCA Admin Portal
**Goal:** Complete MCA Admin dashboard with all management features.

**Tasks:**
- [ ] Admin dashboard — real stats from API (institutes, students, certs, verifications)
- [ ] Institute list with advanced filters and pagination
- [ ] Institute detail — full view with tabs (Info, Students, Certificates, Activity, Subscription)
- [ ] Student browser — platform-wide search
- [ ] Certificate queue — approve/reject workflow
- [ ] Certificate list with filters
- [ ] Course management — add, edit, activate/deactivate courses
- [ ] Audit log viewer — filterable by actor, action, date range
- [ ] Admin user management (SUPER_ADMIN only) — add/disable MCA_ADMIN accounts
- [ ] Reports page — charts for monthly certs issued, top institutes, verification trends
- [ ] Subscription management — view/extend/create subscriptions

---

## Phase 7 — Full Institute Portal
**Goal:** Complete, polished institute portal.

**Tasks:**
- [ ] Institute dashboard — own stats, quick actions
- [ ] Student management — all CRUD, search, photo upload
- [ ] Certificate management — request, track status, download
- [ ] Profile page — view/edit own institute details
- [ ] Subscription status page
- [ ] Support page (contact MCA)
- [ ] Staff management — INSTITUTE_ADMIN can add INSTITUTE_STAFF accounts

---

## Phase 8 — Security Hardening & Testing
**Goal:** Production-ready security posture. All tests passing.

**Tasks:**

### Backend Testing
- [ ] Unit tests: every service class
- [ ] Integration tests: every controller endpoint
- [ ] Security tests: role-based access (each role tested for each endpoint)
- [ ] Data isolation tests: cross-institute access attempts return 403
- [ ] Rate limit tests: login lockout behavior
- [ ] Certificate uniqueness tests
- [ ] All tests pass: `mvn clean verify`

### Frontend
- [ ] All routes have working auth guards
- [ ] Loading states on all async operations
- [ ] Error states on all API calls
- [ ] Empty states (no students, no certs)
- [ ] Form validation messages shown correctly
- [ ] `npm run build` clean

### Security Audit
- [ ] Review all API endpoints — confirm every protected endpoint checks role
- [ ] Confirm institute_id always comes from JWT, never from request body for access control
- [ ] Review CORS configuration
- [ ] Review JWT secret strength (256-bit minimum)
- [ ] Review password policy
- [ ] Review error messages — no internal details leaked
- [ ] Check `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security` headers
- [ ] Check file upload handling — type and size validated

---

## Phase 9 — Deployment & Launch
**Goal:** AICIT running in production, stable, monitored.

**Tasks:**
- [ ] Create production `.env` template (no actual values)
- [ ] Configure Render/Railway service for `aicit-backend`
- [ ] Configure Netlify/Vercel for `aicit-frontend`
- [ ] Provision separate Neon PostgreSQL project for AICIT
- [ ] Run production DB migrations
- [ ] Configure production environment variables
- [ ] Verify health endpoint in production
- [ ] Smoke test: login, add institute, add student, verify certificate
- [ ] Confirm MCA system still running independently (no disruption)
- [ ] Write `README.md` for both repos
- [ ] Write deployment runbook

---

## Development Rules

### Code Quality
- All controller methods must have `@PreAuthorize` annotations
- All request DTOs must have `@Valid` + validation annotations
- All service methods with DB access must include institute_id fence (where applicable)
- No hardcoded secrets anywhere
- No `.env` files committed
- Passwords never returned in any API response
- Test file for every new service class

### Git Workflow
- `main` — protected; production-ready only
- `develop` — integration branch
- `feature/{phase}-{description}` — feature branches
- PR required to merge into `main`
- Never push directly to `main`

### Never Touch
- `Master-Computers` repository
- `Master-Computer-Backend-` repository
- MCA's Neon database
- MCA's production environment variables

---

## Tech Debt to Track

| Item | Priority | Phase to Address |
|---|---|---|
| Aadhaar number encryption at rest | High | Phase 8 |
| PDF storage migration from DB → S3/Cloudflare R2 | Medium | Phase 9 |
| JWT refresh token implementation | Medium | Phase 8 |
| Email notifications (approval, rejection, cert ready) | Medium | Phase 6 |
| Razorpay payment integration | Low | Phase 10 (future) |
| QR code scan analytics | Low | Phase 10 (future) |
| Mobile app | Low | Future |

---

*Document maintained in: `aicit-frontend/docs/AICIT-PROJECT-PLAN.md`*
*Last updated: October 2026*
