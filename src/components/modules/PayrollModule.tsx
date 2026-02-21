'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { 
  Users, 
  Plus, 
  Clock, 
  Calendar, 
  Download,
  UserCheck,
  CreditCard,
  DollarSign,
  LogIn,
  LogOut
} from 'lucide-react'

interface Employee {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  department: string
  baseSalary: number
  startDate: string
  isActive: boolean
}

interface Attendance {
  id: string
  employeeId: string
  employee: Employee
  date: string
  clockIn?: string
  clockOut?: string
  breakStart?: string
  breakEnd?: string
  totalHours?: number
  overtimeHours?: number
  status: string
  notes?: string
}

interface Payslip {
  id: string
  employeeId: string
  employee: Employee
  payPeriod: string
  baseSalary: number
  overtimePay: number
  deductions: number
  allowances: number
  grossPay: number
  netPay: number
  status: string
  createdAt: string
}

const currencyFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export default function PayrollModule() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [payslips, setPayslips] = useState<Payslip[]>([])
  const [loading, setLoading] = useState(true)
  const [showEmployeeDialog, setShowEmployeeDialog] = useState(false)
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false)
  const [showPayslipDialog, setShowPayslipDialog] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null)

  const [employeeForm, setEmployeeForm] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    baseSalary: 0,
    startDate: ''
  })

  const [attendanceForm, setAttendanceForm] = useState({
    employeeId: '',
    date: '',
    clockIn: '',
    clockOut: '',
    notes: ''
  })

  const [payslipForm, setPayslipForm] = useState({
    employeeId: '',
    payPeriod: '',
    overtimePay: 0,
    deductions: 0,
    allowances: 0
  })

  const departments = ['Front Office', 'Housekeeping', 'Restaurant', 'Kitchen', 'Management', 'Maintenance', 'Security']
  const roles = ['Manager', 'Supervisor', 'Staff', 'Chef', 'Waiter', 'Receptionist', 'Cleaner', 'Security Guard']

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      const mockEmployees: Employee[] = [
        { id: '1', employeeId: 'EMP001', firstName: 'Ahmed', lastName: 'Muhammad', email: 'ahmed@morav.com', phone: '+2348012345678', role: 'Manager', department: 'Management', baseSalary: 150000, startDate: '2023-01-15', isActive: true },
        { id: '2', employeeId: 'EMP002', firstName: 'Fatima', lastName: 'Abubakar', email: 'fatima@morav.com', phone: '+2348023456789', role: 'Receptionist', department: 'Front Office', baseSalary: 80000, startDate: '2023-03-20', isActive: true },
        { id: '3', employeeId: 'EMP003', firstName: 'Ibrahim', lastName: 'Sani', email: 'ibrahim@morav.com', phone: '+2348034567890', role: 'Chef', department: 'Kitchen', baseSalary: 120000, startDate: '2023-02-10', isActive: true }
      ]

      const mockAttendance: Attendance[] = [
        { id: '1', employeeId: '1', employee: mockEmployees[0], date: new Date().toISOString().split('T')[0], clockIn: '08:00', clockOut: '17:00', totalHours: 8, overtimeHours: 0, status: 'Present' },
        { id: '2', employeeId: '2', employee: mockEmployees[1], date: new Date().toISOString().split('T')[0], clockIn: '07:45', clockOut: '16:30', totalHours: 7.75, overtimeHours: 0, status: 'Present' }
      ]

      const mockPayslips: Payslip[] = [
        { id: '1', employeeId: '1', employee: mockEmployees[0], payPeriod: '2024-01', baseSalary: 150000, overtimePay: 5000, deductions: 15000, allowances: 10000, grossPay: 165000, netPay: 150000, status: 'Paid', createdAt: new Date().toISOString() }
      ]

      setEmployees(mockEmployees)
      setAttendance(mockAttendance)
      setPayslips(mockPayslips)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddEmployee = async () => {
    const newEmployee: Employee = { id: Date.now().toString(), ...employeeForm, isActive: true }
    setEmployees([...employees, newEmployee])
    setShowEmployeeDialog(false)
    setEmployeeForm({ employeeId: '', firstName: '', lastName: '', email: '', phone: '', role: '', department: '', baseSalary: 0, startDate: '' })
  }

  const handleClockIn = async () => {
    const employee = employees.find(e => e.id === attendanceForm.employeeId)
    if (!employee) return

    const newAttendance: Attendance = {
      id: Date.now().toString(),
      employeeId: attendanceForm.employeeId,
      employee,
      date: attendanceForm.date,
      clockIn: attendanceForm.clockIn,
      clockOut: attendanceForm.clockOut,
      status: 'Present',
      notes: attendanceForm.notes
    }

    if (attendanceForm.clockIn && attendanceForm.clockOut) {
      const clockIn = new Date(`${attendanceForm.date} ${attendanceForm.clockIn}`)
      const clockOut = new Date(`${attendanceForm.date} ${attendanceForm.clockOut}`)
      const hours = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60)
      newAttendance.totalHours = Math.round(hours * 100) / 100
      newAttendance.overtimeHours = Math.max(0, newAttendance.totalHours - 8)
    }

    setAttendance([...attendance, newAttendance])
    setShowAttendanceDialog(false)
    setAttendanceForm({ employeeId: '', date: '', clockIn: '', clockOut: '', notes: '' })
  }

  const handleGeneratePayslip = async () => {
    const employee = employees.find(e => e.id === payslipForm.employeeId)
    if (!employee) return

    const grossPay = employee.baseSalary + payslipForm.overtimePay + payslipForm.allowances
    const netPay = grossPay - payslipForm.deductions

    const newPayslip: Payslip = {
      id: Date.now().toString(),
      employeeId: payslipForm.employeeId,
      employee,
      payPeriod: payslipForm.payPeriod,
      baseSalary: employee.baseSalary,
      overtimePay: payslipForm.overtimePay,
      deductions: payslipForm.deductions,
      allowances: payslipForm.allowances,
      grossPay,
      netPay,
      status: 'Draft',
      createdAt: new Date().toISOString()
    }

    setPayslips([...payslips, newPayslip])
    setShowPayslipDialog(false)
    setPayslipForm({ employeeId: '', payPeriod: '', overtimePay: 0, deductions: 0, allowances: 0 })
  }

  const handleEditPayslip = (payslip: Payslip) => {
    setSelectedPayslip(payslip)
    setPayslipForm({ employeeId: payslipForm.employeeId, payPeriod: payslip.payPeriod, overtimePay: payslip.overtimePay, deductions: payslip.deductions, allowances: payslip.allowances })
    setShowPayslipDialog(true)
    setEditMode(true)
  }

  const handleUpdatePayslip = async () => {
    if (!selectedPayslip) return
    const employee = employees.find(e => e.id === payslipForm.employeeId)
    if (!employee) return

    const grossPay = employee.baseSalary + payslipForm.overtimePay + payslipForm.allowances
    const netPay = grossPay - payslipForm.deductions

    const updatedPayslips = payslips.map(payslip => 
      payslip.id === selectedPayslip.id ? { ...payslip, employeeId: payslipForm.employeeId, employee, payPeriod: payslipForm.payPeriod, overtimePay: payslipForm.overtimePay, deductions: payslipForm.deductions, allowances: payslipForm.allowances, grossPay, netPay } : payslip
    )
    
    setPayslips(updatedPayslips)
    setShowPayslipDialog(false)
    setEditMode(false)
    setSelectedPayslip(null)
    setPayslipForm({ employeeId: '', payPeriod: '', overtimePay: 0, deductions: 0, allowances: 0 })
  }

  const handleDownloadPayslip = (payslip: Payslip) => {
    const payslipText = `
MORAV RMS - PAYSLIP
==================
Employee: ${payslip.employee.firstName} ${payslip.employee.lastName}
Employee ID: ${payslip.employee.employeeId}
Department: ${payslip.employee.department}
Pay Period: ${payslip.payPeriod}
EARNINGS
--------
Base Salary: ${currencyFormatter.format(payslip.baseSalary)}
Overtime Pay: ${currencyFormatter.format(payslip.overtimePay)}
Allowances: ${currencyFormatter.format(payslip.allowances)}
Gross Pay: ${currencyFormatter.format(payslip.grossPay)}
DEDUCTIONS
----------
Deductions: ${currencyFormatter.format(payslip.deductions)}
Net Pay: ${currencyFormatter.format(payslip.netPay)}
Status: ${payslip.status}
    `.trim()

    const blob = new Blob([payslipText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `payslip_${payslip.employee.employeeId}_${payslip.payPeriod}.txt`
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return 'bg-[#D9F99D] text-emerald-700'
      case 'Absent': return 'bg-red-100 text-red-700'
      case 'Late': return 'bg-yellow-100 text-yellow-700'
      case 'Half-Day': return 'bg-orange-100 text-orange-700'
      case 'Paid': return 'bg-[#D9F99D] text-emerald-700'
      case 'Draft': return 'bg-slate-100 text-slate-700'
      case 'Approved': return 'bg-blue-100 text-blue-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  const activeEmployees = employees.filter(e => e.isActive)
  const todayAttendance = attendance.filter(a => a.date === new Date().toISOString().split('T')[0])
  const totalPayroll = employees.reduce((sum, emp) => sum + emp.baseSalary, 0)

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Employees</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{activeEmployees.length}</p>
              </div>
              <Users className="w-5 h-5 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Present Today</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">{todayAttendance.length}</p>
              </div>
              <UserCheck className="w-5 h-5 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Monthly Payroll</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{currencyFormatter.format(totalPayroll)}</p>
              </div>
              <DollarSign className="w-5 h-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Payslips Generated</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{payslips.length}</p>
              </div>
              <CreditCard className="w-5 h-5 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList className="bg-white p-1 rounded-xl shadow-sm border-0">
          <TabsTrigger value="employees" className="rounded-lg data-[state=active]:bg-[#D9F99D] data-[state=active]:text-slate-900">Employees</TabsTrigger>
          <TabsTrigger value="attendance" className="rounded-lg data-[state=active]:bg-[#D9F99D] data-[state=active]:text-slate-900">Attendance</TabsTrigger>
          <TabsTrigger value="payslips" className="rounded-lg data-[state=active]:bg-[#D9F99D] data-[state=active]:text-slate-900">Payslips</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-900">Employee Management</h3>
            <Dialog open={showEmployeeDialog} onOpenChange={setShowEmployeeDialog}>
              <DialogTrigger asChild>
                <Button className="bg-[#D9F99D] text-slate-900 hover:bg-[#D9F99D]/80">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-slate-900">Add New Employee</DialogTitle>
                  <DialogDescription className="text-slate-500">Register a new employee in the system</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="employeeId" className="text-slate-700">Employee ID</Label>
                      <Input id="employeeId" value={employeeForm.employeeId} onChange={(e) => setEmployeeForm({...employeeForm, employeeId: e.target.value})} className="border-slate-200 focus:border-[#D9F99D] focus:ring-[#D9F99D]" />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-slate-700">Email</Label>
                      <Input id="email" type="email" value={employeeForm.email} onChange={(e) => setEmployeeForm({...employeeForm, email: e.target.value})} className="border-slate-200 focus:border-[#D9F99D] focus:ring-[#D9F99D]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-slate-700">First Name</Label>
                      <Input id="firstName" value={employeeForm.firstName} onChange={(e) => setEmployeeForm({...employeeForm, firstName: e.target.value})} className="border-slate-200 focus:border-[#D9F99D] focus:ring-[#D9F99D]" />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-slate-700">Last Name</Label>
                      <Input id="lastName" value={employeeForm.lastName} onChange={(e) => setEmployeeForm({...employeeForm, lastName: e.target.value})} className="border-slate-200 focus:border-[#D9F99D] focus:ring-[#D9F99D]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-slate-700">Phone</Label>
                      <Input id="phone" value={employeeForm.phone} onChange={(e) => setEmployeeForm({...employeeForm, phone: e.target.value})} className="border-slate-200 focus:border-[#D9F99D] focus:ring-[#D9F99D]" />
                    </div>
                    <div>
                      <Label htmlFor="startDate" className="text-slate-700">Start Date</Label>
                      <Input id="startDate" type="date" value={employeeForm.startDate} onChange={(e) => setEmployeeForm({...employeeForm, startDate: e.target.value})} className="border-slate-200 focus:border-[#D9F99D] focus:ring-[#D9F99D]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="department" className="text-slate-700">Department</Label>
                      <Select value={employeeForm.department} onValueChange={(value) => setEmployeeForm({...employeeForm, department: value})}>
                        <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (<SelectItem key={dept} value={dept}>{dept}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="role" className="text-slate-700">Role</Label>
                      <Select value={employeeForm.role} onValueChange={(value) => setEmployeeForm({...employeeForm, role: value})}>
                        <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (<SelectItem key={role} value={role}>{role}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="baseSalary" className="text-slate-700">Base Salary (₦)</Label>
                    <Input id="baseSalary" type="number" value={employeeForm.baseSalary} onChange={(e) => setEmployeeForm({...employeeForm, baseSalary: parseFloat(e.target.value) || 0})} className="border-slate-200 focus:border-[#D9F99D] focus:ring-[#D9F99D]" />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddEmployee} className="bg-[#D9F99D] text-slate-900 hover:bg-[#D9F99D]/80">Add Employee</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {employees.map((employee) => (
              <Card key={employee.id} className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
                <CardHeader className="pb-3 pt-5 px-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-slate-900">{employee.firstName} {employee.lastName}</CardTitle>
                      <CardDescription className="text-slate-500">{employee.role} • {employee.department} • {employee.employeeId}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={employee.isActive ? 'bg-[#D9F99D] text-emerald-700' : 'bg-slate-100 text-slate-500'}>{employee.isActive ? 'Active' : 'Inactive'}</Badge>
                      <span className="font-bold text-slate-900">{currencyFormatter.format(employee.baseSalary)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-5 pt-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-3">
                    <div><span className="font-medium text-slate-700">Email:</span> <span className="text-slate-500">{employee.email}</span></div>
                    <div><span className="font-medium text-slate-700">Phone:</span> <span className="text-slate-500">{employee.phone}</span></div>
                    <div><span className="font-medium text-slate-700">Start Date:</span> <span className="text-slate-500">{new Date(employee.startDate).toLocaleDateString()}</span></div>
                    <div><span className="font-medium text-slate-700">Status:</span> <span className="text-slate-500">{employee.isActive ? 'Active' : 'Inactive'}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-900">Attendance Management</h3>
            <Dialog open={showAttendanceDialog} onOpenChange={setShowAttendanceDialog}>
              <DialogTrigger asChild>
                <Button className="bg-[#D9F99D] text-slate-900 hover:bg-[#D9F99D]/80">
                  <Clock className="w-4 h-4 mr-2" />
                  Log Attendance
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-slate-900">Log Attendance</DialogTitle>
                  <DialogDescription className="text-slate-500">Record employee clock in/out times</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="employee" className="text-slate-700">Employee</Label>
                    <Select value={attendanceForm.employeeId} onValueChange={(value) => setAttendanceForm({...attendanceForm, employeeId: value})}>
                      <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                      <SelectContent>
                        {employees.filter(e => e.isActive).map((employee) => (<SelectItem key={employee.id} value={employee.id}>{employee.firstName} {employee.lastName} - {employee.employeeId}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="date" className="text-slate-700">Date</Label>
                    <Input id="date" type="date" value={attendanceForm.date} onChange={(e) => setAttendanceForm({...attendanceForm, date: e.target.value})} className="border-slate-200 focus:border-[#D9F99D] focus:ring-[#D9F99D]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clockIn" className="text-slate-700">Clock In</Label>
                      <Input id="clockIn" type="time" value={attendanceForm.clockIn} onChange={(e) => setAttendanceForm({...attendanceForm, clockIn: e.target.value})} className="border-slate-200 focus:border-[#D9F99D] focus:ring-[#D9F99D]" />
                    </div>
                    <div>
                      <Label htmlFor="clockOut" className="text-slate-700">Clock Out</Label>
                      <Input id="clockOut" type="time" value={attendanceForm.clockOut} onChange={(e) => setAttendanceForm({...attendanceForm, clockOut: e.target.value})} className="border-slate-200 focus:border-[#D9F99D] focus:ring-[#D9F99D]" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes" className="text-slate-700">Notes</Label>
                    <Textarea id="notes" placeholder="Any notes..." value={attendanceForm.notes} onChange={(e) => setAttendanceForm({...attendanceForm, notes: e.target.value})} className="border-slate-200 focus:border-[#D9F99D] focus:ring-[#D9F99D]" />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleClockIn} className="bg-[#D9F99D] text-slate-900 hover:bg-[#D9F99D]/80">Log Attendance</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {attendance.map((record) => (
              <Card key={record.id} className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
                <CardHeader className="pb-3 pt-5 px-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base text-slate-900">{record.employee.firstName} {record.employee.lastName}</CardTitle>
                      <CardDescription className="text-slate-500">{record.employee.role} • {record.employee.department}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-5 pt-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-3">
                    <div className="flex items-center"><Calendar className="w-4 h-4 mr-1 text-slate-400" /><span className="text-slate-500">{new Date(record.date).toLocaleDateString()}</span></div>
                    <div className="flex items-center"><LogIn className="w-4 h-4 mr-1 text-slate-400" /><span className="text-slate-500">{record.clockIn || 'Not recorded'}</span></div>
                    <div className="flex items-center"><LogOut className="w-4 h-4 mr-1 text-slate-400" /><span className="text-slate-500">{record.clockOut || 'Not recorded'}</span></div>
                    <div>
                      <span className="font-medium text-slate-700">Hours:</span> <span className="text-slate-500">{record.totalHours || 0}h</span>
                      {record.overtimeHours && record.overtimeHours > 0 && (<span className="text-orange-600 ml-1">(+{record.overtimeHours}h OT)</span>)}
                    </div>
                  </div>
                  {record.notes && (<div className="mt-3 text-sm text-slate-500"><span className="font-medium text-slate-700">Notes:</span> {record.notes}</div>)}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payslips" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-900">Payslip Management</h3>
            <Dialog open={showPayslipDialog} onOpenChange={setShowPayslipDialog}>
              <DialogTrigger asChild>
                <Button className="bg-[#D9F99D] text-slate-900 hover:bg-[#D9F99D]/80">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Generate Payslip
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-slate-900">{editMode ? 'Edit Payslip' : 'Generate Payslip'}</DialogTitle>
                  <DialogDescription className="text-slate-500">{editMode ? 'Update payslip information' : 'Create a payslip for an employee'}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="employee" className="text-slate-700">Employee</Label>
                    <Select value={payslipForm.employeeId} onValueChange={(value) => setPayslipForm({...payslipForm, employeeId: value})}>
                      <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                      <SelectContent>
                        {employees.filter(e => e.isActive).map((employee) => (<SelectItem key={employee.id} value={employee.id}>{employee.firstName} {employee.lastName} - {employee.employeeId}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="payPeriod" className="text-slate-700">Pay Period</Label>
                    <Input id="payPeriod" placeholder="e.g., 2024-01" value={payslipForm.payPeriod} onChange={(e) => setPayslipForm({...payslipForm, payPeriod: e.target.value})} className="border-slate-200 focus:border-[#D9F99D] focus:ring-[#D9F99D]" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="overtimePay" className="text-slate-700">Overtime Pay (₦)</Label>
                      <Input id="overtimePay" type="number" value={payslipForm.overtimePay} onChange={(e) => setPayslipForm({...payslipForm, overtimePay: parseFloat(e.target.value) || 0})} className="border-slate-200 focus:border-[#D9F99D] focus:ring-[#D9F99D]" />
                    </div>
                    <div>
                      <Label htmlFor="allowances" className="text-slate-700">Allowances (₦)</Label>
                      <Input id="allowances" type="number" value={payslipForm.allowances} onChange={(e) => setPayslipForm({...payslipForm, allowances: parseFloat(e.target.value) || 0})} className="border-slate-200 focus:border-[#D9F99D] focus:ring-[#D9F99D]" />
                    </div>
                    <div>
                      <Label htmlFor="deductions" className="text-slate-700">Deductions (₦)</Label>
                      <Input id="deductions" type="number" value={payslipForm.deductions} onChange={(e) => setPayslipForm({...payslipForm, deductions: parseFloat(e.target.value) || 0})} className="border-slate-200 focus:border-[#D9F99D] focus:ring-[#D9F99D]" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={editMode ? handleUpdatePayslip : handleGeneratePayslip} className="bg-[#D9F99D] text-slate-900 hover:bg-[#D9F99D]/80">{editMode ? 'Update Payslip' : 'Generate Payslip'}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {payslips.map((payslip) => (
              <Card key={payslip.id} className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
                <CardHeader className="pb-3 pt-5 px-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base text-slate-900">{payslip.employee.firstName} {payslip.employee.lastName}</CardTitle>
                      <CardDescription className="text-slate-500">{payslip.employee.employeeId} • {payslip.payPeriod}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(payslip.status)}>{payslip.status}</Badge>
                      <span className="font-bold text-slate-900">{currencyFormatter.format(payslip.netPay)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-5 pt-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4 pt-3">
                    <div><span className="font-medium text-slate-700">Base Salary:</span> <span className="text-slate-500">{currencyFormatter.format(payslip.baseSalary)}</span></div>
                    <div><span className="font-medium text-slate-700">Overtime:</span> <span className="text-slate-500">{currencyFormatter.format(payslip.overtimePay)}</span></div>
                    <div><span className="font-medium text-slate-700">Allowances:</span> <span className="text-slate-500">{currencyFormatter.format(payslip.allowances)}</span></div>
                    <div><span className="font-medium text-slate-700">Deductions:</span> <span className="text-slate-500">{currencyFormatter.format(payslip.deductions)}</span></div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <div className="text-lg font-bold text-slate-900">Net Pay: {currencyFormatter.format(payslip.netPay)}</div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100" onClick={() => handleDownloadPayslip(payslip)}>
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="ghost" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100" onClick={() => handleEditPayslip(payslip)}>Edit</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
