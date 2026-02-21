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
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Package, 
  Plus, 
  TrendingDown, 
  AlertTriangle, 
  ArrowUp,
  ArrowDown,
  Truck,
  ShoppingCart,
  BarChart3
} from 'lucide-react'

interface InventoryItem {
  id: string
  name: string
  description: string
  category: string
  unit: string
  currentStock: number
  minStockLevel: number
  unitCost: number
  supplier?: string
}

interface StockMovement {
  id: string
  itemId: string
  item: InventoryItem
  movementType: string
  quantity: number
  unitCost?: number
  reason?: string
  reference?: string
  createdAt: string
}

const currencyFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export default function InventoryModule() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([])
  const [loading, setLoading] = useState(true)
  const [showItemDialog, setShowItemDialog] = useState(false)
  const [showStockInDialog, setShowStockInDialog] = useState(false)
  const [showStockOutDialog, setShowStockOutDialog] = useState(false)

  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    category: '',
    unit: '',
    minStockLevel: 0,
    unitCost: 0,
    supplier: ''
  })

  const [stockInForm, setStockInForm] = useState({
    itemId: '',
    quantity: 0,
    unitCost: 0,
    reason: '',
    supplier: ''
  })

  const [stockOutForm, setStockOutForm] = useState({
    itemId: '',
    quantity: 0,
    reason: '',
    reference: ''
  })

  const categories = ['Food', 'Beverages', 'Cleaning Supplies', 'Linens', 'Utensils', 'Electronics']

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      const mockItems: InventoryItem[] = [
        { id: '1', name: 'Rice', description: 'Long grain parboiled rice', category: 'Food', unit: 'kg', currentStock: 45, minStockLevel: 20, unitCost: 500, supplier: 'Farmers Ltd' },
        { id: '2', name: 'Cooking Oil', description: 'Vegetable cooking oil', category: 'Food', unit: 'liters', currentStock: 8, minStockLevel: 10, unitCost: 800, supplier: 'Oil Co' },
        { id: '3', name: 'Chicken', description: 'Frozen chicken pieces', category: 'Food', unit: 'kg', currentStock: 25, minStockLevel: 15, unitCost: 1200, supplier: 'Poultry Farm' },
        { id: '4', name: 'Tomatoes', description: 'Fresh tomatoes', category: 'Food', unit: 'kg', currentStock: 12, minStockLevel: 10, unitCost: 300, supplier: 'Local Market' },
        { id: '5', name: 'Soft Drinks', description: 'Assorted soft drinks', category: 'Beverages', unit: 'crates', currentStock: 5, minStockLevel: 8, unitCost: 1500, supplier: 'Beverage Co' },
      ]

      const mockMovements: StockMovement[] = [
        { id: '1', itemId: '1', item: mockItems[0], movementType: 'Stock-In', quantity: 50, unitCost: 500, reason: 'Regular purchase', reference: 'PO001', createdAt: new Date().toISOString() },
        { id: '2', itemId: '2', item: mockItems[1], movementType: 'Stock-Out', quantity: 5, reason: 'Kitchen usage', reference: 'ORD001', createdAt: new Date().toISOString() }
      ]

      setInventoryItems(mockItems)
      setStockMovements(mockMovements)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async () => {
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: itemForm.name,
      description: itemForm.description,
      category: itemForm.category,
      unit: itemForm.unit,
      currentStock: 0,
      minStockLevel: itemForm.minStockLevel,
      unitCost: itemForm.unitCost,
      supplier: itemForm.supplier
    }

    setInventoryItems([...inventoryItems, newItem])
    setShowItemDialog(false)
    setItemForm({ name: '', description: '', category: '', unit: '', minStockLevel: 0, unitCost: 0, supplier: '' })
  }

  const handleStockIn = async () => {
    const item = inventoryItems.find(i => i.id === stockInForm.itemId)
    if (!item) return

    const updatedItem = { ...item, currentStock: item.currentStock + stockInForm.quantity }

    const newMovement: StockMovement = {
      id: Date.now().toString(),
      itemId: stockInForm.itemId,
      item: updatedItem,
      movementType: 'Stock-In',
      quantity: stockInForm.quantity,
      unitCost: stockInForm.unitCost,
      reason: stockInForm.reason,
      reference: `PO${Date.now()}`,
      createdAt: new Date().toISOString()
    }

    setInventoryItems(inventoryItems.map(i => i.id === stockInForm.itemId ? updatedItem : i))
    setStockMovements([newMovement, ...stockMovements])
    setShowStockInDialog(false)
    setStockInForm({ itemId: '', quantity: 0, unitCost: 0, reason: '', supplier: '' })
  }

  const handleStockOut = async () => {
    const item = inventoryItems.find(i => i.id === stockOutForm.itemId)
    if (!item || item.currentStock < stockOutForm.quantity) return

    const updatedItem = { ...item, currentStock: item.currentStock - stockOutForm.quantity }

    const newMovement: StockMovement = {
      id: Date.now().toString(),
      itemId: stockOutForm.itemId,
      item: updatedItem,
      movementType: 'Stock-Out',
      quantity: stockOutForm.quantity,
      reason: stockOutForm.reason,
      reference: stockOutForm.reference,
      createdAt: new Date().toISOString()
    }

    setInventoryItems(inventoryItems.map(i => i.id === stockOutForm.itemId ? updatedItem : i))
    setStockMovements([newMovement, ...stockMovements])
    setShowStockOutDialog(false)
    setStockOutForm({ itemId: '', quantity: 0, reason: '', reference: '' })
  }

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minStockLevel) {
      return { color: 'bg-red-100 text-red-700', label: 'Low Stock', icon: AlertTriangle }
    } else if (item.currentStock <= item.minStockLevel * 1.5) {
      return { color: 'bg-yellow-100 text-yellow-700', label: 'Re-order Soon', icon: TrendingDown }
    } else {
      return { color: 'bg-[#D9F99D] text-emerald-700', label: 'In Stock', icon: Package }
    }
  }

  const getMovementIcon = (type: string) => {
    return type === 'Stock-In' ? ArrowUp : ArrowDown
  }

  const getMovementColor = (type: string) => {
    return type === 'Stock-In' ? 'text-emerald-600' : 'text-red-600'
  }

  const lowStockItems = inventoryItems.filter(item => item.currentStock <= item.minStockLevel)
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0)

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
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Items</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{inventoryItems.length}</p>
              </div>
              <Package className="w-5 h-5 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Low Stock Items</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{lowStockItems.length}</p>
              </div>
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Value</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{currencyFormatter.format(totalValue)}</p>
              </div>
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Today's Movements</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">{stockMovements.length}</p>
              </div>
              <Truck className="w-5 h-5 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="rounded-2xl border-0 shadow-sm bg-red-50">
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-red-800 flex items-center text-base">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Low Stock Alert
            </CardTitle>
            <CardDescription className="text-red-600">The following items need to be restocked urgently</CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="grid gap-2">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded-xl border-0 shadow-sm">
                  <div>
                    <span className="font-medium text-slate-900">{item.name}</span>
                    <span className="text-sm text-slate-500 ml-2">({item.currentStock} {item.unit})</span>
                  </div>
                  <Badge variant="destructive" className="bg-red-100 text-red-700">Below {item.minStockLevel} {item.unit}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList className="bg-white p-1 rounded-xl shadow-sm border-0">
          <TabsTrigger value="inventory" className="rounded-lg data-[state=active]:bg-[#D9F99D] data-[state=active]:text-slate-900">Inventory Items</TabsTrigger>
          <TabsTrigger value="movements" className="rounded-lg data-[state=active]:bg-[#D9F99D] data-[state=active]:text-slate-900">Stock Movements</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-900">Inventory Management</h3>
            <div className="flex space-x-2">
              <Dialog open={showStockInDialog} onOpenChange={setShowStockInDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-[#D9F99D] text-slate-900 hover:bg-[#D9F99D]/80">
                    <ArrowUp className="w-4 h-4 mr-2" />
                    Stock In
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-slate-900">Stock In</DialogTitle>
                    <DialogDescription className="text-slate-500">Add new inventory items to stock</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="item" className="text-slate-700">Item</Label>
                      <Select value={stockInForm.itemId} onValueChange={(value) => setStockInForm({...stockInForm, itemId: value})}>
                        <SelectTrigger><SelectValue placeholder="Select item" /></SelectTrigger>
                        <SelectContent>
                          {inventoryItems.map((item) => (<SelectItem key={item.id} value={item.id}>{item.name} ({item.currentStock} {item.unit})</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="quantity" className="text-slate-700">Quantity</Label>
                        <Input id="quantity" type="number" value={stockInForm.quantity || ''} onChange={(e) => setStockInForm({...stockInForm, quantity: parseFloat(e.target.value) || 0})} className="border-slate-200 focus:border-[#D9F99D] focus:ring-[#D9F99D]" />
                      </div>
                      <div>
                        <Label htmlFor="unitCost" className="text-slate-700">Unit Cost (₦)</Label>
                        <Input id="unitCost" type="number" value={stockInForm.unitCost} onChange={(e) => setStockInForm({...stockInForm, unitCost: parseFloat(e.target.value) || 0})} className="border-slate-200 focus:border-[#D9F99D] focus:ring-[#D9F99D]" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="reason" className="text-slate-700">Reason</Label>
                      <Textarea id="reason" placeholder="Reason for stock in..." value={stockInForm.reason} onChange={(e) => setStockInForm({...stockInForm, reason: e.target.value})} className="border-slate-200 focus:border-[#D9F99D] focus:ring-[#D9F99D]" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleStockIn} className="bg-[#D9F99D] text-slate-900 hover:bg-[#D9F99D]/80">Add Stock</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={showStockOutDialog} onOpenChange={setShowStockOutDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-slate-200">
                    <ArrowDown className="w-4 h-4 mr-2" />
                    Stock Out
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-slate-900">Stock Out</DialogTitle>
                    <DialogDescription className="text-slate-500">Remove items from inventory</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="item" className="text-slate-700">Item</Label>
                      <Select value={stockOutForm.itemId} onValueChange={(value) => setStockOutForm({...stockOutForm, itemId: value})}>
                        <SelectTrigger><SelectValue placeholder="Select item" /></SelectTrigger>
                        <SelectContent>
                          {inventoryItems.map((item) => (<SelectItem key={item.id} value={item.id}>{item.name} ({item.currentStock} {item.unit})</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="quantity" className="text-slate-700">Quantity</Label>
                      <Input id="quantity" type="number" value={stockOutForm.quantity || ''} onChange={(e) => setStockOutForm({...stockOutForm, quantity: parseFloat(e.target.value) || 0})} className="border-slate-200 focus:border-[#D9F99D] focus:ring-[#D9F99D]" />
                    </div>
                    <div>
                      <Label htmlFor="reason" className="text-slate-700">Reason</Label>
                      <Textarea id="reason" placeholder="Reason for stock out..." value={stockOutForm.reason} onChange={(e) => setStockOutForm({...stockOutForm, reason: e.target.value})} className="border-slate-200 focus:border-[#D9F99D] focus:ring-[#D9F99D]" />
                    </div>
                    <div>
                      <Label htmlFor="reference" className="text-slate-700">Reference (Optional)</Label>
                      <Input id="reference" placeholder="Order number or reference..." value={stockOutForm.reference} onChange={(e) => setStockOutForm({...stockOutForm, reference: e.target.value})} className="border-slate-200 focus:border-[#D9F99D] focus:ring-[#D9F99D]" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleStockOut} className="bg-[#D9F99D] text-slate-900 hover:bg-[#D9F99D]/80">Remove Stock</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-slate-200">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-slate-900">Add Inventory Item</DialogTitle>
                    <DialogDescription className="text-slate-500">Add a new item to the inventory</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-slate-700">Item Name</Label>
                        <Input id="name" value={itemForm.name} onChange={(e) => setItemForm({...itemForm, name: e.target.value})} className="border-slate-200 focus:border-[#D9F99D] focus:ring-[#D9F99D]" />
                      </div>
                      <div>
                        <Label htmlFor="category" className="text-slate-700">Category</Label>
                        <Select value={itemForm.category} onValueChange={(value) => setItemForm({...itemForm, category: value})}>
                          <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (<SelectItem key={category} value={category}>{category}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-slate-700">Description</Label>
                      <Textarea id="description" value={itemForm.description} onChange={(e) => setItemForm({...itemForm, description: e.target.value})} className="border-slate-200 focus:border-[#D9F99D] focus:ring-[#D9F99D]" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="unit" className="text-slate-700">Unit</Label>
                        <Input id="unit" placeholder="e.g., kg, liters" value={itemForm.unit} onChange={(e) => setItemForm({...itemForm, unit: e.target.value})} className="border-slate-200 focus:border-[#D9F99D] focus:ring-[#D9F99D]" />
                      </div>
                      <div>
                        <Label htmlFor="minStock" className="text-slate-700">Min Stock Level</Label>
                        <Input id="minStock" type="number" value={itemForm.minStockLevel} onChange={(e) => setItemForm({...itemForm, minStockLevel: parseFloat(e.target.value) || 0})} className="border-slate-200 focus:border-[#D9F99D] focus:ring-[#D9F99D]" />
                      </div>
                      <div>
                        <Label htmlFor="unitCost" className="text-slate-700">Unit Cost (₦)</Label>
                        <Input id="unitCost" type="number" value={itemForm.unitCost} onChange={(e) => setItemForm({...itemForm, unitCost: parseFloat(e.target.value) || 0})} className="border-slate-200 focus:border-[#D9F99D] focus:ring-[#D9F99D]" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="supplier" className="text-slate-700">Supplier</Label>
                      <Input id="supplier" value={itemForm.supplier} onChange={(e) => setItemForm({...itemForm, supplier: e.target.value})} className="border-slate-200 focus:border-[#D9F99D] focus:ring-[#D9F99D]" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddItem} className="bg-[#D9F99D] text-slate-900 hover:bg-[#D9F99D]/80">Add Item</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid gap-4">
            {inventoryItems.map((item) => {
              const status = getStockStatus(item)
              const StatusIcon = status.icon
              
              return (
                <Card key={item.id} className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
                  <CardHeader className="pb-3 pt-5 px-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-slate-900">{item.name}</CardTitle>
                        <CardDescription className="text-slate-500">{item.description}</CardDescription>
                      </div>
                      <Badge className={`${status.color} flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="px-5 pb-5 pt-0">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm pt-3">
                      <div><span className="font-medium text-slate-700">Category:</span> <span className="text-slate-500">{item.category}</span></div>
                      <div><span className="font-medium text-slate-700">Current Stock:</span> <span className="text-slate-500">{item.currentStock} {item.unit}</span></div>
                      <div><span className="font-medium text-slate-700">Min Level:</span> <span className="text-slate-500">{item.minStockLevel} {item.unit}</span></div>
                      <div><span className="font-medium text-slate-700">Unit Cost:</span> <span className="text-slate-500">{currencyFormatter.format(item.unitCost)}</span></div>
                      <div><span className="font-medium text-slate-700">Total Value:</span> <span className="text-slate-500">{currencyFormatter.format(item.currentStock * item.unitCost)}</span></div>
                    </div>
                    {item.supplier && (<div className="mt-3 text-sm"><span className="font-medium text-slate-700">Supplier:</span> <span className="text-slate-500">{item.supplier}</span></div>)}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-900">Stock Movements</h3>
            <Badge variant="outline" className="border-slate-200 text-slate-500">{stockMovements.length} movements today</Badge>
          </div>

          <div className="grid gap-4">
            {stockMovements.map((movement) => {
              const MovementIcon = getMovementIcon(movement.movementType)
              
              return (
                <Card key={movement.id} className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
                  <CardHeader className="pb-3 pt-5 px-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base text-slate-900 flex items-center">
                          <MovementIcon className={`w-5 h-5 mr-2 ${getMovementColor(movement.movementType)}`} />
                          {movement.movementType}
                        </CardTitle>
                        <CardDescription className="text-slate-500">{movement.item.name} • {new Date(movement.createdAt).toLocaleString()}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold text-lg ${getMovementColor(movement.movementType)}`}>
                          {movement.movementType === 'Stock-In' ? '+' : '-'}{movement.quantity} {movement.item.unit}
                        </div>
                        {movement.unitCost && (<div className="text-sm text-slate-500">{currencyFormatter.format(movement.quantity * movement.unitCost)}</div>)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-5 pb-5 pt-0">
                    <div className="space-y-2 pt-2">
                      {movement.reason && (<div className="text-sm"><span className="font-medium text-slate-700">Reason:</span> <span className="text-slate-500">{movement.reason}</span></div>)}
                      {movement.reference && (<div className="text-sm"><span className="font-medium text-slate-700">Reference:</span> <span className="text-slate-500">{movement.reference}</span></div>)}
                      <div className="text-sm"><span className="font-medium text-slate-700">New Stock Level:</span> <span className="text-slate-500">{movement.item.currentStock} {movement.item.unit}</span></div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
