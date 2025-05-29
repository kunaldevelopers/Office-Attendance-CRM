# Attendance System Frontend

A modern, mobile-responsive React application for attendance tracking with WhatsApp integration.

## Features

- **Modern UI**: Built with React and Vite for fast development and optimal performance
- **Mobile-First Design**: Fully responsive design optimized for mobile devices
- **Authentication**: Secure user registration and login with JWT tokens
- **Real-time Clock**: Live time display with automatic updates
- **One-Click Attendance**: Simple login/logout buttons with daily restrictions
- **WhatsApp Integration**: Automatic WhatsApp messages sent to specified number
- **Status Tracking**: Visual feedback for attendance status
- **Persistent State**: User sessions maintained across browser restarts

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Styling**: Custom CSS with Tailwind-inspired utilities

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:3000`

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Attendance System
VITE_APP_VERSION=1.0.0
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.jsx   # Main attendance dashboard
│   ├── Login.jsx       # User login form
│   ├── Register.jsx    # User registration form
│   └── ProtectedRoute.jsx # Route protection wrapper
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication context
├── hooks/              # Custom hooks
│   └── useAuth.js      # Authentication hook
├── services/           # API services
│   └── api.js          # Axios configuration and API calls
├── App.jsx             # Main app component
├── main.jsx           # App entry point
├── App.css            # App-specific styles
└── index.css          # Global styles and utilities
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The frontend communicates with the backend through the following endpoints:

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Attendance

- `POST /api/whatsapp/login` - Send login message
- `POST /api/whatsapp/logout` - Send logout message
- `GET /api/whatsapp/status` - Get today's attendance status

## Features in Detail

### Dashboard

- Real-time clock with live updates
- One-tap login/logout buttons
- Daily restriction (one login, one logout per day)
- Visual status indicators
- Success/error message notifications

### Authentication

- Secure JWT-based authentication
- Form validation with user feedback
- Automatic token refresh handling
- Protected routes for authenticated users only

### Mobile Responsiveness

- Touch-friendly button sizes
- Optimized for small screens
- Fast loading and smooth animations
- PWA-ready architecture

## Customization

### Styling

The app uses a custom CSS utility system inspired by Tailwind CSS. You can:

- Modify colors in `src/index.css`
- Adjust component styles in individual component files
- Add new utility classes as needed

### API Configuration

Update the API base URL in:

- `.env` file for environment-specific settings
- `src/services/api.js` for default fallback

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Static Hosting

The built files in the `dist` folder can be deployed to any static hosting service like:

- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Follow the existing code style
2. Add proper TypeScript types if converting to TS
3. Test on multiple devices and browsers
4. Update documentation for new features+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
