# Jokkere Database Schema

## Overview
This document describes the Firestore database structure for the Jokkere project management application.

## Collections

### 1. Users (`users`)
Stores user account information and preferences.

**Schema:**
```typescript
{
  id: string;                    // User ID (same as Firebase Auth UID)
  email: string;                 // User email address
  displayName: string;           // User's display name
  avatar?: string;               // URL to user's avatar image
  createdAt: Timestamp;          // Account creation date
  lastLoginAt: Timestamp;        // Last login timestamp
  preferences?: {                // User preferences
    theme: 'light' | 'dark';
    language: string;
    notifications: boolean;
  };
}
```

**Security Rules:**
- Users can only read/write their own data
- Anyone can create a user document

### 2. Team Groups (`teamGroups`)
Organizes users into teams for project management.

**Schema:**
```typescript
{
  id: string;                    // Group ID
  name: string;                  // Group name
  description: string;           // Group description
  members: string[];             // Array of user IDs
  createdAt: Timestamp;          // Group creation date
  createdBy: string;             // User ID of creator
  color: string;                 // Hex color for UI display
}
```

**Security Rules:**
- Only group members can read/write
- Anyone can create a group

### 3. Projects (`projects`)
Main project entities that contain tickets and team members.

**Schema:**
```typescript
{
  id: string;                    // Project ID
  name: string;                  // Project name
  description: string;           // Project description
  members: string[];             // Array of user IDs
  groupId?: string;              // Optional team group ID
  status: 'active' | 'completed' | 'archived';
  createdAt: Timestamp;          // Project creation date
  updatedAt: Timestamp;          // Last update date
  createdBy: string;             // User ID of creator
  color: string;                 // Hex color for UI display
}
```

**Security Rules:**
- Only project members can read/write
- Anyone can create a project

### 4. Tickets (`tickets`)
Individual tasks within projects, organized in Kanban columns.

**Schema:**
```typescript
{
  id: string;                    // Ticket ID
  title: string;                 // Ticket title
  description: string;           // Detailed description
  projectId: string;             // Parent project ID
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;           // User ID of assignee
  createdBy: string;             // User ID of creator
  createdAt: Timestamp;          // Creation date
  updatedAt: Timestamp;          // Last update date
  dueDate?: Timestamp;           // Optional due date
  tags?: string[];               // Optional tags for categorization
}
```

**Security Rules:**
- Only project members can read/write
- Anyone can create a ticket

### 5. Notifications (`notifications`)
User notifications for various events.

**Schema:**
```typescript
{
  id: string;                    // Notification ID
  userId: string;                // Target user ID
  title: string;                 // Notification title
  message: string;               // Notification message
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;                 // Read status
  createdAt: Timestamp;          // Creation date
  data?: object;                 // Additional data payload
}
```

**Security Rules:**
- Users can only read/write their own notifications
- Anyone can create notifications

### 6. Comments (`comments`)
Comments on tickets for collaboration.

**Schema:**
```typescript
{
  id: string;                    // Comment ID
  ticketId: string;              // Parent ticket ID
  userId: string;                // Comment author ID
  content: string;               // Comment text
  createdAt: Timestamp;          // Creation date
  updatedAt?: Timestamp;         // Last edit date
}
```

**Security Rules:**
- Only project members can read/write
- Anyone can create comments

## Indexes

The following composite indexes are configured for optimal query performance:

1. **Projects by members and creation date**
   - Fields: `members` (array-contains), `createdAt` (desc)

2. **Tickets by project, status, and creation date**
   - Fields: `projectId` (asc), `status` (asc), `createdAt` (desc)

3. **Tickets by project, assignee, and update date**
   - Fields: `projectId` (asc), `assignedTo` (asc), `updatedAt` (desc)

4. **Team groups by members and creation date**
   - Fields: `members` (array-contains), `createdAt` (desc)

5. **Notifications by user, read status, and creation date**
   - Fields: `userId` (asc), `read` (asc), `createdAt` (desc)

6. **Comments by ticket and creation date**
   - Fields: `ticketId` (asc), `createdAt` (asc)

## Security Rules Summary

- **Authentication Required**: All operations require user authentication
- **User Data**: Users can only access their own data
- **Project Data**: Only project members can access project-related data
- **Team Data**: Only team members can access team group data
- **Notifications**: Users can only access their own notifications

## Usage Examples

### Querying User's Projects
```javascript
const projectsQuery = query(
  collection(db, 'projects'),
  where('members', 'array-contains', user.uid)
);
```

### Querying Project Tickets
```javascript
const ticketsQuery = query(
  collection(db, 'tickets'),
  where('projectId', '==', projectId),
  orderBy('createdAt', 'desc')
);
```

### Querying User Notifications
```javascript
const notificationsQuery = query(
  collection(db, 'notifications'),
  where('userId', '==', user.uid),
  where('read', '==', false),
  orderBy('createdAt', 'desc')
);
```

## Deployment

To deploy the database configuration:

```bash
# Deploy security rules
npm run firebase:deploy:rules

# Deploy indexes
npm run firebase:deploy:indexes

# Deploy everything
npm run firebase:deploy
```

## Initialization

To initialize the database with sample data:

```bash
npm run db:init
```

This will create all collections with sample data for testing and development.
