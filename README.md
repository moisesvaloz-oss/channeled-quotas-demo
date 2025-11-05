# Quota Management Demo - FeverZone

A pixel-perfect demo of the Channelized Capacity quota management system for FeverUp's event ticketing platform.

## 🚀 Getting Started

### Development Server
The development server is running at: **http://localhost:5173**

```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview
```

## ✅ Completed Features

### Landing Page - Schedule & Tickets View
- ✓ Pixel-perfect FeverZone header with logo and user menu
- ✓ Sidebar navigation with Events section and all menu items
- ✓ Event selector dropdowns (City, Event, Venue)
- ✓ Tab navigation with "Tickets per time slot" active
- ✓ Date/Time picker
- ✓ **"Manage Quotas" button** - Click to navigate to quota management
- ✓ Time slot information display
- ✓ Capacity groups (Fanstand, Club 54) with expandable details
- ✓ Exact color palette, typography, and spacing from Figma designs

## 🎨 Design System

The application uses exact design tokens extracted from Figma:

- **Colors**: FeverZone palette (#06232c background, #0079ca primary, etc.)
- **Typography**: Montserrat font family (400, 600 weights)
- **Spacing**: 4px-based scale matching Figma
- **Components**: Pixel-perfect replication of Figma components

## 📁 Project Structure

```
src/
├── components/      # Reusable UI components
│   ├── Header.tsx
│   └── Sidebar.tsx
├── pages/          # Page components
│   ├── LandingPage.tsx
│   └── QuotaManagement.tsx
├── stores/         # Zustand state management (to be added)
├── types/          # TypeScript type definitions (to be added)
└── utils/          # Utility functions (to be added)
```

## 🎯 Next Steps

1. Build the Quota Management interface
2. Implement quota creation/edit modals
3. Add quota reporting views
4. Implement business logic and state management
5. Deploy to production

## 🔧 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (custom config with Figma tokens)
- **Routing**: React Router DOM
- **State**: Zustand (planned)
- **Design Source**: Figma MCP Server

## 📝 Notes

- The "Manage Quotas" button on the landing page navigates to `/quota-management`
- All design values (colors, spacing, typography) are extracted directly from Figma
- The implementation prioritizes pixel-perfect accuracy over creative interpretation
