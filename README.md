# Channelized Capacity Quota Management Demo

A pixel-perfect, responsive demo of a capacity quota management feature for FeverUp's ticketing platform. This demo allows partners to create, manage, and allocate event capacity through quotas assigned to different sales channels and businesses.

## 🎯 Overview

The Channelized Capacity system enables event organizers to:
- **Create Quotas**: Reserve or allocate specific amounts of tickets
- **Assign to Channels**: Distribute capacity to sales channels, channel types, or businesses
- **Manage Capacity**: Edit, transfer, replicate, and delete quotas
- **Validate Allocation**: Prevent over-allocation with real-time validation

## ✨ Features

### Quota Types
- **Exclusive**: Reserved for specific channels/businesses only
- **Shared**: Priority for assigned channels, but available to others if general capacity runs out
- **Blocked**: Reserved capacity that cannot be sold

### Key Functionality
- ✅ **Quota Creation** with drawer interface
- ✅ **Capacity Validation** with error messages
- ✅ **Bulk Capacity Editing** across multiple quotas
- ✅ **Dynamic Calculations** for sold, available, and total capacity
- ✅ **Quota Management** (edit, transfer, replicate, delete)
- ✅ **Toast Notifications** for user feedback
- ✅ **Persistent Storage** using LocalStorage

### Validation Logic
- Quotas cannot exceed group's total capacity
- Real-time validation in both drawer and bulk edit modes
- Error messages with visual indicators (red borders, icons)
- Save buttons disabled when validation fails
- "Blocked" quotas reduce overall availability

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling (CSS-based configuration)
- **Zustand** - State management
- **React Router** - Navigation
- **LocalStorage** - Data persistence

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/moisesvaloz-oss/channeled-quotas-demo.git

# Navigate to project directory
cd channeled-quotas-demo

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist` folder.

## 📁 Project Structure

```
src/
├── components/
│   ├── AddQuotaDrawer.tsx      # Drawer for creating/editing quotas
│   ├── DeleteQuotaModal.tsx    # Confirmation modal for deletion
│   ├── Header.tsx               # Top navigation header
│   ├── Sidebar.tsx              # Left navigation sidebar
│   └── Toast.tsx                # Success notification component
├── pages/
│   ├── LandingPage.tsx          # Initial "Tickets per time slot" view
│   └── QuotaManagement.tsx      # Main quota management interface
├── stores/
│   └── quotaStore.ts            # Zustand store for quota state
├── App.tsx                      # Root component with routing
├── index.css                    # Global styles + Tailwind config
└── main.tsx                     # Application entry point
```

## 🎨 Design System

The project strictly follows FeverZone design system specifications from Figma:

- **Font**: Montserrat (300, 400, 600)
- **Colors**: 
  - Primary: `#0089e3` (base), `#0079ca` (active)
  - Accent: `#f0ebfd` (quota background), `#d5c4f5` (quota border)
  - Status: `#24a865` (positive), `#eb0052` (danger)
- **Spacing**: 4px increments (4, 8, 12, 16, 24, 32px)
- **Border Radius**: 8px (standard), 64px (pills)

## 📊 Capacity Logic

### Calculation Hierarchy
1. **Time Slot Total**: Sum of all capacity groups
2. **Capacity Group**: Fixed total capacity per group
3. **Free Capacity**: Group capacity minus allocated quotas
4. **Quota Capacity**: Assigned capacity within a group

### Validation Rules
- Sum of quota capacities cannot exceed group's total capacity
- Each quota validates against remaining available capacity
- "Blocked" quotas reduce overall availability
- "Exclusive" and "Shared" quotas reserve capacity but keep it available

## 🔧 Key Components

### AddQuotaDrawer
- Sliding drawer from the right with smooth animations
- Real-time capacity validation with error messages
- Floating label inputs
- Multi-select dropdowns for channel/business assignment
- Scrollable time picker for replication
- Save button disabled when validation fails

### QuotaManagement
- Main capacity management interface
- Two capacity groups: Club 54 (600) and Fanstand (200)
- Bulk capacity editing mode
- Dynamic calculations for all capacity metrics
- Dropdown menus with intelligent positioning (up/down)
- Toast notifications for user feedback

### QuotaStore (Zustand)
- Quota CRUD operations
- LocalStorage persistence
- Capacity recalculation on updates
- Group-based quota filtering

## 🎭 Demo Features

### Interactive Elements
- **"Manage Quotas" button** - Navigate to quota management
- **"Add quota" button** - Open creation drawer
- **3-dot menu** - Edit, transfer, replicate, or delete quotas
- **"Enable Capacity Editing"** - Bulk edit mode
- **Capacity inputs** - Real-time validation
- **Delete confirmation** - Modal before deletion

### Visual Feedback
- ✅ Success toasts with slide-in animations
- ❌ Error messages with exclamation icons
- 🟣 Purple background for regular quotas
- ⚫ Gray background for blocked quotas
- 🔴 Red borders for validation errors

## 📝 Notes

- This is a frontend demo with simulated backend via LocalStorage
- Figma MCP server was used for design extraction
- All designs are pixel-perfect replicas of Figma specifications
- The demo starts at "Tickets per time slot" view as specified
- Replication section is UI-only (non-functional in demo)

## 👤 Author

**Moises Valoz**  
Product Manager @ FeverUp  
GitHub: [@moisesvaloz-oss](https://github.com/moisesvaloz-oss)

## 📄 License

This project is a demo created for FeverUp partners to test the Channelized Capacity feature.

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
