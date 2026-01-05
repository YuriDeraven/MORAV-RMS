# MORAV RMS - Hospitality Management System

A comprehensive, full-stack hospitality management solution designed for hotels, restaurants, and hospitality businesses. MORAV RMS integrates five core modules into a unified system with seamless data flow and professional user experience.

## 🏨 Overview
MORAV RMS (Morav Hospitality Management System) is a production-ready system that provides complete operational control for hospitality businesses. The system features a modern, responsive interface with real-time data synchronization across all modules.

## ✨ Key Features

### 🏨 Front Office Module
* **Room Status Dashboard**: Visual grid showing all rooms with real-time status.
* **Guest Management**: Complete CRUD operations for guest registration and management.
* **Booking System**: Direct room booking with one-click functionality.
* **Room Rate Management**: Dynamic pricing for different room types.
* **Maintenance Control**: Toggle room maintenance status directly from dashboard.

### 🍽️ Restaurant POS Module
* **Menu Management**: Full CRUD for menu items with categories and pricing.
* **Order Taking Interface**: Touch-friendly grid layout for quick item selection.
* **Real-time Order Processing**: Send orders to kitchen functionality.
* **Room Charge Integration**: Charge orders directly to guest rooms.
* **Bill Generation**: Complete billing system with discounts and taxes.

### 📦 Inventory Module
* **Stock Management**: Complete stock in/out functionality with tracking.
* **Re-order Alerts**: Automated alerts when stock falls below minimum levels.
* **Supplier Management**: Track suppliers and purchase information.
* **Real-time Integration**: Automatic stock deduction from restaurant sales.
* **Movement History**: Complete audit trail of all stock movements.

### 💵 Payroll Module
* **Employee Management**: Complete employee records with roles and departments.
* **Attendance Tracking**: Clock in/out functionality with overtime calculation.
* **Payslip Generation**: Automated payslip creation with deductions and allowances.
* **Download Functionality**: Export payslips as downloadable files.

### 📈 Accounting Module
* **Financial Reports**: Comprehensive financial reporting with interactive charts.
* **Profit & Loss Statement**: Revenue, expenses, and profit analysis.
* **Balance Sheet**: Assets, liabilities, and equity breakdown.
* **Cash Flow Statement**: Operating, investing, and financing activities.
* **Trial Balance**: Complete account listing with debits/credits.

## 🛠️ Technology Stack

### Core Framework
* **Frontend**: Next.js 15 with App Router
* **Language**: TypeScript 5
* **Database**: SQLite with Prisma ORM
* **Styling**: Tailwind CSS 4 with shadcn/ui components

### Key Libraries
* **UI Components**: shadcn/ui (New York style)
* **Icons**: Lucide React
* **Charts**: Recharts
* **Forms**: React Hook Form with Zod validation
* **State Management**: Zustand & TanStack Query

## 🚀 Getting Started

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd morav-rms

# Install dependencies
npm install

# Set up the database
npm run db:push
npm run db:generate

# Start the development server
npm run dev
### Environment Variables
Create a `.env` file in the root directory:

```
env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

## 📁 Project Structure

```
morav-rms/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/
│   │   ├── ui/             # shadcn/ui components
│   │   └── modules/        # FrontOffice, Restaurant, Inventory, etc.
│   ├── lib/                 # db connection and utils
│   └── types/               # TypeScript definitions
├── prisma/
│   └── schema.prisma       # Database schema
└── public/                 # Assets and logos
```

### 💾 Database Schema

* **Core Tables**: `rooms`, `guests`, `bookings`, `menu_items`, `orders`, `inventory_items`, `employees`, `attendance`, `payslips`, `accounts`, `journal_entries`.
* **Relationships**: 
    * Bookings link guests to rooms.
    * Orders link to menu items and can be charged to rooms.
    * Inventory deductions trigger automatically on restaurant sales.
    * All financial data flows seamlessly to the Accounting module.

### 🎨 Design System

* **Currency**: Nigerian Naira (₦) - Localized formatting for all financial data.
* **Visual Identity**: Professional blue and purple gradients with a modern sans-serif typeface.
* **Responsive**: Mobile-first approach with full dark mode support.

### 🛠️ Code Quality
  
 *   **TypeScript**: Full type safety across the entire application.
 *   **ESLint**: Enforced code linting and formatting standards.
 *   **Prettier**: Automated code formatting for consistency.
 *   **Husky**: Git hooks integrated for pre-commit checks.

###  📊 Demo Data
The application comes pre-populated with realistic demo data:
*    **4 Rooms**: Different types (Standard, Deluxe, Suite).
*    **2 Guests**: Sample guest profiles.
*    **6 Menu Items**: Restaurant menu with categories.
*    **5 Inventory Items**: Stock items with re-order levels.
*    **3 Employees**: Staff across different departments.

### 🚀 Deployment
---
Production Build
Bash

npm run build
Start Production Server
Bash

npm run start
---

Built with ❤️ for the hospitality industry. MORAV RMS 🚀
