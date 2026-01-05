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

  // Form states
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
      // Mock data
      const mockItems: InventoryItem[] = [
        { 
          id: '1', 
          name: 'Rice', 
          description: 'Long grain parboiled rice', 
          category: 'Food', 
          unit: 'kg', 
          currentStock: 45, 
          minStockLevel: 20, 
          unitCost: 500,
          supplier: 'Farmers Ltd'
        },
        { 
          id: '2', 
          name: 'Cooking Oil', 
          description: 'Vegetable cooking oil', 
          category: 'Food', 
          unit: 'liters', 
          currentStock: 8, 
          minStockLevel: 10, 
          unitCost: 800,
          supplier: 'Oil Co'
        },
        { 
          id: '3', 
          name: 'Chicken', 
          description: 'Frozen chicken pieces', 
          category: 'Food', 
          unit: 'kg', 
          currentStock: 25, 
          minStockLevel: 15, 
          unitCost: 1200,
          supplier: 'Poultry Farm'
        },
        { 
          id: '4', 
          name: 'Tomatoes', 
          description: 'Fresh tomatoes', 
          category: 'Food', 
          unit: 'kg', 
          currentStock: 12, 
          minStockLevel: 10, 
          unitCost: 300,
          supplier: 'Local Market'
        },
        { 
          id: '5', 
          name: 'Soft Drinks', 
          description: 'Assorted soft drinks', 
          category: 'Beverages', 
          unit: 'crates', 
          currentStock: 5, 
          minStockLevel: 8, 
          unitCost: 1500,
          supplier: 'Beverage Co'
        },
      ]

      const mockMovements: StockMovement[] = [
        {
          id: '1',
          itemId: '1',
          item: mockItems[0],
          movementType: 'Stock-In',
          quantity: 50,
          unitCost: 500,
          reason: 'Regular purchase',
          reference: 'PO001',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          itemId: '2',
          item: mockItems[1],
          movementType: 'Stock-Out',
          quantity: 5,
          reason: 'Kitchen usage',
          reference: 'ORD001',
          createdAt: new Date().toISOString()
        }
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
    setItemForm({
      name: '',
      description: '',
      category: '',
      unit: '',
      minStockLevel: 0,
      unitCost: 0,
      supplier: ''
    })
  }

  const handleStockIn = async () => {
    const item = inventoryItems.find(i => i.id === stockInForm.itemId)
    if (!item) return

    const updatedItem = {
      ...item,
      currentStock: item.currentStock + stockInForm.quantity
    }

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
    setStockInForm({
      itemId: '',
      quantity: 0,
      unitCost: 0,
      reason: '',
      supplier: ''
    })
  }

  const handleStockOut = async () => {
    const item = inventoryItems.find(i => i.id === stockOutForm.itemId)
    if (!item || item.currentStock < stockOutForm.quantity) return

    const updatedItem = {
      ...item,
      currentStock: item.currentStock - stockOutForm.quantity
    }

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
    setStockOutForm({
      itemId: '',
      quantity: 0,
      reason: '',
      reference: ''
    })
  }

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minStockLevel) {
      return { color: 'bg-red-100 text-red-800', label: 'Low Stock', icon: AlertTriangle }
    } else if (item.currentStock <= item.minStockLevel * 1.5) {
      return { color: 'bg-yellow-100 text-yellow-800', label: 'Re-order Soon', icon: TrendingDown }
    } else {
      return { color: 'bg-green-100 text-green-800', label: 'In Stock', icon: Package }
    }
  }

  const getMovementIcon = (type: string) => {
    return type === 'Stock-In' ? ArrowUp : ArrowDown
  }

  const getMovementColor = (type: string) => {
    return type === 'Stock-In' ? 'text-green-600' : 'text-red-600'
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowStockItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {currencyFormatter.format(totalValue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Movements</CardTitle>
            <Truck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stockMovements.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Low Stock Alert
            </CardTitle>
            <CardDescription>
              The following items need to be restocked urgently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-2 bg-white rounded border">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({item.currentStock} {item.unit})
                    </span>
                  </div>
                  <Badge variant="destructive">
                    Below {item.minStockLevel} {item.unit}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory Items</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Inventory Management</h3>
            <div className="flex space-x-2">
              <Dialog open={showStockInDialog} onOpenChange={setShowStockInDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <ArrowUp className="w-4 h-4 mr-2" />
                    Stock In
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Stock In</DialogTitle>
                    <DialogDescription>
                      Add new inventory items to stock
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="item">Item</Label>
                      <Select value={stockInForm.itemId} onValueChange={(value) => setStockInForm({...stockInForm, itemId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select item" />
                        </SelectTrigger>
                        <SelectContent>
                          {inventoryItems.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name} ({item.currentStock} {item.unit})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={stockInForm.quantity || ''}
                          onChange={(e) => setStockInForm({...stockInForm, quantity: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="unitCost">Unit Cost (₦)</Label>
                        <Input
                          id="unitCost"
                          type="number"
                          value={stockInForm.unitCost}
                          onChange={(e) => setStockInForm({...stockInForm, unitCost: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="reason">Reason</Label>
                      <Textarea
                        id="reason"
                        placeholder="Reason for stock in..."
                        value={stockInForm.reason}
                        onChange={(e) => setStockInForm({...stockInForm, reason: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleStockIn}>Add Stock</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={showStockOutDialog} onOpenChange={setShowStockOutDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <ArrowDown className="w-4 h-4 mr-2" />
                    Stock Out
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Stock Out</DialogTitle>
                    <DialogDescription>
                      Remove items from inventory
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="item">Item</Label>
                      <Select value={stockOutForm.itemId} onValueChange={(value) => setStockOutForm({...stockOutForm, itemId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select item" />
                        </SelectTrigger>
                        <SelectContent>
                          {inventoryItems.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name} ({item.currentStock} {item.unit})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={stockOutForm.quantity || ''}
                        onChange={(e) => setStockOutForm({...stockOutForm, quantity: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="reason">Reason</Label>
                      <Textarea
                        id="reason"
                        placeholder="Reason for stock out..."
                        value={stockOutForm.reason}
                        onChange={(e) => setStockOutForm({...stockOutForm, reason: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="reference">Reference (Optional)</Label>
                      <Input
                        id="reference"
                        placeholder="Order number or reference..."
                        value={stockOutForm.reference}
                        onChange={(e) => setStockOutForm({...stockOutForm, reference: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleStockOut}>Remove Stock</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Inventory Item</DialogTitle>
                    <DialogDescription>
                      Add a new item to the inventory
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Item Name</Label>
                        <Input
                          id="name"
                          value={itemForm.name}
                          onChange={(e) => setItemForm({...itemForm, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={itemForm.category} onValueChange={(value) => setItemForm({...itemForm, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={itemForm.description}
                        onChange={(e) => setItemForm({...itemForm, description: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="unit">Unit</Label>
                        <Input
                          id="unit"
                          placeholder="e.g., kg, liters, pieces"
                          value={itemForm.unit}
                          onChange={(e) => setItemForm({...itemForm, unit: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="minStock">Min Stock Level</Label>
                        <Input
                          id="minStock"
                          type="number"
                          value={itemForm.minStockLevel}
                          onChange={(e) => setItemForm({...itemForm, minStockLevel: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="unitCost">Unit Cost (₦)</Label>
                        <Input
                          id="unitCost"
                          type="number"
                          value={itemForm.unitCost}
                          onChange={(e) => setItemForm({...itemForm, unitCost: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="supplier">Supplier</Label>
                      <Input
                        id="supplier"
                        value={itemForm.supplier}
                        onChange={(e) => setItemForm({...itemForm, supplier: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddItem}>Add Item</Button>
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
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{item.name}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </div>
                      <Badge className={status.color}>
                        <StatusIcon className="w-4 h-4 mr-1" />
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Category:</span> {item.category}
                      </div>
                      <div>
                        <span className="font-medium">Current Stock:</span> {item.currentStock} {item.unit}
                      </div>
                      <div>
                        <span className="font-medium">Min Level:</span> {item.minStockLevel} {item.unit}
                      </div>
                      <div>
                        <span className="font-medium">Unit Cost:</span> {currencyFormatter.format(item.unitCost)}
                      </div>
                      <div>
                        <span className="font-medium">Total Value:</span> {currencyFormatter.format(item.currentStock * item.unitCost)}
                      </div>
                    </div>
                    {item.supplier && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Supplier:</span> {item.supplier}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Stock Movements</h3>
            <Badge variant="outline">
              {stockMovements.length} movements today
            </Badge>
          </div>

          <div className="grid gap-4">
            {stockMovements.map((movement) => {
              const MovementIcon = getMovementIcon(movement.movementType)
              
              return (
                <Card key={movement.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          <MovementIcon className={`w-5 h-5 mr-2 ${getMovementColor(movement.movementType)}`} />
                          {movement.movementType}
                        </CardTitle>
                        <CardDescription>
                          {movement.item.name} • {new Date(movement.createdAt).toLocaleString()}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${getMovementColor(movement.movementType)}`}>
                          {movement.movementType === 'Stock-In' ? '+' : '-'}{movement.quantity} {movement.item.unit}
                        </div>
                        {movement.unitCost && (
                          <div className="text-sm text-muted-foreground">
                            {currencyFormatter.format(movement.quantity * movement.unitCost)}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {movement.reason && (
                        <div className="text-sm">
                          <span className="font-medium">Reason:</span> {movement.reason}
                        </div>
                      )}
                      {movement.reference && (
                        <div className="text-sm">
                          <span className="font-medium">Reference:</span> {movement.reference}
                        </div>
                      )}
                      <div className="text-sm">
                        <span className="font-medium">New Stock Level:</span> {movement.item.currentStock} {movement.item.unit}
                      </div>
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