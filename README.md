# QR SaaS Platform Development Plan

## Project Overview

Build a SaaS QR management platform similar to QRFY with the following capabilities:

- Multi-tenant workspaces
- Team management and roles
- Dynamic QR code generation
- QR scan tracking and analytics
- Custom QR designs
- Subscription and billing
- API access
- White-label support

---

# Architecture

## Backend

Technology stack:

- Node.js
- TypeScript
- Express/Fastify/NestJS
- Prisma ORM
- PostgreSQL
- Redis (caching, queues, rate limiting)
- JWT Authentication
- Cloud storage (S3, Cloudflare R2, etc.)
- Queue workers for analytics and emails

---

# Backend Modules

## 1. Authentication Module

Base route:

```
/api/v1/auth
```

Endpoints:

```
POST   /register
POST   /login
POST   /logout
POST   /refresh-token
POST   /forgot-password
POST   /reset-password
GET    /me
PATCH  /me
PATCH  /change-password
```

Features:

- Email/password login
- JWT access tokens
- Refresh tokens
- Password reset
- Session management
- Email verification

---

## 2. User Management

Base route:

```
/api/v1/users
```

Super Admin APIs:

```
GET    /
GET    /:id
PATCH  /:id
PATCH  /:id/status
DELETE /:id
```

---

# 3. Workspace Management

Base route:

```
/api/v1/workspaces
```

Endpoints:

```
GET    /
POST   /
GET    /:id
PATCH  /:id
DELETE /:id
```

Workspace settings:

- Name
- Logo
- Slug
- Timezone
- Branding

---

# 4. Team & Permissions

Base route:

```
/api/v1/workspaces/:workspaceId/members
```

Endpoints:

```
GET    /
POST   /invite
PATCH  /:memberId
DELETE /:memberId
```

Roles:

```
SUPER_ADMIN
ADMIN
MEMBER
VIEWER
```

Future:

- Permission-based RBAC

---

# 5. QR Management

Base route:

```
/api/v1/qrs
```

Endpoints:

```
GET    /
POST   /
GET    /:id
PATCH  /:id
DELETE /:id

PATCH  /:id/status
POST   /:id/duplicate
POST   /:id/regenerate-token
```

QR Types:

- URL
- Text
- Email
- Phone
- SMS
- WiFi
- vCard
- File download

Features:

- Dynamic QR
- Expiration
- Scan limits
- Password protection
- Scheduling
- Tags
- Folder organization

---

# 6. QR Redirect Service

Public route:

```
GET /r/:token
```

Flow:

```
Client scans QR
       |
Find QR by token
       |
Validate status
       |
Check expiration
       |
Check scan limit
       |
Capture analytics
       |
Increase scan count
       |
Redirect destination
```

Analytics captured:

- Timestamp
- IP address
- Country
- City
- Device
- Browser
- OS
- Referrer
- Language

Performance considerations:

- Use Redis caching for QR lookup
- Process analytics using queues
- Avoid blocking redirect response

---

# 7. QR Analytics

Base route:

```
/api/v1/qrs/:id/analytics
```

Endpoints:

```
GET /summary
GET /timeline
GET /countries
GET /cities
GET /devices
GET /browsers
GET /os
GET /referrers
GET /export
```

---

# 8. QR Folders

Base route:

```
/api/v1/folders
```

Endpoints:

```
GET    /
POST   /
PATCH  /:id
DELETE /:id
```

---

# 9. QR Design Module

Base route:

```
/api/v1/qrs/:id/design
```

Endpoints:

```
GET    /
PUT    /
DELETE /
```

Customization:

- Colors
- Logo
- Frames
- Shapes
- Eye styles
- Error correction level

---

# 10. File Management

Base route:

```
/api/v1/files
```

Endpoints:

```
POST   /upload
GET    /:id
DELETE /:id
```

Uses:

- QR logos
- Documents
- Images
- PDF downloads

---

# 11. Subscription & Billing

Public:

```
/api/v1/plans
```

```
GET /
```

Subscriptions:

```
/api/v1/subscriptions
```

Endpoints:

```
GET  /current
POST /checkout
POST /cancel
GET  /history
```

Features:

- Free plan
- Pro plan
- Enterprise plan
- Usage limits
- Payment history

---

# 12. API Keys

Base route:

```
/api/v1/api-keys
```

Endpoints:

```
GET    /
POST   /
DELETE /:id
```

Features:

- Secret key generation
- Scopes
- Usage tracking
- Expiration

---

# 13. Audit Logs

Base route:

```
/api/v1/audit-logs
```

Endpoints:

```
GET /
GET /:id
```

Track:

- User actions
- QR changes
- Permission changes
- Billing changes

---

# 14. Admin System APIs

Base route:

```
/api/v1/admin
```

Dashboard:

```
GET /dashboard
```

Management:

```
GET /users
GET /workspaces
GET /subscriptions
GET /qrs
GET /analytics
GET /system-health
```

---

# Frontend Application

## Public Website

Pages:

```
/
Pricing
Features
About
Contact
Blog
Login
Register
Forgot Password
Reset Password
```

---

# User Dashboard

Layout:

```
Dashboard
├── Overview
├── QR Codes
│   ├── List
│   ├── Create
│   ├── Edit
│   └── Analytics
├── Folders
├── Team Members
├── API Keys
├── Billing
├── Settings
└── Profile
```

---

# QR Creation Flow

Pages:

```
/dashboard/qrs/create
```

Steps:

```
1. Select QR Type
2. Enter Content
3. Configure Dynamic Options
4. Customize Design
5. Preview QR
6. Save & Download
```

---

# QR Listing Page

Features:

- Search
- Filters
- Pagination
- Sort by date/scans
- Bulk delete
- Bulk export
- Duplicate QR
- Pause/activate QR

---

# Analytics Dashboard

Widgets:

- Total scans
- Scans today
- Scan trends
- Countries map
- Device statistics
- Browser statistics
- Top performing QR codes

---

# Team Management UI

Pages:

```
/dashboard/settings/team
```

Features:

- Invite users
- Change roles
- Remove members
- View activity

---

# Billing Pages

Routes:

```
/dashboard/billing
/dashboard/billing/history
```

Features:

- Current plan
- Upgrade plan
- Payment methods
- Invoices
- Usage limits

---

# Super Admin Panel

Routes:

```
/admin
```

Modules:

```
Dashboard
Users
Workspaces
QR Codes
Subscriptions
Plans
Reports
System Settings
Audit Logs
```

---

# QR Redirect Frontend Pages

## Redirect Loading Page

Route:

```
/r/:token
```

UI:

```
Loading QR...

Please wait while we redirect you.
```

Tasks:

- Validate token
- Record scan event
- Redirect user

---

## Error Pages

Examples:

```
QR Not Found
QR Disabled
QR Expired
Scan Limit Reached
Password Protected QR
```

---

# Background Jobs

Workers:

```
Analytics Worker
Email Worker
Subscription Worker
File Cleanup Worker
Report Generator
```

---

# Security Checklist

- Password hashing
- JWT authentication
- Refresh token rotation
- Rate limiting
- CORS protection
- Input validation
- SQL injection protection
- File upload validation
- Role-based authorization
- Audit logging

---

# Development Roadmap

## Phase 1 — MVP

Build:

- Authentication
- Workspace system
- Team roles
- QR CRUD
- QR redirect
- Basic analytics
- Dashboard

---

## Phase 2 — Commercial Features

Build:

- QR customization
- File QR
- Advanced analytics
- Exports
- API keys
- Email notifications

---

## Phase 3 — Monetization

Build:

- Plans
- Subscriptions
- Payment gateway
- Usage limits
- Billing dashboard

---

## Phase 4 — Enterprise

Build:

- SSO
- Custom domains
- White-label branding
- Advanced permissions
- Webhooks
- SLA monitoring

---

# Initial Development Order

Recommended implementation order:

```
Database Schema
        ↓
Seed & Authentication
        ↓
Workspace Management
        ↓
RBAC Middleware
        ↓
QR CRUD
        ↓
QR Redirect Service
        ↓
Analytics Tracking
        ↓
Frontend Dashboard
        ↓
Subscriptions & Payments
        ↓
Advanced Features
```

This plan is designed to take the platform from an MVP to a production-grade QR SaaS capable of supporting thousands of organizations and millions of QR scans.
