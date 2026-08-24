# ELLY JUNIOR ACADEMY — School Management System

This is Version 1 of a functional school-management interface.

## Current working modules
- Administrator login screen
- Dashboard
- Student registration and search
- Fee payment records
- Assessment/marks entry with automatic rubric
- Staff records
- Library books
- Clubs
- Private administrator notes
- Timetable/report placeholders ready for the next implementation stage
- Browser persistence using localStorage

## Important
This version is intentionally a working prototype for the first build stage. Data is stored in the browser and is NOT suitable for production or multi-device use.

## Production architecture
Recommended:
- Frontend: React/Next.js
- Authentication: Supabase Auth
- Database: Supabase Postgres + Row Level Security
- Storage: Supabase Storage
- Hosting: Vercel
- Backups/audit logs: database policies and scheduled backups

Never put a database service secret/service-role key in browser code.

## Administrator
Initial demo credentials shown on the login screen:
Email: admin@ellyjunior.ac.ke
Password: ChangeMe123!

Change/remove these credentials before production deployment.
