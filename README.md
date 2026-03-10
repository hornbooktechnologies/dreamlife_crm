# HB Holiday CRM - Frontend

A modern Holiday CRM application built with React, featuring authentication and dashboard management.

## Features

- ✅ **Login Page** - Secure authentication with form validation
- ✅ **Dashboard** - Overview of bookings, holidays, and revenue
- ✅ **Protected Routes** - Authentication-based route protection
- ✅ **State Management** - Zustand for global state
- ✅ **Modern UI** - Tailwind CSS with beautiful gradients and shadows
- ✅ **Form Validation** - React Hook Form with Zod schema validation
- ✅ **Toast Notifications** - User-friendly notifications with Sonner

## Tech Stack

- **React** 19.2.3
- **React Router DOM** - Client-side routing
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Tailwind CSS** v3 - Styling
- **Axios** - HTTP client
- **Sonner** - Toast notifications

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   REACT_APP_API_BASE_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The application will open at `http://localhost:3000` (or another port if 3000 is busy).

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── login/
│   │       └── Login.js          # Login component
│   ├── dashboard/
│   │   └── Dashboard.js          # Dashboard component
│   ├── guards/
│   │   └── PrivateRoute.js       # Route protection
│   └── ui/                       # Reusable UI components
│       ├── button.js
│       ├── card.js
│       ├── field.js
│       ├── input.js
│       └── spinner.js
├── hooks/
│   └── useToast.js               # Toast notification hook
├── lib/
│   └── utils/
│       ├── network-client.js     # API client
│       ├── storage-utils.js      # LocalStorage utilities
│       └── utils.js              # General utilities
├── pages/
│   ├── auth/
│   │   └── Login.js              # Login page
│   └── Dashboard.js              # Dashboard page
├── store/
│   └── auth.js                   # Authentication store
├── App.js                        # Main app component with routing
└── index.js                      # Entry point
```

## Routes

- `/auth/login` - Login page (public)
- `/dashboard` - Dashboard page (protected)
- `/` - Redirects to dashboard if authenticated, otherwise to login

## Authentication Flow

### Login Process

1. User enters credentials on the login page (`/auth/login`)
2. Form validates credentials using Zod schema:
   - Email: Required and must be valid email format
   - Password: Required (minimum 1 character)
3. API request sent to `/auth/login` endpoint
4. Backend validates credentials and returns response
5. On success:
   - User data and tokens stored in Zustand store
   - Tokens saved to localStorage (`accessToken`, `refreshToken`)
   - User redirected to dashboard (`/`)
   - Success toast notification displayed
6. On error:
   - Error message shown via toast notification
   - User remains on login page

### API Integration

**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "user@example.com",
      "role": "admin",
      "status": "active"
    },
    "tokens": {
      "accessToken": "jwt_token_here",
      "refreshToken": "refresh_token_here"
    }
  }
}
```

### Supported User Roles

The system supports three user roles:
- **admin** - Full system access
- **hr** - HR-specific features
- **manager** - Manager-specific features

### Protected Routes

- All routes except `/auth/login` are protected
- Unauthenticated users are redirected to login page
- Authentication status checked via Zustand store
- Tokens automatically included in API requests

### Logout

- Clears user data from Zustand store
- Removes tokens from localStorage
- Redirects to login page

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Design Reference

This project follows the design patterns from the HB CRM FE project, featuring:
- Clean, modern UI with gradient backgrounds
- Card-based layouts
- Consistent color scheme (blue/indigo)
- Responsive design
- Accessible form components

## API Configuration

Update the `REACT_APP_API_BASE_URL` in `.env` to point to your backend API.

Expected API endpoints:
- `POST /auth/login` - Login endpoint
  - Request: `{ email: string, password: string }`
  - Response: `{ user: {...}, tokens: { accessToken: string, refreshToken: string } }`

## Future Enhancements

- [ ] Booking management
- [ ] Holiday package management
- [ ] Customer management
- [ ] Reports and analytics
- [ ] Email notifications
- [ ] Multi-language support

## License

Private - HB Holiday CRM
