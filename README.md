# SmartHome Client-Side Application

A modern, feature-rich Angular application for managing smart homes, user authentication, and home automation. Built with Angular 20, Angular Material, and Bootstrap 5.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Building](#building)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Authentication](#authentication)
- [API Integration](#api-integration)
- [Routing](#routing)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

SmartHome Client-Side is a comprehensive web application that enables users to:
- Register and authenticate securely
- Manage multiple smart homes
- Create and configure home rooms
- Control and monitor smart home devices
- Manage user account settings
- Receive real-time notifications for home events
- Manage notification preferences and history

The application follows modern Angular best practices with a clean architecture pattern, feature-based organization, and comprehensive security measures.

## ✨ Features

### Authentication & User Management
- **User Registration**: Secure account creation with email verification
- **Login System**: Multi-factor authentication with OTP support
- **Password Management**: Forgot password and reset functionality
- **Account Activation**: Email-based account activation workflow
- **Session Management**: JWT-based authentication with refresh tokens
- **Browser Identification**: Device tracking for enhanced security

### Home Management
- **Home Creation**: Create and configure new smart homes
- **Home Listing**: View all user-associated homes
- **Home Details**: Detailed view of home information and rooms
- **Room Management**: Add, delete, and manage rooms within homes
- **Home Subscription**: Request and manage home subscriptions

### User Interface
- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **Material Design**: Angular Material components for consistent UI
- **Modern Layout**: Clean, intuitive navigation and layouts
- **Device Management**: Advanced device control and monitoring
- **Room Management**: Room-based organization for smart devices
- **Error Handling**: Comprehensive error pages and user feedback

### Real-time & Notifications
- **Real-time Updates**: SignalR integration for instant updates across devices
- **Notification System**: Comprehensive notification center with unread counts and status tracking (`Unread`, `Seen`, `Read`)
- **Notification Components**: 
  - `NotificationBell`: Dynamic bell icon with real-time unread count
  - `NotificationList`: Detailed history with pagination and status filtering
- **State Management**: Dedicated `NotificationsStore` for efficient handling and real-time state synchronization
- **Event Source Tracking**: Notifications link directly to source entities (Homes, Invitations, etc.) via `RefType` and `RefId`

## 🛠 Technology Stack

### Core Framework
- **Angular**: 20.0.0
- **TypeScript**: 5.8.2
- **RxJS**: 7.8.0

### UI Libraries
- **Angular Material**: 20.2.14
- **Angular CDK**: 20.2.14
- **Bootstrap**: 5.3.8

### Development Tools
- **Angular CLI**: 20.0.1
- **Karma**: 6.4.0 (Testing)
- **Jasmine**: 5.7.0 (Testing)

### Additional Libraries
- **UUID**: 13.0.0 (Unique identifier generation)
- **SignalR**: @microsoft/signalr (Real-time web functionality)

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher (comes with Node.js)
- **Angular CLI**: v20.0.1 or higher
- **SSL Certificates**: Required for local HTTPS development (see [SSL Configuration](#ssl-configuration))

### Installing Angular CLI

```bash
npm install -g @angular/cli@20.0.1
```

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SmartHome_ClientSide
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify installation**
   ```bash
   ng version
   ```

## ⚙️ Configuration

### Environment Configuration

The application uses environment-specific configuration files located in `src/environments/`.

#### Development Environment (`environment.development.ts`)

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'https://localhost:7072/api/',
  authBaseUrl: 'https://localhost:7072/api/auth',
  deviceManagementBaseUrl: 'https://localhost:7072/api/DevicesAuth/',
};
```

**Note**: Update these URLs to match your backend API endpoints.

### SSL Configuration

The development server is configured to use HTTPS with SSL certificates:
- Certificate: `certs/localhost+2.pem`
- Private Key: `certs/localhost+2-key.pem`

Ensure these certificates exist in the `certs/` directory. If not, generate them using:

```bash
# Using mkcert (recommended)
mkcert -install
mkcert localhost 127.0.0.1 ::1
```

Then ensure your `angular.json` points to the correct certificate paths (default: `certs/localhost+2.pem` and `certs/localhost+2-key.pem`).

## 💻 Development

### Start Development Server

```bash
npm start
# or
ng serve
```

The application will be available at:
- **HTTPS**: `https://localhost:4200`
- **HTTP**: Not available (SSL required)

The development server includes:
- Hot module replacement (HMR)
- Source maps for debugging
- Automatic browser refresh on file changes

### Development Configuration

The development build includes:
- Source maps enabled
- No optimization (faster builds)
- License extraction disabled

### Watch Mode

For continuous building during development:

```bash
npm run watch
# or
ng build --watch --configuration development
```

## 🏗 Building

### Production Build

```bash
npm run build
# or
ng build
```

The production build:
- Optimizes the application for performance
- Minifies JavaScript and CSS
- Enables tree-shaking
- Generates source maps (optional)
- Outputs to `dist/` directory

### Build Configuration

Production build budgets:
- Initial bundle: 500kB warning, 1MB error
- Component styles: 4kB warning, 8kB error

### Build Output

The build artifacts will be stored in the `dist/` directory, ready for deployment to any static hosting service.

## 🧪 Testing

### Unit Tests

Run unit tests using Karma and Jasmine:

```bash
npm test
# or
ng test
```

Tests will execute in watch mode by default. Press `Ctrl+C` to stop.

### Code Coverage

To generate code coverage reports:

```bash
ng test --code-coverage
```

Coverage reports will be generated in the `coverage/` directory.

### End-to-End Testing

The project is configured for E2E testing, but you'll need to install a testing framework:

```bash
# Example with Cypress
npm install -D cypress
```

## 📁 Project Structure

```
SmartHome_ClientSide/
├── src/
│   ├── app/
│   │   ├── core/                    # Core functionality
│   │   │   ├── auth/                # Authentication core
│   │   │   │   ├── authGuard/       # Route guards
│   │   │   │   ├── authInterceptors/# HTTP interceptors
│   │   │   │   ├── authStateService/# Auth state management
│   │   │   │   └── tokenStoreService/# Token storage
│   │   │   ├── browserIdentifier/   # Browser identification
│   │   │   ├── http/                # HTTP service
│   │   │   ├── location/            # Location-based services
│   │   │   ├── realtime/            # Real-time updates (WebSockets/SignalR)
│   │   │   │   └── signalr/         # SignalR service implementation
│   │   │   └── utils/               # Utility functions
│   │   ├── features/                # Feature modules
│   │   │   ├── auth/                # Authentication feature
│   │   │   │   ├── application/     # Facade services
│   │   │   │   ├── data-access/     # API services
│   │   │   │   ├── models/          # DTOs and models
│   │   │   │   └── ui/              # UI components
│   │   │   ├── home/                # Home management feature
│   │   │   ├── devicesManagement/   # Device management feature
│   │   │   ├── notifications/       # Real-time notifications feature
│   │   │   │   ├── application/     # Facade services
│   │   │   │   ├── data-access/     # API services
│   │   │   │   ├── models/          # DTOs and models
│   │   │   │   ├── store/           # Notification state management
│   │   │   │   └── ui/              # UI components
│   │   │   ├── room/                # Room management feature
│   │   │   ├── user-info/           # User information feature
│   │   │   └── not-found/           # 404 page
│   │   ├── layouts/                 # Layout components
│   │   │   ├── authentication-layout-component/
│   │   │   └── main-layout-component/
│   │   ├── shared/                  # Shared resources
│   │   │   ├── components/          # Shared UI components
│   │   │   └── models/              # Shared data models
│   │   ├── app.ts                   # Root component
│   │   ├── app.routes.ts            # Route configuration
│   │   └── app.config.ts            # App configuration
│   ├── environments/                # Environment configs
│   ├── styles.css                   # Global styles
│   ├── custom-theme.scss            # Material theme
│   └── index.html                   # Entry HTML
├── public/                          # Static assets
│   └── images/                      # Image assets
├── certs/                           # SSL certificates
├── angular.json                     # Angular configuration
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
└── README.md                        # This file
```

## 🏛 Architecture

### Feature-Based Architecture

The application follows a feature-based architecture pattern:

```
feature/
├── application/      # Facade services (business logic)
├── data-access/      # API services (data layer)
├── models/           # DTOs and interfaces
└── ui/               # Components, templates, styles
```

### Core Services

- **Facade Services**: Centralize business logic and coordinate between UI and data layers
- **API Services**: Handle HTTP communication with backend
- **State Services**: Manage application state (auth, browser ID, notifications)
- **Store Services**: Handle local storage operations or state persistence (`NotificationsStore`)
- **Real-time Services**: Handle WebSocket connections via SignalR (`SignalRService`)
  - **Hubs**: `/hubs/notifications` for user-specific real-time events
  - **Events**: `NotificationReceived`, `UnreadCountUpdated`

### Design Patterns

1. **Facade Pattern**: Used in feature modules to simplify complex subsystems
2. **Repository Pattern**: API services abstract data access
3. **Observer Pattern**: RxJS observables for reactive programming
4. **Guard Pattern**: Route guards for authentication and authorization

## 🔐 Authentication

### Authentication Flow

1. **Login**: User provides credentials
2. **OTP Verification**: If browser is not recognized, OTP is sent
3. **Token Management**: JWT tokens (access + refresh) are stored
4. **Token Refresh**: Automatic token refresh before expiration
5. **Session Persistence**: Tokens stored in localStorage

### Route Guards

- **authGuard**: Protects authenticated routes
- **unauthorizedGuard**: Prevents authenticated users from accessing auth pages
- **resetPasswordGuard**: Controls access to password reset page
- **accountActivationGuard**: Controls access to account activation page

### Token Storage

Tokens are stored securely in localStorage and managed by:
- `TokenStoreService`: Handles token persistence
- `AuthStateService`: Manages token state in memory
- `AuthInterceptors`: Automatically attach tokens to HTTP requests

## 🌐 API Integration

### HTTP Service

The `ApiHttpService` provides a centralized HTTP client:

```typescript
// GET request
this.apiHttp.get<T>(url, options)

// POST request
this.apiHttp.post<T>(url, body, options)

// PUT request
this.apiHttp.put<T>(url, body, options)

// PATCH request
this.apiHttp.patch<T>(url, body, options)

// DELETE request
this.apiHttp.delete<T>(url, options)
```

### API Endpoints

The application communicates with:
- **Auth API**: `/api/auth/*`
- **Device Management API**: `/api/DevicesAuth/*`
- **Home API**: `/api/home/*`
- **Notifications API**: `/api/Notifications/*`
- **User API**: `/api/user/*` (inferred)

### Error Handling

HTTP errors are handled through:
- RxJS `catchError` operators
- HTTP interceptors
- Centralized error handling in facade services

## 🧭 Routing

### Route Structure

```
/                           → Main layout (protected)
  ├── /Main                 → User dashboard
  ├── /account-settings     → Account settings
  ├── /home/:homeId         → Home details
  └── /new-home             → Create new home

/authentication             → Auth layout (public)
  ├── /login                → Login page
  ├── /register             → Registration page
  ├── /reset-password       → Password reset
  └── /account-activation   → Account activation

/NotFound                   → 404 page
```

### Lazy Loading

All feature components are lazy-loaded for optimal performance:

```typescript
loadComponent: () => import('./path/to/component').then(m => m.Component)
```

## 🔒 Security

### Security Features

1. **HTTPS Only**: Development server uses SSL/TLS
2. **JWT Tokens**: Secure token-based authentication
3. **Token Refresh**: Automatic token renewal
4. **Route Guards**: Protected routes require authentication
5. **Browser Identification**: Device tracking for security
6. **OTP Verification**: Multi-factor authentication support

### Best Practices

- Tokens stored in localStorage (consider httpOnly cookies for production)
- Automatic token refresh before expiration
- Secure API communication over HTTPS
- Input validation on all forms
- XSS protection through Angular's built-in sanitization

## 🐛 Troubleshooting

### Common Issues

#### SSL Certificate Errors

**Problem**: Browser shows SSL certificate warnings

**Solution**: 
- Ensure certificates exist in `certs/` directory
- Generate new certificates using `mkcert`
- Trust the certificate authority

#### Port Already in Use

**Problem**: Port 4200 is already in use

**Solution**:
```bash
# Use a different port
ng serve --port 4201
```

#### Build Errors

**Problem**: TypeScript compilation errors

**Solution**:
- Check TypeScript version: `npm list typescript`
- Clear Angular cache: `rm -rf .angular/cache`
- Reinstall dependencies: `rm -rf node_modules && npm install`

#### API Connection Issues

**Problem**: Cannot connect to backend API

**Solution**:
- Verify backend server is running
- Check `environment.development.ts` API URLs
- Ensure CORS is configured on backend
- Verify SSL certificates match

### Debugging Tips

1. **Enable Source Maps**: Already enabled in development
2. **Browser DevTools**: Use Angular DevTools extension
3. **Console Logging**: Check browser console for errors
4. **Network Tab**: Inspect HTTP requests/responses
5. **Application Tab**: Check localStorage for tokens

## 🤝 Contributing

### Development Workflow

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Ensure all tests pass
5. Submit a pull request

### Code Style

- Follow Angular Style Guide
- Use TypeScript strict mode
- Write self-documenting code
- Add comments for complex logic
- Maintain consistent naming conventions

### Commit Messages

Use conventional commit format:
```
feat: add new home creation feature
fix: resolve token refresh issue
docs: update README with API info
refactor: improve auth facade service
```

---

**Built with ❤️ using Angular 20**
