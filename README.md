# Connect - Job Board Platform

A full-stack job board application built with Laravel 13 and React (Inertia.js), featuring role-based access for candidates, employers, and administrators.

## Tech Stack

- **Backend:** Laravel 13, Fortify (auth), MariaDB
- **Frontend:** React 19, Inertia.js, TypeScript, Tailwind CSS v4
- **Testing:** Pest PHP

## Features

### Candidates

- Browse and search jobs with filters (category, location, salary, experience, date posted)
- Apply to jobs with resume upload
- Save/bookmark jobs for later
- Track applications with status filtering (All, Pending, Shortlisted, Interview, Accepted, Rejected, Archived, Withdrawn)
- Withdraw and re-apply to applications
- Manage candidate profile (bio, skills, experience, avatar, resume)

### Employers

- Dashboard with real-time stats (active jobs, applications)
- Create, edit, close, and reopen job postings
- View and manage applicants with status updates
- Search and browse candidate profiles
- Manage company profile

### Admin

- Dashboard with platform statistics
- Moderate job postings (approve/reject)
- Manage categories
- Manage users (search, filter by role, delete with protection)

## Quick Start

```bash
# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Configure database in .env, then migrate
php artisan migrate

# Build assets and run
npm run build
php artisan serve
```

Or use the built-in dev command:

```bash
composer run dev
```
