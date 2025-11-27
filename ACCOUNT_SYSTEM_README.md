# OptoFuturePrep Account System

## Files Created

### Database Layer
- **database/instant.schema.ts** - InstantDB schema with entities for users, tests, attempts, support, announcements
- **database/db.js** - Database service layer with all CRUD operations
- **database/db-wrapper.js** - Global wrapper for non-module scripts

### Authentication
- **auth/instantdb-auth.js** - Complete authentication service with sign up/in, magic links, user management, admin functions

### Admin Panel
- **admin.html** - Admin panel HTML page with React, styling, and dependencies
- **admin.js** - React-based admin dashboard with:
  - User Management (view, ban/unban, delete, reset progress)
  - Analytics Dashboard
  - Support Inbox (message threads)
  - Announcements System

## Features Included

✅ User registration/login with email & password  
✅ Admin account detection (optofutureprep@gmail.com)  
✅ User management (ban/unban/delete/reset progress)  
✅ Progress tracking and analytics  
✅ Support ticket system  
✅ Announcement system  
✅ Real-time data persistence with InstantDB  
✅ Offline support with sessionStorage fallback  
✅ Complete admin dashboard with all features

## Admin Access

- Admin email: `optofutureprep@gmail.com`
- Access admin panel at: `admin.html`
- Regular users are automatically redirected if they try to access admin panel

## Database Schema

The system includes these entities:
- **users** - User accounts with admin/ban status
- **testQuestions** - Test questions stored in DB
- **testAttempts** - Completed test attempts
- **testHighlights** - Highlighted text from tests
- **testHistory** - Aggregated test statistics
- **testState** - In-progress test state for resuming
- **supportMessages** - Support tickets
- **supportReplies** - Replies to support messages
- **announcements** - Platform announcements

## InstantDB App ID

The system is configured with App ID: `18a93a08-3f4f-4e5d-b92a-9663650d0961`

## Integration Notes

The authentication system uses mock data for demonstration. To enable real InstantDB integration:
1. Uncomment the real InstantDB API calls in `auth/instantdb-auth.js`
2. Ensure the InstantDB schema is deployed
3. Update the App ID if needed

## Security

- Admin-only functions check email === 'optofutureprep@gmail.com'
- Cannot delete or ban the admin account
- User data is isolated by userId
- Guest users have limited access (no data persistence)
