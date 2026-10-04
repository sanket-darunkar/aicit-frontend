# AICIT — All India Computer Institute of Technology
## System Architecture Document

> **Status:** Draft v1.0 — October 2026
> **Author:** Architecture Planning
> **Scope:** Complete system design for the AICIT centralized education & certificate management platform

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Repository Structure](#2-repository-structure)
3. [Technology Stack](#3-technology-stack)
4. [User Roles & Permissions](#4-user-roles--permissions)
5. [System Architecture Diagram](#5-system-architecture-diagram)
6. [Institute Workflow](#6-institute-workflow)
7. [MCA Admin Workflow](#7-mca-admin-workflow)
8. [Student Workflow](#8-student-workflow)
9. [Certificate Lifecycle](#9-certificate-lifecycle)
10. [Database Architecture](#10-database-architecture)
11. [API Module Design](#11-api-module-design)
12. [Authentication & Authorization Flow](#12-authentication--authorization-flow)
13. [Security Model](#13-security-model)
14. [Public Website Pages](#14-public-website-pages)
15. [Frontend Route Architecture](#15-frontend-route-architecture)
16. [Certificate Verification System](#16-certificate-verification-system)
17. [Future: Payment & Subscription Model](#17-future-payment--subscription-model)
18. [Deployment Architecture](#18-deployment-architecture)
19. [MCA Existing System — Isolation Rules](#19-mca-existing-system--isolation-rules)

---

## 1. System Overview

AICIT (All India Computer Institute of Technology) is a centralized, multi-tenant education and certificate management platform operated by **Master Computer Academy (MCA)**.

The platform serves three distinct audiences:

| Audience | Access | Purpose |
|---|---|---|
| General Public | Public website, no login | Browse courses, verify certificates |
| Approved Institutes | Institute portal (login required) | Manage students, request and download certificates |
| MCA Admins | MCA Admin portal (login required) | Manage institutes, approve/reject applications, control certificates, view reports |

**Core promise:** An institute approved by MCA can log in to AICIT, add their students, submit certificate requests, and download issued certificates. Students and employers can then verify any AICIT certificate publicly by certificate number.

---

## 2. Repository Structure

```
GitHub Repositories
├── sanket-darunkar/Master-Computers          ← MCA Public Website (React + Vite + Tailwind)
│   DO NOT MODIFY — existing production system
│
├── sanket-darunkar/Master-Computer-Backend-  ← MCA Backend API (Spring Boot + PostgreSQL/Neon)
│   DO NOT MODIFY — existing production system
│
├── sanket-darunkar/aicit-frontend            ← AICIT Frontend (NEW — React + Vite + Tailwind)
│   └── docs/                                 ← Architecture, project plan, legal docs
│
└── sanket-darunkar/aicit-backend             ← AICIT Backend (NEW — Spring Boot + PostgreSQL)
```

### Separation Principle

AICIT is a **completely independent system** from the existing MCA application:

- Separate Git repositories
- Separate Spring Boot applications
- Separate PostgreSQL databases
- Separate JWT secrets and configurations
- Separate deployment instances
- No shared tables, no shared API calls between MCA and AICIT

---

## 3. Technology Stack

### AICIT Frontend (`aicit-frontend`)
| Layer | Choice | Reason |
|---|---|---|
| Framework | React 18 | Same as MCA frontend; team familiarity |
| Build Tool | Vite | Fast dev server, modern bundling |
| Styling | Tailwind CSS v3 | Consistent with MCA; rapid institutional UI |
| Routing | React Router v6 | Proper multi-page SPA routing (upgrade from MCA's custom router) |
| HTTP Client | Axios | Interceptor support for JWT refresh handling |
| State Management | React Context + useReducer | Avoid overengineering for Phase 1 |
| Form Validation | React Hook Form + Zod | Type-safe validation |
| PDF Rendering | react-pdf / @react-pdf/renderer | Certificate PDF generation in browser |
| QR Code | qrcode.react | QR code display and generation |

### AICIT Backend (`aicit-backend`)
| Layer | Choice | Reason |
|---|---|---|
| Framework | Spring Boot 3.2.x | Same as MCA backend; proven |
| Language | Java 17 | LTS, modern features |
| Database | PostgreSQL | Same driver/dialect as MCA; isolated DB |
| ORM | Spring Data JPA + Hibernate | Consistent with MCA backend |
| Security | Spring Security 6 | RBAC, JWT filter chain |
| JWT | jjwt 0.12.x | Same library as MCA; stateless auth |
| Password Hashing | BCrypt (cost 12) | Same as MCA; industry standard |
| Validation | Spring Validation (Jakarta) | DTO-level input validation |
| PDF Generation | Apache PDFBox or iText 7 | Server-side certificate PDF generation |
| QR Code | ZXing (zxing-core) | QR code generation for certificates |
| File Storage | DB (BYTEA) Phase 1; S3/R2 Phase 2 | Simple start; cloud storage later |
| API Docs | SpringDoc OpenAPI 2.x | Swagger UI for development |
| Testing | JUnit 5 + Mockito + Spring Test + H2 | Same as MCA backend |

---

## 4. User Roles & Permissions

### Role Hierarchy

```
SUPER_ADMIN
    └── MCA_ADMIN
            └── INSTITUTE_ADMIN
                    └── INSTITUTE_STAFF
```

### Role Definitions

#### `SUPER_ADMIN`
- Top-level system owner (reserved for the primary MCA developer/owner)
- Can create and manage MCA_ADMIN accounts
- Has all permissions of all roles below
- Only 1–2 accounts; never exposed in UI as a general admin role

#### `MCA_ADMIN`
- MCA staff operating the AICIT platform
- Can approve/reject/suspend/activate institutes
- Can view all institutes, all students, all certificates
- Can manage courses, subscriptions, reports, audit logs
- Cannot see institute admin passwords
- Multiple accounts allowed (different MCA staff members)

#### `INSTITUTE_ADMIN`
- Primary account for each approved institute
- Full access to **their own institute data only**
- Can add/edit students, submit certificate requests, download certificates
- Can create INSTITUTE_STAFF accounts for their own institute
- Cannot see any other institute's data

#### `INSTITUTE_STAFF`
- Additional staff of an approved institute
- Limited permissions defined by INSTITUTE_ADMIN
- Typically: add students, view students, submit certificate requests
- Cannot change institute settings or subscription

### Permission Matrix

| Action | SUPER_ADMIN | MCA_ADMIN | INSTITUTE_ADMIN | INSTITUTE_STAFF |
|---|:---:|:---:|:---:|:---:|
| Create MCA_ADMIN accounts | ✅ | ❌ | ❌ | ❌ |
| View all institutes | ✅ | ✅ | ❌ | ❌ |
| Approve/Reject institute | ✅ | ✅ | ❌ | ❌ |
| Suspend/Activate institute | ✅ | ✅ | ❌ | ❌ |
| View all students (platform-wide) | ✅ | ✅ | ❌ | ❌ |
| View own institute students | ✅ | ✅ | ✅ | ✅ |
| Add students | ✅ | ✅ | ✅ | ✅ |
| Edit own institute students | ✅ | ✅ | ✅ | ✅* |
| Submit certificate request | ✅ | ✅ | ✅ | ✅ |
| Approve certificate | ✅ | ✅ | ❌ | ❌ |
| Download certificate PDF | ✅ | ✅ | ✅ | ✅ |
| Manage courses | ✅ | ✅ | ❌ | ❌ |
| View audit logs (platform) | ✅ | ✅ | ❌ | ❌ |
| View own institute audit | ✅ | ✅ | ✅ | ❌ |
| Manage subscriptions | ✅ | ✅ | ❌ | ❌ |
| View own subscription status | ✅ | ✅ | ✅ | ✅ |
| Public certificate verification | PUBLIC | PUBLIC | PUBLIC | PUBLIC |

*INSTITUTE_STAFF edit permissions scoped further by INSTITUTE_ADMIN configuration

---

## 5. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        INTERNET / PUBLIC                            │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
              ┌────────────────▼────────────────┐
              │       AICIT Frontend             │
              │   React 18 + Vite + Tailwind     │
              │   (aicit-frontend repo)          │
              │                                  │
              │  ┌──────────────────────────┐    │
              │  │  Public Website          │    │
              │  │  Home / About / Courses  │    │
              │  │  Certificate Verify      │    │
              │  │  Institute Registration  │    │
              │  └──────────────────────────┘    │
              │                                  │
              │  ┌──────────────────────────┐    │
              │  │  Institute Portal        │    │
              │  │  /institute/*            │    │
              │  └──────────────────────────┘    │
              │                                  │
              │  ┌──────────────────────────┐    │
              │  │  MCA Admin Portal        │    │
              │  │  /admin/*                │    │
              │  └──────────────────────────┘    │
              └────────────────┬────────────────┘
                               │ REST API (HTTPS + JWT)
              ┌────────────────▼────────────────┐
              │       AICIT Backend              │
              │   Spring Boot 3.2 + Java 17      │
              │   (aicit-backend repo)           │
              │                                  │
              │  Controllers → Services          │
              │  → Repositories → JPA Entities   │
              │                                  │
              │  Security: Spring Security 6     │
              │  + JWT Filter + RBAC             │
              │  + Institute-level data fence    │
              └────────────────┬────────────────┘
                               │ JDBC (SSL)
              ┌────────────────▼────────────────┐
              │    AICIT PostgreSQL Database     │
              │    (Neon / Railway / Supabase)   │
              │    COMPLETELY SEPARATE from MCA  │
              └─────────────────────────────────┘

              ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
              EXISTING MCA SYSTEM (DO NOT TOUCH)
              ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─

              ┌──────────────────────────────┐
              │  Master-Computers (Frontend) │    ← production, no changes
              └──────────────────────────────┘
              ┌──────────────────────────────┐
              │  Master-Computer-Backend-    │    ← production, no changes
              └──────────────────────────────┘
              ┌──────────────────────────────┐
              │  MCA PostgreSQL (Neon)       │    ← production DB, no changes
              └──────────────────────────────┘
```

---

## 6. Institute Workflow

### 6.1 Registration & Approval

```
1. Institute visits AICIT public website
2. Clicks "Register Your Institute" / "Become a Partner"
3. Fills Institute Registration Form:
   - Institute name, type, address
   - Contact person name, email, mobile
   - Documents upload (registration certificate, etc.)
   - Courses offered
4. Form submitted → status = PENDING_REVIEW
5. MCA Admin receives notification
6. MCA Admin reviews application in admin portal
7. Decision:
   ├─ APPROVED → institute account created, login credentials emailed
   └─ REJECTED → rejection reason stored, institute notified
```

### 6.2 Active Institute Operations

```
1. Institute logs in with provided credentials
2. Institute Dashboard shows:
   - Total students, pending certificates, recent activity
   - Subscription status, upcoming renewal
3. Add Student:
   - Fill student details form
   - Upload student photo (optional)
   - Select course(s)
   - Submit → student status = ACTIVE
4. Submit Certificate Request:
   - Select student
   - Select course for which certificate needed
   - Submit request → certificate status = REQUESTED
5. MCA processes certificate:
   - Reviews request
   - Approves → certificate generated → status = ISSUED
   - Rejects → reason stored → status = REJECTED
6. Institute downloads certificate PDF
7. Institute gives PDF to student
8. Student/employer can verify via public website
```

### 6.3 Institute Status States

```
PENDING_REVIEW → APPROVED → ACTIVE
                          → SUSPENDED
                          → DEACTIVATED
              → REJECTED
```

| Status | Login Allowed | Students Visible | Certs Available |
|---|:---:|:---:|:---:|
| PENDING_REVIEW | ❌ | ❌ | ❌ |
| APPROVED | ✅ | ✅ | ✅ |
| SUSPENDED | ❌ | ❌ (read-only via admin) | ❌ |
| DEACTIVATED | ❌ | ❌ | ❌ |
| REJECTED | ❌ | ❌ | ❌ |

---

## 7. MCA Admin Workflow

```
MCA Admin Login → Admin Dashboard

Dashboard shows:
  - Pending institute applications count
  - Total active institutes
  - Total students across platform
  - Total certificates issued this month
  - Recent activity feed

Institutes Management:
  - View pending applications → approve / reject with reason
  - View all institutes → filter by status
  - Click institute → view full details, students, certificates, activity
  - Actions: Approve | Reject | Activate | Suspend | Deactivate | Reset Login

Students (Platform-wide):
  - View all students across all institutes
  - Search by name, student ID, institute, course
  - View individual student detail

Certificates:
  - View all certificate requests (REQUESTED status)
  - Approve → trigger PDF generation → status = ISSUED
  - Reject → provide reason → status = REJECTED
  - View all issued certificates
  - Revoke a certificate

Courses:
  - Add / edit / deactivate courses
  - Courses available to all institutes when adding students

Reports:
  - Certificates issued per month
  - Students per institute
  - Verification activity

Audit Logs:
  - All admin actions logged: who did what, when, on which entity

Admin Users:
  - SUPER_ADMIN: create/manage MCA_ADMIN accounts
  - MCA_ADMIN: view only their own account settings
```

---

## 8. Student Workflow

```
1. Student enrolls at an approved AICIT institute
2. Institute adds student to AICIT platform:
   - Personal details, contact, address
   - Course, admission date, fees
   - Student photo
3. Student completes course at institute
4. Institute submits certificate request for the student
5. MCA Admin reviews and approves certificate
6. AICIT generates:
   - Unique certificate number (AICIT-YYYY-XXXXXX format)
   - Certificate PDF with:
     - Student name, photo
     - Course name, grade, marks
     - Issue date, certificate number
     - Institute name
     - QR code pointing to public verification URL
     - AICIT branding and authorized signatures
7. Institute downloads PDF
8. Institute prints and gives to student

PUBLIC VERIFICATION:
Student/Employer → aicit.org/verify → enter certificate number
  → API returns: student name, course, institute, issue date, status
  → No sensitive PII (address, mobile, aadhaar) exposed
```

---

## 9. Certificate Lifecycle

```
REQUESTED
    │
    ▼
UNDER_REVIEW  ← MCA Admin opens the request
    │
    ├──[APPROVE]──► APPROVED
    │                   │
    │                   ▼
    │               PDF_GENERATED
    │                   │
    │                   ▼
    │               ISSUED  ←─────────────────── downloadable by institute
    │                   │
    │                   └──[REVOKE]──► REVOKED  ← still verifiable but shows REVOKED
    │
    └──[REJECT]──► REJECTED  ← reason stored, institute notified
```

### Certificate Number Format

```
AICIT-{YEAR}-{6-DIGIT-SEQUENTIAL}

Examples:
  AICIT-2026-000001
  AICIT-2026-000002
  AICIT-2027-000001   ← resets per year
```

The number is generated by the backend at approval time using a database sequence. It is stored as a unique, indexed string and is immutable after creation.

### QR Code

Each certificate PDF contains a QR code encoding:
```
https://aicit.org/verify/{certificateNumber}
```

Scanning it takes the verifier directly to the public verification page, which hits:
```
GET /api/public/certificates/verify/{certificateNumber}
```

---

## 10. Database Architecture

> **Critical:** This is a completely separate PostgreSQL database from MCA's Neon database.

### 10.1 Core Tables

#### `institutes`
```sql
id                  BIGSERIAL PRIMARY KEY
name                VARCHAR(255) NOT NULL
institute_code      VARCHAR(50)  UNIQUE NOT NULL   -- system-generated e.g. AICIT-INST-0001
type                VARCHAR(50)                    -- SCHOOL, COLLEGE, TRAINING_CENTER, etc.
address_line1       VARCHAR(255)
address_line2       VARCHAR(255)
city                VARCHAR(100)
district            VARCHAR(100)
state               VARCHAR(100)
pin_code            VARCHAR(10)
contact_person_name VARCHAR(255) NOT NULL
contact_email       VARCHAR(255) NOT NULL
contact_mobile      VARCHAR(15)  NOT NULL
website_url         VARCHAR(500)
status              VARCHAR(30)  NOT NULL DEFAULT 'PENDING_REVIEW'
  -- CHECK: PENDING_REVIEW, APPROVED, SUSPENDED, DEACTIVATED, REJECTED
rejection_reason    VARCHAR(1000)
approved_at         TIMESTAMP
approved_by         BIGINT REFERENCES admin_users(id)
suspended_at        TIMESTAMP
suspended_reason    VARCHAR(500)
subscription_id     BIGINT REFERENCES subscriptions(id)
created_at          TIMESTAMP NOT NULL
updated_at          TIMESTAMP NOT NULL
```

#### `institute_users`
```sql
id              BIGSERIAL PRIMARY KEY
institute_id    BIGINT NOT NULL REFERENCES institutes(id)
email           VARCHAR(255) UNIQUE NOT NULL
password        VARCHAR(255) NOT NULL    -- BCrypt hash
full_name       VARCHAR(255) NOT NULL
mobile          VARCHAR(15)
role            VARCHAR(30)  NOT NULL
  -- CHECK: INSTITUTE_ADMIN, INSTITUTE_STAFF
is_active       BOOLEAN NOT NULL DEFAULT true
last_login_at   TIMESTAMP
created_at      TIMESTAMP NOT NULL
updated_at      TIMESTAMP NOT NULL
```

#### `admin_users`
```sql
id          BIGSERIAL PRIMARY KEY
email       VARCHAR(255) UNIQUE NOT NULL
password    VARCHAR(255) NOT NULL         -- BCrypt hash
full_name   VARCHAR(255) NOT NULL
role        VARCHAR(30)  NOT NULL
  -- CHECK: SUPER_ADMIN, MCA_ADMIN
is_active   BOOLEAN NOT NULL DEFAULT true
last_login_at TIMESTAMP
created_at  TIMESTAMP NOT NULL
updated_at  TIMESTAMP NOT NULL
```

#### `students`
```sql
id                BIGSERIAL PRIMARY KEY
institute_id      BIGINT NOT NULL REFERENCES institutes(id)  -- DATA FENCE
student_id        VARCHAR(50) NOT NULL     -- institute-scoped; e.g. MCA-2026-001
  UNIQUE (institute_id, student_id)        -- unique per institute only
first_name        VARCHAR(100) NOT NULL
middle_name       VARCHAR(100)
surname           VARCHAR(100) NOT NULL
date_of_birth     DATE
gender            VARCHAR(20)
aadhaar_number    VARCHAR(20)             -- sensitive; access-controlled
own_mobile        VARCHAR(15) NOT NULL
address_line1     VARCHAR(255)
city              VARCHAR(100)
district          VARCHAR(100)
state             VARCHAR(100)
pin_code          VARCHAR(10)
qualification     VARCHAR(100)
status            VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
  -- CHECK: ACTIVE, INACTIVE, COMPLETED, DROPPED
photo_data        BYTEA
photo_mime_type   VARCHAR(20)
created_by        BIGINT REFERENCES institute_users(id)
created_at        TIMESTAMP NOT NULL
updated_at        TIMESTAMP NOT NULL
```

#### `courses`
```sql
id              BIGSERIAL PRIMARY KEY
name            VARCHAR(255) NOT NULL
code            VARCHAR(50)  UNIQUE NOT NULL
description     TEXT
duration_months INTEGER
category        VARCHAR(100)
is_active       BOOLEAN NOT NULL DEFAULT true
created_at      TIMESTAMP NOT NULL
updated_at      TIMESTAMP NOT NULL
```

#### `enrollments`
```sql
id              BIGSERIAL PRIMARY KEY
student_id      BIGINT NOT NULL REFERENCES students(id)
course_id       BIGINT NOT NULL REFERENCES courses(id)
institute_id    BIGINT NOT NULL REFERENCES institutes(id)   -- DATA FENCE
admission_date  DATE NOT NULL
batch_time      VARCHAR(50)
total_fees      NUMERIC(10,2)
fees_paid       NUMERIC(10,2)
receipt_number  VARCHAR(50)
receipt_date    DATE
status          VARCHAR(30) NOT NULL DEFAULT 'ENROLLED'
  -- CHECK: ENROLLED, COMPLETED, DROPPED, EXAM_FORM_SUBMITTED
notes           VARCHAR(2000)
created_at      TIMESTAMP NOT NULL
updated_at      TIMESTAMP NOT NULL
UNIQUE (student_id, course_id)
```

#### `certificates`
```sql
id                    BIGSERIAL PRIMARY KEY
certificate_number    VARCHAR(30)  UNIQUE NOT NULL    -- AICIT-2026-000001
institute_id          BIGINT NOT NULL REFERENCES institutes(id)   -- DATA FENCE
student_id            BIGINT NOT NULL REFERENCES students(id)
enrollment_id         BIGINT NOT NULL REFERENCES enrollments(id)
course_id             BIGINT NOT NULL REFERENCES courses(id)
marks                 VARCHAR(20)
grade                 VARCHAR(10)
issue_date            DATE
status                VARCHAR(30) NOT NULL DEFAULT 'REQUESTED'
  -- CHECK: REQUESTED, UNDER_REVIEW, APPROVED, PDF_GENERATED, ISSUED, REJECTED, REVOKED
rejection_reason      VARCHAR(500)
reviewed_by           BIGINT REFERENCES admin_users(id)
reviewed_at           TIMESTAMP
pdf_data              BYTEA                           -- Phase 1: store in DB
pdf_generated_at      TIMESTAMP
qr_code_url           VARCHAR(500)
revoked_at            TIMESTAMP
revoke_reason         VARCHAR(500)
created_at            TIMESTAMP NOT NULL
updated_at            TIMESTAMP NOT NULL
```

#### `certificate_verification_logs`
```sql
id                  BIGSERIAL PRIMARY KEY
certificate_id      BIGINT NOT NULL REFERENCES certificates(id)
certificate_number  VARCHAR(30) NOT NULL    -- denormalized for query speed
verified_at         TIMESTAMP NOT NULL
ip_address          VARCHAR(45)             -- IPv4 or IPv6
user_agent          VARCHAR(500)
result              VARCHAR(20) NOT NULL    -- FOUND, NOT_FOUND, REVOKED
```

#### `subscriptions`
```sql
id              BIGSERIAL PRIMARY KEY
institute_id    BIGINT NOT NULL REFERENCES institutes(id)
plan_name       VARCHAR(100) NOT NULL
plan_type       VARCHAR(50)                 -- MONTHLY, ANNUAL, LIFETIME
start_date      DATE NOT NULL
end_date        DATE
status          VARCHAR(30) NOT NULL DEFAULT 'ACTIVE'
  -- CHECK: ACTIVE, EXPIRED, CANCELLED
max_students    INTEGER
max_certificates INTEGER
created_at      TIMESTAMP NOT NULL
updated_at      TIMESTAMP NOT NULL
```

#### `payments`
```sql
id                  BIGSERIAL PRIMARY KEY
institute_id        BIGINT NOT NULL REFERENCES institutes(id)
subscription_id     BIGINT REFERENCES subscriptions(id)
amount              NUMERIC(10,2) NOT NULL
currency            VARCHAR(5) NOT NULL DEFAULT 'INR'
payment_method      VARCHAR(50)
payment_reference   VARCHAR(255)             -- gateway transaction ID
status              VARCHAR(30) NOT NULL
  -- CHECK: PENDING, SUCCESS, FAILED, REFUNDED
paid_at             TIMESTAMP
created_at          TIMESTAMP NOT NULL
updated_at          TIMESTAMP NOT NULL
```

#### `audit_logs`
```sql
id              BIGSERIAL PRIMARY KEY
actor_type      VARCHAR(30) NOT NULL    -- ADMIN, INSTITUTE_USER, SYSTEM
actor_id        BIGINT NOT NULL
actor_email     VARCHAR(255)
action          VARCHAR(100) NOT NULL   -- INSTITUTE_APPROVED, CERT_ISSUED, etc.
entity_type     VARCHAR(50)             -- Institute, Student, Certificate, etc.
entity_id       BIGINT
description     VARCHAR(1000)
ip_address      VARCHAR(45)
created_at      TIMESTAMP NOT NULL
```

### 10.2 Key Indexes

```sql
-- Institute lookups
CREATE INDEX idx_institutes_status ON institutes (status);
CREATE INDEX idx_institutes_code   ON institutes (institute_code);

-- Student data fence (most critical index)
CREATE INDEX idx_students_institute ON students (institute_id);
CREATE INDEX idx_students_status    ON students (institute_id, status);

-- Certificate lookups
CREATE UNIQUE INDEX idx_cert_number    ON certificates (certificate_number);
CREATE INDEX idx_cert_institute        ON certificates (institute_id);
CREATE INDEX idx_cert_student          ON certificates (student_id);
CREATE INDEX idx_cert_status           ON certificates (status);

-- Verification logs
CREATE INDEX idx_vlog_cert_id          ON certificate_verification_logs (certificate_id);
CREATE INDEX idx_vlog_cert_number      ON certificate_verification_logs (certificate_number);
CREATE INDEX idx_vlog_verified_at      ON certificate_verification_logs (verified_at);

-- Institute users
CREATE INDEX idx_inst_users_institute  ON institute_users (institute_id);
```

---

## 11. API Module Design

### 11.1 Public APIs (No Authentication)

```
GET  /api/public/health
GET  /api/public/certificates/verify/{certificateNumber}
POST /api/public/institutes/register                     ← institute registration form
GET  /api/public/courses                                 ← list active courses for website
```

### 11.2 Authentication APIs

```
POST /api/auth/admin/login                ← MCA Admin login
POST /api/auth/institute/login            ← Institute login
POST /api/auth/institute/refresh          ← JWT refresh (Phase 2)
POST /api/auth/logout                     ← Invalidate token (Phase 2)
```

### 11.3 MCA Admin APIs (`/api/admin/**`)
*Requires JWT with role SUPER_ADMIN or MCA_ADMIN*

```
--- Institutes ---
GET    /api/admin/institutes                ← list all (paginated, filterable)
GET    /api/admin/institutes/{id}           ← detail
POST   /api/admin/institutes/{id}/approve
POST   /api/admin/institutes/{id}/reject
POST   /api/admin/institutes/{id}/activate
POST   /api/admin/institutes/{id}/suspend
POST   /api/admin/institutes/{id}/deactivate
POST   /api/admin/institutes/{id}/reset-login

--- Students (platform-wide) ---
GET    /api/admin/students                  ← all students, filterable by institute
GET    /api/admin/students/{id}

--- Certificates ---
GET    /api/admin/certificates              ← all, filterable
GET    /api/admin/certificates/{id}
POST   /api/admin/certificates/{id}/approve
POST   /api/admin/certificates/{id}/reject
POST   /api/admin/certificates/{id}/revoke
GET    /api/admin/certificates/{id}/download  ← PDF download

--- Courses ---
GET    /api/admin/courses
POST   /api/admin/courses
PUT    /api/admin/courses/{id}
PATCH  /api/admin/courses/{id}/status

--- Admin Users ---
GET    /api/admin/users                     ← SUPER_ADMIN only
POST   /api/admin/users                     ← SUPER_ADMIN only
PATCH  /api/admin/users/{id}/status         ← SUPER_ADMIN only

--- Subscriptions ---
GET    /api/admin/subscriptions
POST   /api/admin/subscriptions
PUT    /api/admin/subscriptions/{id}

--- Reports ---
GET    /api/admin/reports/certificates-summary
GET    /api/admin/reports/institutes-summary
GET    /api/admin/reports/verification-activity

--- Audit Logs ---
GET    /api/admin/audit-logs               ← filterable by actor, action, date
```

### 11.4 Institute APIs (`/api/institute/**`)
*Requires JWT with role INSTITUTE_ADMIN or INSTITUTE_STAFF*
*ALL queries automatically scoped to the authenticated institute_id*

```
--- Profile ---
GET    /api/institute/profile
PUT    /api/institute/profile

--- Students ---
GET    /api/institute/students             ← own institute only
POST   /api/institute/students
GET    /api/institute/students/{id}
PUT    /api/institute/students/{id}
DELETE /api/institute/students/{id}        ← INSTITUTE_ADMIN only

--- Certificates ---
GET    /api/institute/certificates         ← own institute only
POST   /api/institute/certificates/request ← submit certificate request
GET    /api/institute/certificates/{id}
GET    /api/institute/certificates/{id}/download  ← PDF; ISSUED status only

--- Subscription ---
GET    /api/institute/subscription

--- Dashboard ---
GET    /api/institute/dashboard            ← summary stats
```

### 11.5 Response Format

All endpoints return a consistent envelope:

```json
{
  "success": true,
  "message": "Certificate retrieved",
  "data": { ... },
  "timestamp": "2026-10-01T10:00:00"
}
```

Error responses:
```json
{
  "success": false,
  "message": "Certificate not found",
  "error": "RESOURCE_NOT_FOUND",
  "timestamp": "2026-10-01T10:00:00"
}
```

---

## 12. Authentication & Authorization Flow

### 12.1 Login Flow

```
Client                    Backend                         Database
  │                          │                               │
  │  POST /api/auth/*/login  │                               │
  │  { email, password }     │                               │
  │─────────────────────────►│                               │
  │                          │  SELECT * FROM admin_users    │
  │                          │  WHERE email = ?              │
  │                          │──────────────────────────────►│
  │                          │◄──────────────────────────────│
  │                          │                               │
  │                          │  BCrypt.verify(password, hash)│
  │                          │  (if match, generate JWT)     │
  │                          │                               │
  │  200 { token, role,      │                               │
  │        expiresIn }       │                               │
  │◄─────────────────────────│                               │
  │                          │                               │
  │  Store token in          │                               │
  │  sessionStorage          │                               │
```

### 12.2 Authenticated Request Flow

```
Client                    Backend                         Database
  │                          │                               │
  │  GET /api/institute/students                             │
  │  Authorization: Bearer <jwt>                             │
  │─────────────────────────►│                               │
  │                          │                               │
  │                          │  JwtAuthenticationFilter:     │
  │                          │  1. Extract token             │
  │                          │  2. Validate signature        │
  │                          │  3. Check expiry              │
  │                          │  4. Extract role + institute_id│
  │                          │  5. Set SecurityContext       │
  │                          │                               │
  │                          │  @PreAuthorize check          │
  │                          │                               │
  │                          │  InstituteDataFence:          │
  │                          │  SELECT * FROM students       │
  │                          │  WHERE institute_id = {jwt.instituteId}
  │                          │──────────────────────────────►│
  │                          │◄──────────────────────────────│
  │                          │                               │
  │  200 { students: [...] } │                               │
  │◄─────────────────────────│                               │
```

### 12.3 JWT Token Design

```json
{
  "sub": "admin@institute.com",
  "role": "INSTITUTE_ADMIN",
  "instituteId": 42,
  "instituteName": "ABC Computer Institute",
  "iat": 1727760000,
  "exp": 1727846400
}
```

Admin token (no instituteId):
```json
{
  "sub": "admin@aicit.org",
  "role": "MCA_ADMIN",
  "iat": 1727760000,
  "exp": 1727846400
}
```

### 12.4 Institute Data Fence

Every service method handling institute-scoped data **must** apply the data fence:

```java
// In service layer — enforced at every data access point
Long authenticatedInstituteId = SecurityContextHolder
    .getContext().getAuthentication()  // from JWT claims
    .getInstituteId();

// All queries include WHERE institute_id = :authenticatedInstituteId
studentRepository.findByInstituteId(authenticatedInstituteId, pageable);
```

This is **not** optional. The backend must never trust a client-supplied institute ID.

---

## 13. Security Model

### 13.1 Authentication Security

| Control | Implementation |
|---|---|
| Password hashing | BCrypt cost 12 |
| JWT signing | HMAC-SHA256 with 256-bit key from env var |
| Token storage (frontend) | `sessionStorage` (cleared on tab close) |
| Token expiry | 24 hours (configurable) |
| Rate limiting – login | 5 attempts per 5 minutes per IP |
| Account lockout | After 10 failed attempts, lock for 30 minutes |
| HTTPS | Required in production; HTTP forbidden |

### 13.2 Authorization Security

| Control | Implementation |
|---|---|
| Role check | `@PreAuthorize("hasRole('MCA_ADMIN')")` on every endpoint |
| Data fence | `institute_id` extracted from JWT, injected into every query |
| Frontend route guard | React Router guards (defense-in-depth only; backend is authoritative) |
| Cross-institute test | Integration tests that verify institute A cannot access institute B data |

### 13.3 Input Validation

| Control | Implementation |
|---|---|
| DTO validation | `@Valid` + Jakarta annotations on every request DTO |
| SQL injection | Parameterized queries via JPA / Spring Data |
| File upload | Type check (JPEG/PNG), size limit (2MB), virus scan (Phase 2) |
| Certificate number | Server-generated only; clients cannot supply it |
| Aadhaar numbers | Stored encrypted (Phase 2); access-controlled |

### 13.4 API Security

| Control | Implementation |
|---|---|
| CORS | Whitelist only `AICIT_FRONTEND_URL` env var |
| CSRF | Disabled (stateless JWT API) |
| Security headers | `X-Content-Type-Options`, `X-Frame-Options`, `HSTS` |
| Error responses | Never expose stack traces, SQL, or internal details |
| Sensitive fields | Password never returned in any response |
| Aadhaar in responses | Masked (`XXXX-XXXX-1234`) |

### 13.5 Certificate Security

| Control | Implementation |
|---|---|
| Cert number generation | Server-side sequential + year prefix; unique constraint |
| QR code | Points to AICIT public verification URL |
| PDF integrity | Generated and signed server-side; not editable by institute |
| Revocation | Status field; verified endpoint checks status; REVOKED shown clearly |
| Verification logging | Every public verification attempt logged (IP, timestamp, result) |

### 13.6 Environment & Secrets

```
Never commit to Git:
  .env files
  JWT secrets
  Database passwords
  Any credentials

Required env vars (AICIT Backend):
  AICIT_JWT_SECRET         – Base64-encoded 256-bit key
  AICIT_DB_URL             – PostgreSQL JDBC URL
  AICIT_DB_USERNAME
  AICIT_DB_PASSWORD
  AICIT_FRONTEND_URL       – allowed CORS origin
  AICIT_ADMIN_EMAIL        – seed admin email
  AICIT_ADMIN_PASSWORD     – seed admin password (hashed at startup)
  SPRING_PROFILES_ACTIVE   – dev | prod
```

---

## 14. Public Website Pages

| Page | Route | Description |
|---|---|---|
| Home | `/` | Hero, features, courses overview, stats, CTA |
| About AICIT | `/about` | Mission, vision, MCA as governing body |
| Courses | `/courses` | All approved courses, filterable by category |
| Institutes | `/institutes` | How to become a partner institute |
| Register Institute | `/register-institute` | Online application form |
| Certificate Verification | `/verify` | Public certificate lookup |
| Contact | `/contact` | Contact form + details |
| Login | `/login` | Router to admin or institute login |
| Terms & Conditions | `/terms` | Legal *(content: PENDING)* |
| Privacy Policy | `/privacy` | Privacy notice *(content: PENDING)* |

---

## 15. Frontend Route Architecture

```
/                          Public website (Home)
/about
/courses
/institutes
/register-institute
/verify
/verify/:certificateNumber ← direct QR deep-link
/contact
/terms
/privacy
/login

/institute/login           Institute login
/institute/dashboard       Institute home         ─┐
/institute/students        Student list            │
/institute/students/new    Add student             │  INSTITUTE_ADMIN
/institute/students/:id    Student detail          │  or
/institute/students/:id/edit                       │  INSTITUTE_STAFF
/institute/certificates    Certificate list        │  (route guard)
/institute/certificates/:id                        │
/institute/profile         Institute profile       │
/institute/subscription    Subscription status    ─┘

/admin/login               MCA Admin login
/admin/dashboard           Admin home             ─┐
/admin/institutes          Institute list          │
/admin/institutes/:id      Institute detail        │
/admin/students            All students            │
/admin/certificates        All certificates        │  MCA_ADMIN
/admin/certificates/:id    Certificate detail      │  or
/admin/courses             Course management       │  SUPER_ADMIN
/admin/subscriptions       Subscription mgmt       │  (route guard)
/admin/reports             Reports                 │
/admin/audit-logs          Audit log viewer        │
/admin/users               Admin user mgmt         │  SUPER_ADMIN only
/admin/settings            System settings        ─┘
```

---

## 16. Certificate Verification System

### 16.1 Public Verification Endpoint

```
GET /api/public/certificates/verify/{certificateNumber}

Response (ACTIVE):
{
  "certificateNumber": "AICIT-2026-000001",
  "studentName": "Rahul Sharma",
  "courseName": "Diploma in Computer Application",
  "instituteName": "ABC Computer Institute",
  "issueDate": "2026-03-15",
  "grade": "A+",
  "status": "ACTIVE",
  "verificationTimestamp": "2026-10-01T10:30:00"
}

Response (REVOKED):
{
  "certificateNumber": "AICIT-2026-000002",
  "status": "REVOKED",
  "message": "This certificate has been revoked."
}

Response (NOT FOUND → 404):
{
  "success": false,
  "message": "Certificate not found",
  "error": "RESOURCE_NOT_FOUND"
}
```

### 16.2 What is Exposed vs Protected

| Field | Public Verification | Institute Portal | MCA Admin |
|---|:---:|:---:|:---:|
| Certificate number | ✅ | ✅ | ✅ |
| Student name | ✅ | ✅ | ✅ |
| Course name | ✅ | ✅ | ✅ |
| Institute name | ✅ | ✅ | ✅ |
| Issue date | ✅ | ✅ | ✅ |
| Grade | ✅ | ✅ | ✅ |
| Status | ✅ | ✅ | ✅ |
| Student mobile | ❌ | ✅ | ✅ |
| Aadhaar number | ❌ | Masked | Full |
| Address | ❌ | ✅ | ✅ |
| Fees | ❌ | ✅ | ✅ |
| Certificate PDF | ❌ | ✅ (if ISSUED) | ✅ |

### 16.3 QR Code Flow (Phase 2)

```
Certificate PDF
  └── QR Code image (encoded: https://aicit.org/verify/AICIT-2026-000001)
        │
        ▼
Student/Employer scans with phone
        │
        ▼
Browser opens: https://aicit.org/verify/AICIT-2026-000001
        │
        ▼
AICIT Frontend auto-triggers: GET /api/public/certificates/verify/AICIT-2026-000001
        │
        ▼
Verification result displayed
```

---

## 17. Future: Payment & Subscription Model

> **Phase 3 — Not implemented in Phase 1 or 2**

Planned model:

```
Institute signs up → chooses plan → makes payment → gets activated

Plans (illustrative):
  BASIC    – up to 50 students/year, 50 certificates/year
  STANDARD – up to 200 students/year, 200 certificates/year
  PREMIUM  – unlimited students and certificates

Payment gateway: Razorpay (India-native, UPI/cards/netbanking)

Webhook: Razorpay → AICIT backend → update subscription status

MCA Admin:
  - Can manually activate/extend subscription
  - Override payment for special institutes
  - View payment history per institute
```

---

## 18. Deployment Architecture

### Development

```
AICIT Frontend  → http://localhost:5173 (Vite dev server)
AICIT Backend   → http://localhost:8081 (separate port from MCA's 8080)
AICIT Database  → local PostgreSQL or separate Neon project
```

### Production (Target)

```
AICIT Frontend  → Netlify / Vercel / Cloudflare Pages
AICIT Backend   → Render / Railway (separate service from MCA backend)
AICIT Database  → Neon PostgreSQL (separate project from MCA's DB)

Environment variables: never committed to Git
Secrets management: platform environment variable settings
```

**Port separation (local dev):**
- MCA Backend: `8080` (existing)
- AICIT Backend: `8081` (new)

This prevents conflicts when running both locally.

---

## 19. MCA Existing System — Isolation Rules

These rules **must never be violated** during AICIT development:

1. **Do not modify** `Master-Computers` (MCA frontend) for any AICIT-related change
2. **Do not modify** `Master-Computer-Backend-` (MCA backend) for any AICIT-related change
3. **Do not connect** AICIT backend to MCA's PostgreSQL database
4. **Do not share** JWT secrets between MCA and AICIT
5. **Do not share** CORS origins in a way that weakens either system
6. **Do not import** MCA Java packages into AICIT's codebase
7. **Do not share** admin accounts between the two systems

If a future integration is needed (e.g., MCA admin also acts as AICIT SUPER_ADMIN), it must be designed explicitly with a documented migration plan — not done ad hoc.

---

*Document maintained in: `aicit-frontend/docs/AICIT-ARCHITECTURE.md`*
*Last updated: October 2026*
