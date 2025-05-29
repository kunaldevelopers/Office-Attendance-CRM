# Security Configuration Guide

## Environment Variables

### Backend (.env)

Create a `.env` file in the `backend` directory with the following variables:

```bash
# Server Configuration
PORT=3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/login-logout-app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# WhatsApp Configuration
WHATSAPP_GROUP_ID=your-whatsapp-group-id
WHATSAPP_PHONE_NUMBER=+919142130225
```

### Frontend (.env)

Create a `.env` file in the `frontend` directory with the following variables:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Attendance System
VITE_APP_VERSION=1.0.0

# Backend Connection (for proxy)
VITE_BACKEND_HOST=localhost
VITE_BACKEND_PORT=3000
```

## Security Best Practices

### 1. Environment Variables

- ✅ All sensitive data moved to environment variables
- ✅ No hardcoded credentials in source code
- ✅ Separate `.env.example` files provided
- ✅ Environment variable validation on startup

### 2. JWT Security

- ✅ Strong JWT secret required (no fallback)
- ✅ 30-day token expiration
- ✅ Environment variable validation

### 3. WhatsApp Configuration

- ✅ Phone number externalized to environment variable
- ✅ Configuration validation before use

### 4. Database Security

- ✅ MongoDB URI externalized
- ✅ No fallback connection strings
- ✅ Connection validation

## Production Deployment

### Backend Environment Variables

```bash
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-strong-production-jwt-secret-minimum-32-characters
WHATSAPP_GROUP_ID=your-production-group-id
WHATSAPP_PHONE_NUMBER=+919142130225
```

### Frontend Environment Variables

```bash
VITE_API_BASE_URL=https://your-backend-domain.com/api
VITE_APP_NAME=Attendance System
VITE_APP_VERSION=1.0.0
VITE_BACKEND_HOST=your-backend-domain.com
VITE_BACKEND_PORT=443
```

## Security Checklist

- [ ] Strong JWT secret (minimum 32 characters)
- [ ] MongoDB connection uses authentication
- [ ] Environment files added to .gitignore
- [ ] All API endpoints use HTTPS in production
- [ ] WhatsApp phone number verified
- [ ] Regular security updates for dependencies

## Environment File Safety

**⚠️ IMPORTANT**: Never commit `.env` files to version control!

Add these lines to your `.gitignore`:

```
# Environment variables
.env
.env.local
.env.production
.env.staging
```
