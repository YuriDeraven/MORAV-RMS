'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Hotel, 
  Utensils, 
  Package, 
  Users, 
  TrendingUp,
  Bed,
  UserCheck,
  ShoppingCart,
  Calculator,
  CreditCard
} from 'lucide-react'

// Import module components
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

export default function HomePage() {
  const [activeModule, setActiveModule] = useState('front-office')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden">
                <img src="/logo.png" alt="MORAV RMS" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">MORAV RMS</h1>
                <p className="text-sm text-slate-500">Hospitality Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                System Online
              </Badge>
              <div className="text-sm text-slate-600">
                {currencyFormatter.format(2500000)} Total Revenue
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeModule} onValueChange={setActiveModule} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white p-1 rounded-lg shadow-sm">
            <TabsTrigger 
              value="front-office" 
              className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Hotel className="w-4 h-4" />
              <span>Front Office</span>
            </TabsTrigger>
            <TabsTrigger 
              value="restaurant" 
              className="flex items-center space-x-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <Utensils className="w-4 h-4" />
              <span>Restaurant</span>
            </TabsTrigger>
            <TabsTrigger 
              value="inventory" 
              className="flex items-center space-x-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white"
            >
              <Package className="w-4 h-4" />
              <span>Inventory</span>
            </TabsTrigger>
            <TabsTrigger 
              value="payroll" 
              className="flex items-center space-x-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Users className="w-4 h-4" />
              <span>Payroll</span>
            </TabsTrigger>
            <TabsTrigger 
              value="accounting" 
              className="flex items-center space-x-2 data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Accounting</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="front-office" className="space-y-6">
            <FrontOfficeModule />
          </TabsContent>

          <TabsContent value="restaurant" className="space-y-6">
            <RestaurantModule />
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <InventoryModule />
          </TabsContent>

          <TabsContent value="payroll" className="space-y-6">
            <PayrollModule />
          </TabsContent>

          <TabsContent value="accounting" className="space-y-6">
            <AccountingModule />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}