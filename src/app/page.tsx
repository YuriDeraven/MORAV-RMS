'use client'

import { useState } from 'react'
import { 
  Hotel, 
  Utensils, 
  Package, 
  Users, 
  TrendingUp,
  CircleDot
} from 'lucide-react'

import Logo from '@/components/ui/logo'
import FrontOfficeModule from '@/components/modules/FrontOfficeModule'
import RestaurantModule from '@/components/modules/RestaurantModule'
import InventoryModule from '@/components/modules/InventoryModule'
import PayrollModule from '@/components/modules/PayrollModule'
import AccountingModule from '@/components/modules/AccountingModule'

const currencyFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const navItems = [
  { id: 'front-office', label: 'Front Office', icon: Hotel },
  { id: 'restaurant', label: 'Restaurant', icon: Utensils },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'payroll', label: 'Payroll', icon: Users },
  { id: 'accounting', label: 'Accounting', icon: TrendingUp },
]

export default function HomePage() {
  const [activeModule, setActiveModule] = useState('front-office')

  const renderModule = () => {
    switch (activeModule) {
      case 'front-office':
        return <FrontOfficeModule />
      case 'restaurant':
        return <RestaurantModule />
      case 'inventory':
        return <InventoryModule />
      case 'payroll':
        return <PayrollModule />
      case 'accounting':
        return <AccountingModule />
      default:
        return <FrontOfficeModule />
    }
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200/60 flex flex-col z-50">
        {/* Logo Section */}
        <div className="p-5 border-b border-slate-200/60">
          <div className="flex items-center gap-3">
            <Logo width={36} height={36} />
            <div>
              <h1 className="text-lg font-bold text-slate-900">MORAV</h1>
              <p className="text-xs text-slate-500">Hospitality Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeModule === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-[#D9F99D] text-slate-900 rounded-xl'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-xl'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-slate-900' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200/60">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-[#86EFAC] animate-pulse"></span>
            <span>System Online</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="pl-64">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 border-b border-slate-200/60">
          <div className="px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-slate-900">
                {navItems.find(n => n.id === activeModule)?.label}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-medium text-slate-900 flex items-center gap-2">
                <CircleDot className="w-3 h-3 text-[#86EFAC]" />
                <span>System Online</span>
              </div>
              <div className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-medium text-slate-900">
                {currencyFormatter.format(2500000)} Revenue
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {renderModule()}
        </main>
      </div>
    </div>
  )
}
