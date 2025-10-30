# EchoCity - Smart Citizen Feedback Portal

A fully responsive, interactive frontend application for reporting and tracking city issues. Built with React, TypeScript, and Tailwind CSS.

## Features

### 🎨 Design & Animations
- **3D Background Animations**: Rotating buildings and geometric shapes
- **Interactive Cursor Effect**: Particle trail following mouse movement
- **Smooth Transitions**: All buttons, cards, and page elements have elegant animations
- **Parallax Effects**: Scrolling parallax on landing page
- **Dark/Light Mode**: Full theme support with smooth transitions

### 📱 Pages

1. **Landing Page**
   - Futuristic city-themed design
   - Animated 3D objects in background
   - Theme toggle button
   - Quick action buttons

2. **Login/Register**
   - Animated form inputs with focus effects
   - Form validation
   - Success/error notifications
   - Responsive layout

3. **Report Issue**
   - Drag-and-drop image upload
   - GPS location auto-detection
   - Category selection
   - Image preview
   - Real-time form validation

4. **Interactive Map**
   - Visual complaint pins with status colors
   - Animated bouncing markers
   - Complaint clustering
   - Zoom controls
   - Filter by category and status
   - Click to view complaint details

5. **Dashboard**
   - Statistics overview with animated cards
   - Progress bars with smooth animations
   - Complaints table
   - Status management (for admin users)
   - Sidebar navigation

## Tech Stack

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons
- **LocalStorage** - Data Persistence

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

The production build will be in the `dist` folder.

## Demo Accounts

Use these credentials to test different roles:

**Admin Account:**
- Email: `admin@echocity.com`
- Password: `password` (minimum 6 characters)

**Citizen Account:**
- Email: `john@example.com`
- Password: `password`

Or register a new account!

## Features Breakdown

### Animations
- ✅ 3D rotating buildings in background
- ✅ Particle cursor trail effect
- ✅ Smooth page transitions
- ✅ Hover animations on buttons
- ✅ Floating animations on icons
- ✅ Parallax scrolling effect
- ✅ Loading spinners
- ✅ Progress bar animations

### Responsive Design
- ✅ Mobile-first approach
- ✅ Tablet breakpoints
- ✅ Desktop optimization
- ✅ Touch-friendly interactions

### User Experience
- ✅ Form validation
- ✅ Error handling
- ✅ Success notifications
- ✅ Loading states
- ✅ Empty states
- ✅ Tooltips and hints

## Data Storage

All data is stored in browser's LocalStorage:
- User authentication state
- Submitted complaints
- User profiles

Mock data is pre-loaded for demonstration purposes.

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Project Structure

```
src/
├── components/        # Reusable components
│   ├── CursorEffect.tsx
│   └── ThreeScene.tsx
├── contexts/         # React contexts
│   └── AuthContext.tsx
├── data/            # Mock data and utilities
│   └── mockData.ts
├── hooks/           # Custom hooks
│   └── useTheme.ts
├── pages/           # Page components
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── ReportIssue.tsx
│   ├── MapView.tsx
│   └── Dashboard.tsx
└── App.tsx          # Main app component
```

## Customization

### Colors
Modify the color scheme in `tailwind.config.js`

### Animations
Adjust animation timings in individual component files

### Mock Data
Update categories and complaints in `src/data/mockData.ts`

## License

MIT

## Credits

Built with modern web technologies for demonstration purposes.
