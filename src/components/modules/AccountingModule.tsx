'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  Wallet,
  Download,
  ArrowUpRight
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Area, AreaChart } from 'recharts'

interface FinancialData {
  revenue: number
  expenses: number
  profit: number
  assets: number
  liabilities: number
  equity: number
  cashFlow: number
}

interface MonthlyData {
  month: string
  revenue: number
  expenses: number
  profit: number
}

interface AccountData {
  name: string
  value: number
  color: string
}

const currencyFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-lg border-0 shadow-xl p-3">
        <p className="text-sm font-semibold text-slate-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {currencyFormatter.format(entry.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function AccountingModule() {
  const [financialData, setFinancialData] = useState<FinancialData>({
    revenue: 0, expenses: 0, profit: 0, assets: 0, liabilities: 0, equity: 0, cashFlow: 0
  })
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [accountData, setAccountData] = useState<AccountData[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('current-month')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFinancialData()
  }, [selectedPeriod])

  const fetchFinancialData = async () => {
    try {
      const mockFinancialData: FinancialData = {
        revenue: 2500000, expenses: 1800000, profit: 700000, assets: 5000000, liabilities: 2000000, equity: 3000000, cashFlow: 450000
      }

      const mockMonthlyData: MonthlyData[] = [
        { month: 'Jan', revenue: 2000000, expenses: 1500000, profit: 500000 },
        { month: 'Feb', revenue: 2200000, expenses: 1600000, profit: 600000 },
        { month: 'Mar', revenue: 2400000, expenses: 1700000, profit: 700000 },
        { month: 'Apr', revenue: 2300000, expenses: 1650000, profit: 650000 },
        { month: 'May', revenue: 2500000, expenses: 1800000, profit: 700000 },
        { month: 'Jun', revenue: 2600000, expenses: 1850000, profit: 750000 },
      ]

      const mockAccountData: AccountData[] = [
        { name: 'Cash & Bank', value: 1500000, color: '#10b981' },
        { name: 'Accounts Receivable', value: 800000, color: '#3b82f6' },
        { name: 'Inventory', value: 1200000, color: '#f59e0b' },
        { name: 'Fixed Assets', value: 1500000, color: '#8b5cf6' },
      ]

      setFinancialData(mockFinancialData)
      setMonthlyData(mockMonthlyData)
      setAccountData(mockAccountData)
    } catch (error) {
      console.error('Error fetching financial data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateReport = (reportType: string) => {
    let reportContent = ''
    
    switch (reportType) {
      case 'p&l':
        reportContent = `MORAV RMS - PROFIT & LOSS STATEMENT
===================================
Period: ${selectedPeriod}
REVENUE
-------
Room Revenue: ${currencyFormatter.format(financialData.revenue * 0.6)}
Restaurant Revenue: ${currencyFormatter.format(financialData.revenue * 0.4)}
Total Revenue: ${currencyFormatter.format(financialData.revenue)}
EXPENSES
--------
Total Expenses: ${currencyFormatter.format(financialData.expenses)}
NET PROFIT: ${currencyFormatter.format(financialData.profit)}
Generated: ${new Date().toLocaleDateString()}`.trim()
        break
      case 'balance-sheet':
        reportContent = `MORAV RMS - BALANCE SHEET
========================
Period: ${selectedPeriod}
ASSETS: ${currencyFormatter.format(financialData.assets)}
LIABILITIES: ${currencyFormatter.format(financialData.liabilities)}
EQUITY: ${currencyFormatter.format(financialData.equity)}
Generated: ${new Date().toLocaleDateString()}`.trim()
        break
      case 'cash-flow':
        reportContent = `MORAV RMS - CASH FLOW STATEMENT
==============================
Period: ${selectedPeriod}
NET CASH FLOW: ${currencyFormatter.format(financialData.cashFlow)}
Generated: ${new Date().toLocaleDateString()}`.trim()
        break
      case 'trial-balance':
        reportContent = `MORAV RMS - TRIAL BALANCE
==========================
Period: ${selectedPeriod}
Generated: ${new Date().toLocaleDateString()}`.trim()
        break
    }

    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${reportType.replace('&', '_')}_${selectedPeriod}.txt`
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading financial data...</div>
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Revenue</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">{currencyFormatter.format(financialData.revenue)}</p>
                <div className="flex items-center text-xs text-emerald-600 mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +12% from last month
                </div>
              </div>
              <DollarSign className="w-5 h-5 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Expenses</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{currencyFormatter.format(financialData.expenses)}</p>
                <div className="flex items-center text-xs text-red-600 mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +8% from last month
                </div>
              </div>
              <CreditCard className="w-5 h-5 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Net Profit</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{currencyFormatter.format(financialData.profit)}</p>
                <div className="flex items-center text-xs text-blue-600 mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +15% from last month
                </div>
              </div>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Cash Flow</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{currencyFormatter.format(financialData.cashFlow)}</p>
                <div className="flex items-center text-xs text-purple-600 mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +5% from last month
                </div>
              </div>
              <Wallet className="w-5 h-5 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Period Selector */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900">Financial Reports</h3>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-56 h-10 bg-white border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white rounded-xl border-0 shadow-xl">
            <SelectItem value="current-month" className="rounded-lg hover:bg-slate-100 focus:bg-[#D9F99D] focus:text-slate-900">Current Month</SelectItem>
            <SelectItem value="last-month" className="rounded-lg hover:bg-slate-100 focus:bg-[#D9F99D] focus:text-slate-900">Last Month</SelectItem>
            <SelectItem value="current-quarter" className="rounded-lg hover:bg-slate-100 focus:bg-[#D9F99D] focus:text-slate-900">Current Quarter</SelectItem>
            <SelectItem value="current-year" className="rounded-lg hover:bg-slate-100 focus:bg-[#D9F99D] focus:text-slate-900 data-[state=checked]:bg-[#D9F99D] data-[state=checked]:text-slate-900">Current Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-white p-1 rounded-xl shadow-sm border-0">
          <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-[#D9F99D] data-[state=active]:text-slate-900">Overview</TabsTrigger>
          <TabsTrigger value="p&l" className="rounded-lg data-[state=active]:bg-[#D9F99D] data-[state=active]:text-slate-900">P&L Statement</TabsTrigger>
          <TabsTrigger value="balance-sheet" className="rounded-lg data-[state=active]:bg-[#D9F99D] data-[state=active]:text-slate-900">Balance Sheet</TabsTrigger>
          <TabsTrigger value="cash-flow" className="rounded-lg data-[state=active]:bg-[#D9F99D] data-[state=active]:text-slate-900">Cash Flow</TabsTrigger>
          <TabsTrigger value="trial-balance" className="rounded-lg data-[state=active]:bg-[#D9F99D] data-[state=active]:text-slate-900">Trial Balance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-slate-900">Revenue vs Expenses</CardTitle>
                <CardDescription className="text-slate-500">Monthly comparison of revenue and expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D9F99D" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#D9F99D" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fca5a5" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#fca5a5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="revenue" stroke="#D9F99D" strokeWidth={3} fill="url(#colorRevenue)" dot={false} activeDot={{ r: 6, stroke: '#D9F99D', strokeWidth: 2, fill: '#fff' }} name="Revenue" />
                    <Area type="monotone" dataKey="expenses" stroke="#fca5a5" strokeWidth={3} fill="url(#colorExpenses)" dot={false} activeDot={{ r: 6, stroke: '#fca5a5', strokeWidth: 2, fill: '#fff' }} name="Expenses" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-slate-900">Assets Distribution</CardTitle>
                <CardDescription className="text-slate-500">Breakdown of current assets</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RePieChart>
                    <Pie
                      data={accountData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      stroke="none"
                    >
                      {accountData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
              <CardHeader className="pb-2 pt-5 px-5">
                <CardTitle className="text-base text-slate-900">Profit Margin</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <div className="text-3xl font-bold text-emerald-600">{((financialData.profit / financialData.revenue) * 100).toFixed(1)}%</div>
                <p className="text-sm text-slate-500 mt-1">Net profit as percentage of revenue</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
              <CardHeader className="pb-2 pt-5 px-5">
                <CardTitle className="text-base text-slate-900">Expense Ratio</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <div className="text-3xl font-bold text-red-600">{((financialData.expenses / financialData.revenue) * 100).toFixed(1)}%</div>
                <p className="text-sm text-slate-500 mt-1">Expenses as percentage of revenue</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
              <CardHeader className="pb-2 pt-5 px-5">
                <CardTitle className="text-base text-slate-900">Return on Assets</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <div className="text-3xl font-bold text-blue-600">{((financialData.profit / financialData.assets) * 100).toFixed(1)}%</div>
                <p className="text-sm text-slate-500 mt-1">Profit generated per asset unit</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="p&l" className="space-y-4">
          <Card className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="pb-2 pt-5 px-5">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-slate-900">Profit & Loss Statement</CardTitle>
                  <CardDescription className="text-slate-500">Revenue, expenses, and profit analysis</CardDescription>
                </div>
                <Button onClick={() => generateReport('p&l')} className="bg-[#D9F99D] text-slate-900 hover:bg-[#D9F99D]/80">
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-emerald-600">REVENUE</h4>
                  <div className="space-y-2 pl-4">
                    <div className="flex justify-between"><span className="text-slate-500">Room Revenue</span><span className="font-medium text-slate-900">{currencyFormatter.format(financialData.revenue * 0.6)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Restaurant Revenue</span><span className="font-medium text-slate-900">{currencyFormatter.format(financialData.revenue * 0.4)}</span></div>
                    <div className="flex justify-between border-t pt-2 font-bold"><span className="text-slate-900">Total Revenue</span><span className="text-slate-900">{currencyFormatter.format(financialData.revenue)}</span></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-red-600">EXPENSES</h4>
                  <div className="space-y-2 pl-4">
                    <div className="flex justify-between"><span className="text-slate-500">Cost of Goods Sold</span><span className="font-medium text-slate-900">{currencyFormatter.format(financialData.expenses * 0.4)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Payroll Expenses</span><span className="font-medium text-slate-900">{currencyFormatter.format(financialData.expenses * 0.3)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Operating Expenses</span><span className="font-medium text-slate-900">{currencyFormatter.format(financialData.expenses * 0.3)}</span></div>
                    <div className="flex justify-between border-t pt-2 font-bold"><span className="text-slate-900">Total Expenses</span><span className="text-slate-900">{currencyFormatter.format(financialData.expenses)}</span></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-blue-600">PROFIT</h4>
                  <div className="space-y-2 pl-4">
                    <div className="flex justify-between"><span className="text-slate-500">Gross Profit</span><span className="font-medium text-slate-900">{currencyFormatter.format(financialData.revenue - financialData.expenses * 0.4)}</span></div>
                    <div className="flex justify-between border-t pt-2 font-bold text-lg"><span className="text-slate-900">Net Profit</span><span className="text-emerald-600">{currencyFormatter.format(financialData.profit)}</span></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="balance-sheet" className="space-y-4">
          <Card className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="pb-2 pt-5 px-5">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-slate-900">Balance Sheet</CardTitle>
                  <CardDescription className="text-slate-500">Statement of assets, liabilities, and equity</CardDescription>
                </div>
                <Button onClick={() => generateReport('balance-sheet')} className="bg-[#D9F99D] text-slate-900 hover:bg-[#D9F99D]/80">
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-blue-600">ASSETS</h4>
                  <div className="space-y-2">
                    <div><h5 className="font-medium text-slate-700 mb-2">Current Assets</h5><div className="space-y-1 pl-4"><div className="flex justify-between text-sm"><span className="text-slate-500">Cash & Bank</span><span className="text-slate-900">{currencyFormatter.format(1500000)}</span></div><div className="flex justify-between text-sm"><span className="text-slate-500">Accounts Receivable</span><span className="text-slate-900">{currencyFormatter.format(800000)}</span></div><div className="flex justify-between text-sm"><span className="text-slate-500">Inventory</span><span className="text-slate-900">{currencyFormatter.format(1200000)}</span></div></div></div>
                    <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t"><span className="text-slate-900">TOTAL ASSETS</span><span className="text-slate-900">{currencyFormatter.format(financialData.assets)}</span></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-purple-600">LIABILITIES & EQUITY</h4>
                  <div className="space-y-2">
                    <div><h5 className="font-medium text-slate-700 mb-2">Liabilities</h5><div className="space-y-1 pl-4"><div className="flex justify-between text-sm"><span className="text-slate-500">Accounts Payable</span><span className="text-slate-900">{currencyFormatter.format(2000000)}</span></div></div></div>
                    <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t"><span className="text-slate-900">TOTAL</span><span className="text-slate-900">{currencyFormatter.format(financialData.assets)}</span></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cash-flow" className="space-y-4">
          <Card className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="pb-2 pt-5 px-5">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-slate-900">Cash Flow Statement</CardTitle>
                  <CardDescription className="text-slate-500">Cash movement from activities</CardDescription>
                </div>
                <Button onClick={() => generateReport('cash-flow')} className="bg-[#D9F99D] text-slate-900 hover:bg-[#D9F99D]/80">
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-700 font-medium">Net Change in Cash</span>
                  <span className="text-emerald-600 font-bold text-xl">{currencyFormatter.format(financialData.cashFlow)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trial-balance" className="space-y-4">
          <Card className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="pb-2 pt-5 px-5">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-slate-900">Trial Balance</CardTitle>
                  <CardDescription className="text-slate-500">List of all accounts and their balances</CardDescription>
                </div>
                <Button onClick={() => generateReport('trial-balance')} className="bg-[#D9F99D] text-slate-900 hover:bg-[#D9F99D]/80">
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 font-medium border-b pb-2">
                  <span className="text-slate-700">Account</span>
                  <span className="text-right text-slate-700">Debits</span>
                  <span className="text-right text-slate-700">Credits</span>
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-4 text-sm"><span className="text-slate-500">Cash & Bank</span><span className="text-right text-slate-900">{currencyFormatter.format(1500000)}</span><span className="text-right text-slate-500">-</span></div>
                  <div className="grid grid-cols-3 gap-4 text-sm"><span className="text-slate-500">Accounts Receivable</span><span className="text-right text-slate-900">{currencyFormatter.format(800000)}</span><span className="text-right text-slate-500">-</span></div>
                  <div className="grid grid-cols-3 gap-4 text-sm"><span className="text-slate-500">Accounts Payable</span><span className="text-right text-slate-500">-</span><span className="text-right text-slate-900">{currencyFormatter.format(2000000)}</span></div>
                </div>
                <div className="border-t pt-2 mt-4">
                  <div className="grid grid-cols-3 gap-4 font-bold">
                    <span className="text-slate-900">TOTALS</span>
                    <span className="text-right text-slate-900">{currencyFormatter.format(financialData.assets + financialData.expenses)}</span>
                    <span className="text-right text-slate-900">{currencyFormatter.format(financialData.liabilities + financialData.equity + financialData.revenue)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
