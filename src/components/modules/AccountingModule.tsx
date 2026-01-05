'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  BarChart3,
  PieChart,
  FileText,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Building,
  Users
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RePieChart, Pie, Cell } from 'recharts'

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

export default function AccountingModule() {
  const [financialData, setFinancialData] = useState<FinancialData>({
    revenue: 0,
    expenses: 0,
    profit: 0,
    assets: 0,
    liabilities: 0,
    equity: 0,
    cashFlow: 0
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
      // Mock financial data
      const mockFinancialData: FinancialData = {
        revenue: 2500000,
        expenses: 1800000,
        profit: 700000,
        assets: 5000000,
        liabilities: 2000000,
        equity: 3000000,
        cashFlow: 450000
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
    // Create a simple text report
    let reportContent = ''
    
    switch (reportType) {
      case 'p&l':
        reportContent = `
MORAV RMS - PROFIT & LOSS STATEMENT
===================================
Period: ${selectedPeriod}

REVENUE
-------
Room Revenue: ${currencyFormatter.format(financialData.revenue * 0.6)}
Restaurant Revenue: ${currencyFormatter.format(financialData.revenue * 0.4)}
Total Revenue: ${currencyFormatter.format(financialData.revenue)}

EXPENSES
--------
Cost of Goods Sold: ${currencyFormatter.format(financialData.expenses * 0.4)}
Payroll: ${currencyFormatter.format(financialData.expenses * 0.3)}
Operating Expenses: ${currencyFormatter.format(financialData.expenses * 0.3)}
Total Expenses: ${currencyFormatter.format(financialData.expenses)}

PROFIT/LOSS
-----------
Gross Profit: ${currencyFormatter.format(financialData.revenue - financialData.expenses * 0.4)}
Net Profit: ${currencyFormatter.format(financialData.profit)}

Generated: ${new Date().toLocaleDateString()}
        `.trim()
        break
        
      case 'balance-sheet':
        reportContent = `
MORAV RMS - BALANCE SHEET
========================
Period: ${selectedPeriod}

ASSETS
------
Current Assets:
Cash & Bank: ${currencyFormatter.format(1500000)}
Accounts Receivable: ${currencyFormatter.format(800000)}
Inventory: ${currencyFormatter.format(1200000)}
Total Current Assets: ${currencyFormatter.format(3500000)}

Fixed Assets: ${currencyFormatter.format(1500000)}
Total Assets: ${currencyFormatter.format(financialData.assets)}

LIABILITIES & EQUITY
-------------------
Current Liabilities: ${currencyFormatter.format(2000000)}
Total Liabilities: ${currencyFormatter.format(financialData.liabilities)}

Equity: ${currencyFormatter.format(financialData.equity)}
Total Liabilities & Equity: ${currencyFormatter.format(financialData.assets)}

Generated: ${new Date().toLocaleDateString()}
        `.trim()
        break
        
      case 'cash-flow':
        reportContent = `
MORAV RMS - CASH FLOW STATEMENT
==============================
Period: ${selectedPeriod}

OPERATING ACTIVITIES
-------------------
Cash from Operations: ${currencyFormatter.format(financialData.cashFlow)}
Cash Paid for Expenses: ${currencyFormatter.format(financialData.expenses * 0.8)}
Net Cash from Operations: ${currencyFormatter.format(financialData.cashFlow - financialData.expenses * 0.8)}

INVESTING ACTIVITIES
--------------------
Equipment Purchased: ${currencyFormatter.format(-200000)}
Net Cash from Investing: ${currencyFormatter.format(-200000)}

FINANCING ACTIVITIES
-------------------
Loan Received: ${currencyFormatter.format(500000)}
Loan Repaid: ${currencyFormatter.format(-100000)}
Net Cash from Financing: ${currencyFormatter.format(400000)}

NET CHANGE IN CASH: ${currencyFormatter.format(financialData.cashFlow)}

Generated: ${new Date().toLocaleDateString()}
        `.trim()
        break
        
      case 'trial-balance':
        reportContent = `
MORAV RMS - TRIAL BALANCE
========================
Period: ${selectedPeriod}

ACCOUNT DEBITS    CREDITS
------- -------   -------
Cash                  ${currencyFormatter.format(1500000)}
Accounts Receivable    ${currencyFormatter.format(800000)}
Inventory             ${currencyFormatter.format(1200000)}
Fixed Assets          ${currencyFormatter.format(1500000)}
                                 
Accounts Payable                 ${currencyFormatter.format(2000000)}
Equity                           ${currencyFormatter.format(financialData.equity)}
Revenue                          ${currencyFormatter.format(financialData.revenue)}
Expenses              ${currencyFormatter.format(financialData.expenses)}
                                 
------- -------   -------
TOTALS               ${currencyFormatter.format(financialData.assets + financialData.expenses)}    ${currencyFormatter.format(financialData.liabilities + financialData.equity + financialData.revenue)}

Generated: ${new Date().toLocaleDateString()}
        `.trim()
        break
    }

    // Create and download file
    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${reportType.replace('&', '_')}_${selectedPeriod}.txt`
    document.body.appendChild(a)
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {currencyFormatter.format(financialData.revenue)}
            </div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +12% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {currencyFormatter.format(financialData.expenses)}
            </div>
            <div className="flex items-center text-xs text-red-600">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +8% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {currencyFormatter.format(financialData.profit)}
            </div>
            <div className="flex items-center text-xs text-blue-600">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +15% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {currencyFormatter.format(financialData.cashFlow)}
            </div>
            <div className="flex items-center text-xs text-purple-600">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +5% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Period Selector */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Financial Reports</h3>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current-month">Current Month</SelectItem>
            <SelectItem value="last-month">Last Month</SelectItem>
            <SelectItem value="current-quarter">Current Quarter</SelectItem>
            <SelectItem value="current-year">Current Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="p&l">P&L Statement</TabsTrigger>
          <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
          <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
          <TabsTrigger value="trial-balance">Trial Balance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue vs Expenses Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Expenses</CardTitle>
                <CardDescription>Monthly comparison of revenue and expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(value: number) => currencyFormatter.format(value)} />
                    <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue" />
                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
                    <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} name="Profit" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Assets Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Assets Distribution</CardTitle>
                <CardDescription>Breakdown of current assets</CardDescription>
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
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {accountData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => currencyFormatter.format(value)} />
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profit Margin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {((financialData.profit / financialData.revenue) * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-muted-foreground">Net profit as percentage of revenue</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Expense Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {((financialData.expenses / financialData.revenue) * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-muted-foreground">Expenses as percentage of revenue</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Return on Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {((financialData.profit / financialData.assets) * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-muted-foreground">Profit generated per asset unit</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="p&l" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Profit & Loss Statement</CardTitle>
                  <CardDescription>Revenue, expenses, and profit analysis</CardDescription>
                </div>
                <Button onClick={() => generateReport('p&l')}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Revenue Section */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-green-600">REVENUE</h4>
                  <div className="space-y-2 pl-4">
                    <div className="flex justify-between">
                      <span>Room Revenue</span>
                      <span className="font-medium">{currencyFormatter.format(financialData.revenue * 0.6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Restaurant Revenue</span>
                      <span className="font-medium">{currencyFormatter.format(financialData.revenue * 0.4)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold">
                      <span>Total Revenue</span>
                      <span>{currencyFormatter.format(financialData.revenue)}</span>
                    </div>
                  </div>
                </div>

                {/* Expenses Section */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-red-600">EXPENSES</h4>
                  <div className="space-y-2 pl-4">
                    <div className="flex justify-between">
                      <span>Cost of Goods Sold</span>
                      <span className="font-medium">{currencyFormatter.format(financialData.expenses * 0.4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payroll Expenses</span>
                      <span className="font-medium">{currencyFormatter.format(financialData.expenses * 0.3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Operating Expenses</span>
                      <span className="font-medium">{currencyFormatter.format(financialData.expenses * 0.3)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold">
                      <span>Total Expenses</span>
                      <span>{currencyFormatter.format(financialData.expenses)}</span>
                    </div>
                  </div>
                </div>

                {/* Profit Section */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-blue-600">PROFIT</h4>
                  <div className="space-y-2 pl-4">
                    <div className="flex justify-between">
                      <span>Gross Profit</span>
                      <span className="font-medium">{currencyFormatter.format(financialData.revenue - financialData.expenses * 0.4)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold text-lg">
                      <span>Net Profit</span>
                      <span className="text-green-600">{currencyFormatter.format(financialData.profit)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="balance-sheet" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Balance Sheet</CardTitle>
                  <CardDescription>Statement of assets, liabilities, and equity</CardDescription>
                </div>
                <Button onClick={() => generateReport('balance-sheet')}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Assets */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-blue-600">ASSETS</h4>
                  <div className="space-y-2">
                    <div>
                      <h5 className="font-medium mb-2">Current Assets</h5>
                      <div className="space-y-1 pl-4">
                        <div className="flex justify-between text-sm">
                          <span>Cash & Bank</span>
                          <span>{currencyFormatter.format(1500000)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Accounts Receivable</span>
                          <span>{currencyFormatter.format(800000)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Inventory</span>
                          <span>{currencyFormatter.format(1200000)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium pt-1 border-t">
                          <span>Total Current Assets</span>
                          <span>{currencyFormatter.format(3500000)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h5 className="font-medium mb-2">Fixed Assets</h5>
                      <div className="space-y-1 pl-4">
                        <div className="flex justify-between text-sm">
                          <span>Property & Equipment</span>
                          <span>{currencyFormatter.format(1500000)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t">
                      <span>TOTAL ASSETS</span>
                      <span>{currencyFormatter.format(financialData.assets)}</span>
                    </div>
                  </div>
                </div>

                {/* Liabilities & Equity */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-purple-600">LIABILITIES & EQUITY</h4>
                  <div className="space-y-2">
                    <div>
                      <h5 className="font-medium mb-2">Liabilities</h5>
                      <div className="space-y-1 pl-4">
                        <div className="flex justify-between text-sm">
                          <span>Accounts Payable</span>
                          <span>{currencyFormatter.format(2000000)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium pt-1 border-t">
                          <span>Total Liabilities</span>
                          <span>{currencyFormatter.format(financialData.liabilities)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h5 className="font-medium mb-2">Equity</h5>
                      <div className="space-y-1 pl-4">
                        <div className="flex justify-between text-sm">
                          <span>Owner's Equity</span>
                          <span>{currencyFormatter.format(financialData.equity)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t">
                      <span>TOTAL LIABILITIES & EQUITY</span>
                      <span>{currencyFormatter.format(financialData.assets)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cash-flow" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Cash Flow Statement</CardTitle>
                  <CardDescription>Cash movement from operating, investing, and financing activities</CardDescription>
                </div>
                <Button onClick={() => generateReport('cash-flow')}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Operating Activities */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-green-600">OPERATING ACTIVITIES</h4>
                  <div className="space-y-2 pl-4">
                    <div className="flex justify-between">
                      <span>Cash from Operations</span>
                      <span className="font-medium text-green-600">+{currencyFormatter.format(financialData.cashFlow)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cash Paid for Expenses</span>
                      <span className="font-medium text-red-600">-{currencyFormatter.format(financialData.expenses * 0.8)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold">
                      <span>Net Cash from Operations</span>
                      <span className={financialData.cashFlow - financialData.expenses * 0.8 >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {currencyFormatter.format(financialData.cashFlow - financialData.expenses * 0.8)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Investing Activities */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-blue-600">INVESTING ACTIVITIES</h4>
                  <div className="space-y-2 pl-4">
                    <div className="flex justify-between">
                      <span>Equipment Purchased</span>
                      <span className="font-medium text-red-600">-{currencyFormatter.format(200000)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold">
                      <span>Net Cash from Investing</span>
                      <span className="text-red-600">{currencyFormatter.format(-200000)}</span>
                    </div>
                  </div>
                </div>

                {/* Financing Activities */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-purple-600">FINANCING ACTIVITIES</h4>
                  <div className="space-y-2 pl-4">
                    <div className="flex justify-between">
                      <span>Loan Received</span>
                      <span className="font-medium text-green-600">+{currencyFormatter.format(500000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Loan Repaid</span>
                      <span className="font-medium text-red-600">-{currencyFormatter.format(100000)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold">
                      <span>Net Cash from Financing</span>
                      <span className="text-green-600">{currencyFormatter.format(400000)}</span>
                    </div>
                  </div>
                </div>

                {/* Net Change */}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>NET CHANGE IN CASH</span>
                    <span className="text-green-600">{currencyFormatter.format(financialData.cashFlow)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trial-balance" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Trial Balance</CardTitle>
                  <CardDescription>List of all accounts and their balances</CardDescription>
                </div>
                <Button onClick={() => generateReport('trial-balance')}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 font-medium border-b pb-2">
                  <span>Account</span>
                  <span className="text-right">Debits</span>
                  <span className="text-right">Credits</span>
                </div>
                
                {/* Assets */}
                <div>
                  <h5 className="font-semibold text-blue-600 mb-2">Assets</h5>
                  <div className="space-y-1">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <span>Cash & Bank</span>
                      <span className="text-right">{currencyFormatter.format(1500000)}</span>
                      <span className="text-right">-</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <span>Accounts Receivable</span>
                      <span className="text-right">{currencyFormatter.format(800000)}</span>
                      <span className="text-right">-</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <span>Inventory</span>
                      <span className="text-right">{currencyFormatter.format(1200000)}</span>
                      <span className="text-right">-</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <span>Fixed Assets</span>
                      <span className="text-right">{currencyFormatter.format(1500000)}</span>
                      <span className="text-right">-</span>
                    </div>
                  </div>
                </div>

                {/* Liabilities */}
                <div>
                  <h5 className="font-semibold text-red-600 mb-2">Liabilities</h5>
                  <div className="space-y-1">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <span>Accounts Payable</span>
                      <span className="text-right">-</span>
                      <span className="text-right">{currencyFormatter.format(2000000)}</span>
                    </div>
                  </div>
                </div>

                {/* Equity */}
                <div>
                  <h5 className="font-semibold text-purple-600 mb-2">Equity</h5>
                  <div className="space-y-1">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <span>Owner's Equity</span>
                      <span className="text-right">-</span>
                      <span className="text-right">{currencyFormatter.format(financialData.equity)}</span>
                    </div>
                  </div>
                </div>

                {/* Revenue */}
                <div>
                  <h5 className="font-semibold text-green-600 mb-2">Revenue</h5>
                  <div className="space-y-1">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <span>Sales Revenue</span>
                      <span className="text-right">-</span>
                      <span className="text-right">{currencyFormatter.format(financialData.revenue)}</span>
                    </div>
                  </div>
                </div>

                {/* Expenses */}
                <div>
                  <h5 className="font-semibold text-orange-600 mb-2">Expenses</h5>
                  <div className="space-y-1">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <span>Operating Expenses</span>
                      <span className="text-right">{currencyFormatter.format(financialData.expenses)}</span>
                      <span className="text-right">-</span>
                    </div>
                  </div>
                </div>

                {/* Totals */}
                <div className="border-t pt-2 mt-4">
                  <div className="grid grid-cols-3 gap-4 font-bold">
                    <span>TOTALS</span>
                    <span className="text-right">{currencyFormatter.format(financialData.assets + financialData.expenses)}</span>
                    <span className="text-right">{currencyFormatter.format(financialData.liabilities + financialData.equity + financialData.revenue)}</span>
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