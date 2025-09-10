# Firebase Database Setup Guide

## Prerequisites

1. **Firebase CLI**: Install Firebase CLI globally
   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase Project**: Make sure you have a Firebase project set up at [Firebase Console](https://console.firebase.google.com/)

## Setup Steps

### 1. Login to Firebase
```bash
npm run firebase:login
```

### 2. Initialize Firebase (if not already done)
```bash
npm run firebase:init
```
Select:
- ✅ Firestore
- ✅ Hosting (optional)
- Use existing project: `jokkere-mvp`

### 3. Deploy Database Configuration

Deploy security rules:
```bash
npm run firebase:deploy:rules
```

Deploy database indexes:
```bash
npm run firebase:deploy:indexes
```

Or deploy everything at once:
```bash
npm run firebase:deploy
```

### 4. Initialize Database with Sample Data (Optional)

First, you'll need to create a service account key:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`jokkere-mvp`)
3. Go to Project Settings → Service Accounts
4. Click "Generate new private key"
5. Save the JSON file as `firebase-service-account.json` in your project root
6. Add `firebase-service-account.json` to your `.gitignore`

Then run:
```bash
npm run db:init
```

## Database Structure

Your Firebase database now includes:

### Collections:
- **users** - User accounts and preferences
- **teamGroups** - Team organization
- **projects** - Project management
- **tickets** - Task management (Kanban)
- **notifications** - User notifications
- **comments** - Ticket comments

### Security Rules:
- ✅ Authentication required for all operations
- ✅ Users can only access their own data
- ✅ Project members can access project data
- ✅ Team members can access team data

### Indexes:
- ✅ Optimized for common queries
- ✅ Supports array-contains operations
- ✅ Efficient sorting and filtering

## Testing Your Setup

1. **Start your app**:
   ```bash
   npm start
   ```

2. **Check Firebase Console**:
   - Go to [Firestore Database](https://console.firebase.google.com/project/jokkere-mvp/firestore)
   - Verify collections are created
   - Check security rules are active

3. **Test Authentication**:
   - Try logging in/registering
   - Verify user data is created in `users` collection

4. **Test Project Creation**:
   - Create a new project
   - Verify it appears in `projects` collection
   - Check security rules are working

## Troubleshooting

### Common Issues:

1. **Permission Denied**:
   - Check if user is authenticated
   - Verify security rules are deployed
   - Ensure user has proper permissions

2. **Index Errors**:
   - Wait for indexes to build (can take a few minutes)
   - Check Firebase Console for index status

3. **Connection Issues**:
   - Verify Firebase config in `src/services/firebase.ts`
   - Check network connectivity
   - Review error logs in console

### Getting Help:

- Check the [database schema documentation](docs/database-schema.md)
- Review Firebase Console logs
- Check your app's console for error messages

## Next Steps

Once your database is set up:

1. **Test all features** in your app
2. **Create sample projects** and tickets
3. **Invite team members** to test collaboration
4. **Monitor usage** in Firebase Console
5. **Set up monitoring** and alerts if needed

Your Jokkere app is now ready with a fully configured Firebase database! 🎉
