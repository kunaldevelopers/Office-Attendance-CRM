# WhatsApp Group Messaging Setup

## Overview

The WhatsApp web.js bot has been configured to send login/logout messages to a WhatsApp group instead of individual phone numbers.

## Configuration

### Environment Variables

The system uses the following environment variable from `.env`:

```
WHATSAPP_GROUP_ID=120363401797237573@g.us
```

### How It Works

1. **WhatsApp Service Initialization**

   - The WhatsApp client initializes when the server starts
   - It uses `whatsapp-web.js` library with local authentication
   - QR code authentication is required on first setup

2. **Group Messaging**

   - Login/logout messages are sent to the specified WhatsApp group
   - Group ID format: `{group_number}@g.us`
   - Messages include user name, timestamp, and action (login/logout)

3. **Message Format**
   - **Login Message**: `👤 {userName}\n✅ Logged in at: {time}\n📅 Date: {date}`
   - **Logout Message**: `👤 {userName}\n🚫 Logged out at: {time}\n📅 Date: {date}`

## API Endpoints

### Send Login Message

```
POST /api/whatsapp/login
Headers: Authorization: Bearer {jwt_token}
```

### Send Logout Message

```
POST /api/whatsapp/logout
Headers: Authorization: Bearer {jwt_token}
```

## Features

- **Duplicate Prevention**: Users can only send one login and one logout message per day
- **Error Handling**: Proper error responses for various scenarios
- **Authentication**: JWT token required for all requests
- **Logging**: All WhatsApp activities are logged to the database

## Testing

Use the provided test script to verify group messaging:

```bash
node test-group-message.js
```

## Logs Storage

All login/logout activities are stored in the MongoDB database with:

- User ID
- Date
- Login/logout timestamps
- Message sent status flags

## Status Monitoring

Check WhatsApp service status via:

```
GET /health
```

The response includes WhatsApp connection status and readiness state.
