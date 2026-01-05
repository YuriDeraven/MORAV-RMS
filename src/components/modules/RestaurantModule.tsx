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
  Utensils, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  ShoppingCart,
  Receipt,
  Send,
  DollarSign,
  Package,
  Users,
  Clock
} from 'lucide-react'

interface MenuItem {
  id: string
  name: string
  description: string
  category: string
  price: number
  isAvailable: boolean
  imageUrl?: string
}

interface OrderItem {
  id: string
  menuItemId: string
  menuItem: MenuItem
  quantity: number
  unitPrice: number
  subtotal: number
}

interface Order {
  id: string
  orderNumber: string
  orderType: string
  status: string
  subtotal: number
  discount: number
  tax: number
  totalAmount: number
  bookingId?: string
  notes?: string
  items: OrderItem[]
  createdAt: string
}

const currencyFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export default function RestaurantModule() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [showMenuItemDialog, setShowMenuItemDialog] = useState(false)
  const [showOrderDialog, setShowOrderDialog] = useState(false)
  const [showBillDialog, setShowBillDialog] = useState(false)
  const [showKitchenDialog, setShowKitchenDialog] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null)

  // Form states
  const [menuItemForm, setMenuItemForm] = useState({
    name: '',
    description: '',
    category: '',
    price: 0,
    isAvailable: true
  })

  const [orderForm, setOrderForm] = useState({
    orderType: 'Dine-In',
    notes: '',
    discount: 0
  })

  const categories = ['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Soups', 'Grills']

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      // Mock data for now
      const mockMenuItems: MenuItem[] = [
        { id: '1', name: 'Jollof Rice', description: 'Classic Nigerian jollof rice', category: 'Main Course', price: 2500, isAvailable: true },
        { id: '2', name: 'Suya', description: 'Spicy grilled meat skewers', category: 'Appetizers', price: 1500, isAvailable: true },
        { id: '3', name: 'Egusi Soup', description: 'Traditional melon seed soup', category: 'Soups', price: 2000, isAvailable: true },
        { id: '4', name: 'Pounded Yam', description: 'Freshly pounded yam', category: 'Main Course', price: 1000, isAvailable: true },
        { id: '5', name: 'Chin Chin', description: 'Sweet crunchy snack', category: 'Desserts', price: 500, isAvailable: false },
        { id: '6', name: 'Zobo Drink', description: 'Hibiscus drink', category: 'Beverages', price: 300, isAvailable: true },
      ]

      const mockOrders: Order[] = [
        {
          id: '1',
          orderNumber: 'ORD001',
          orderType: 'Dine-In',
          status: 'Completed',
          subtotal: 4000,
          discount: 0,
          tax: 200,
          totalAmount: 4200,
          notes: 'Extra spicy please',
          items: [
            { id: '1', menuItemId: '1', menuItem: mockMenuItems[0], quantity: 2, unitPrice: 2500, subtotal: 5000 }
          ],
          createdAt: new Date().toISOString()
        }
      ]

      setMenuItems(mockMenuItems)
      setOrders(mockOrders)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMenuItem = async () => {
    const newMenuItem: MenuItem = {
      id: Date.now().toString(),
      ...menuItemForm
    }
    setMenuItems([...menuItems, newMenuItem])
    setShowMenuItemDialog(false)
    setMenuItemForm({
      name: '',
      description: '',
      category: '',
      price: 0,
      isAvailable: true
    })
  }

  const handleToggleMenuItemAvailability = (itemId: string) => {
    setMenuItems(menuItems.map(item => 
      item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
    ))
  }

  const handleEditMenuItem = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem)
    setMenuItemForm({
      name: menuItem.name,
      description: menuItem.description,
      category: menuItem.category,
      price: menuItem.price,
      isAvailable: menuItem.isAvailable
    })
    setShowMenuItemDialog(true)
    setEditMode(true)
  }

  const handleUpdateMenuItem = async () => {
    if (!selectedMenuItem) return
    
    const updatedMenuItems = menuItems.map(item => 
      item.id === selectedMenuItem.id 
        ? { ...item, ...menuItemForm }
        : item
    )
    
    setMenuItems(updatedMenuItems)
    setShowMenuItemDialog(false)
    setEditMode(false)
    setSelectedMenuItem(null)
    setMenuItemForm({
      name: '',
      description: '',
      category: '',
      price: 0,
      isAvailable: true
    })
  }

  const handleDeleteMenuItem = async (itemId: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      setMenuItems(menuItems.filter(item => item.id !== itemId))
    }
  }

  const handleAddToOrder = (menuItem: MenuItem) => {
    const existingItem = currentOrder.find(item => item.menuItemId === menuItem.id)
    
    if (existingItem) {
      setCurrentOrder(currentOrder.map(item => 
        item.menuItemId === menuItem.id 
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unitPrice }
          : item
      ))
    } else {
      const newItem: OrderItem = {
        id: Date.now().toString(),
        menuItemId: menuItem.id,
        menuItem,
        quantity: 1,
        unitPrice: menuItem.price,
        subtotal: menuItem.price
      }
      setCurrentOrder([...currentOrder, newItem])
    }
  }

  const handleRemoveFromOrder = (itemId: string) => {
    setCurrentOrder(currentOrder.filter(item => item.id !== itemId))
  }

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromOrder(itemId)
      return
    }

    setCurrentOrder(currentOrder.map(item => 
      item.id === itemId 
        ? { ...item, quantity, subtotal: quantity * item.unitPrice }
        : item
    ))
  }

  const calculateOrderTotal = () => {
    const subtotal = currentOrder.reduce((sum, item) => sum + item.subtotal, 0)
    const discount = orderForm.discount
    const tax = subtotal * 0.05 // 5% tax
    const total = subtotal - discount + tax

    return { subtotal, discount, tax, total }
  }

  const handleCreateOrder = async () => {
    const { subtotal, discount, tax, total } = calculateOrderTotal()
    
    const newOrder: Order = {
      id: Date.now().toString(),
      orderNumber: `ORD${Date.now()}`,
      orderType: orderForm.orderType,
      status: 'Pending',
      subtotal,
      discount,
      tax,
      totalAmount: total,
      notes: orderForm.notes,
      items: [...currentOrder],
      createdAt: new Date().toISOString()
    }

    setOrders([...orders, newOrder])
    setCurrentOrder([])
    setOrderForm({
      orderType: 'Dine-In',
      notes: '',
      discount: 0
    })
    setShowOrderDialog(false)
  }

  const handleSendToKitchen = (order: Order) => {
    console.log('Sending to kitchen:', order)
    // In a real app, this would send to a kitchen display system
    alert(`Order ${order.orderNumber} sent to kitchen!`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Preparing': return 'bg-blue-100 text-blue-800'
      case 'Ready': return 'bg-green-100 text-green-800'
      case 'Completed': return 'bg-gray-100 text-gray-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const { subtotal, discount, tax, total } = calculateOrderTotal()

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.status === 'Pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
            <Utensils className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{menuItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {currencyFormatter.format(orders.reduce((sum, o) => sum + o.totalAmount, 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pos">Point of Sale</TabsTrigger>
          <TabsTrigger value="menu">Menu Management</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="pos" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Menu Items Grid */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Menu Items</CardTitle>
                  <CardDescription>Click items to add to current order</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories.map((category) => (
                      <div key={category}>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-2">{category}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {menuItems
                            .filter(item => item.category === category)
                            .map((item) => (
                              <Card 
                                key={item.id} 
                                className={`cursor-pointer transition-all hover:shadow-md ${
                                  !item.isAvailable ? 'opacity-50' : ''
                                }`}
                                onClick={() => item.isAvailable && handleAddToOrder(item)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <h5 className="font-medium text-sm">{item.name}</h5>
                                    <Badge variant={item.isAvailable ? "default" : "secondary"}>
                                      {item.isAvailable ? 'Available' : 'Hidden'}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                                  <div className="font-bold text-sm">{currencyFormatter.format(item.price)}</div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Current Order */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Current Order</CardTitle>
                  <CardDescription>
                    {currentOrder.length} items • {currencyFormatter.format(total)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="orderType">Order Type</Label>
                      <Select value={orderForm.orderType} onValueChange={(value) => setOrderForm({...orderForm, orderType: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Dine-In">Dine-In</SelectItem>
                          <SelectItem value="Takeaway">Takeaway</SelectItem>
                          <SelectItem value="Room-Service">Room Service</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <ScrollArea className="h-64">
                      <div className="space-y-2">
                        {currentOrder.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex-1">
                              <div className="font-medium text-sm">{item.menuItem.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {currencyFormatter.format(item.unitPrice)} x {item.quantity}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              >
                                -
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleRemoveFromOrder(item.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>{currencyFormatter.format(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Discount:</span>
                        <span>-{currencyFormatter.format(discount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax (5%):</span>
                        <span>{currencyFormatter.format(tax)}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>{currencyFormatter.format(total)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Order notes..."
                        value={orderForm.notes}
                        onChange={(e) => setOrderForm({...orderForm, notes: e.target.value})}
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        className="flex-1"
                        onClick={handleCreateOrder}
                        disabled={currentOrder.length === 0}
                      >
                        <Receipt className="w-4 h-4 mr-2" />
                        Create Order
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setCurrentOrder([])}
                        disabled={currentOrder.length === 0}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="menu" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Menu Management</h3>
            <Dialog open={showMenuItemDialog} onOpenChange={setShowMenuItemDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Menu Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editMode ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
                  <DialogDescription>
                    {editMode ? 'Update menu item information' : 'Add a new item to the restaurant menu'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="name">Item Name</Label>
                    <Input
                      id="name"
                      value={menuItemForm.name}
                      onChange={(e) => setMenuItemForm({...menuItemForm, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={menuItemForm.description}
                      onChange={(e) => setMenuItemForm({...menuItemForm, description: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={menuItemForm.category} onValueChange={(value) => setMenuItemForm({...menuItemForm, category: value})}>
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
                  <div>
                    <Label htmlFor="price">Price (₦)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={menuItemForm.price || ''}
                      onChange={(e) => setMenuItemForm({...menuItemForm, price: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={editMode ? handleUpdateMenuItem : handleAddMenuItem}>
                    {editMode ? 'Update Item' : 'Add Item'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {menuItems.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{item.name}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={item.isAvailable ? "default" : "secondary"}>
                        {item.isAvailable ? 'Available' : 'Hidden'}
                      </Badge>
                      <span className="font-bold">{currencyFormatter.format(item.price)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">{item.category}</Badge>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleToggleMenuItemAvailability(item.id)}
                      >
                        {item.isAvailable ? 'Hide' : 'Show'}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEditMenuItem(item)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteMenuItem(item.id)}>
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="grid gap-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Order #{order.orderNumber}</CardTitle>
                      <CardDescription>
                        {order.orderType} • {new Date(order.createdAt).toLocaleString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <span className="font-bold">{currencyFormatter.format(order.totalAmount)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">Order Items:</h5>
                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.menuItem.name} x {item.quantity}</span>
                            <span>{currencyFormatter.format(item.subtotal)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {order.notes && (
                      <div>
                        <h5 className="font-medium mb-1">Notes:</h5>
                        <p className="text-sm text-muted-foreground">{order.notes}</p>
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedOrder(order)
                          setShowBillDialog(true)
                        }}
                      >
                        <Receipt className="w-4 h-4 mr-1" />
                        Bill
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedOrder(order)
                          setShowKitchenDialog(true)
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Kitchen
                      </Button>
                      {order.status === 'Pending' && (
                        <Button 
                          size="sm"
                          onClick={() => handleSendToKitchen(order)}
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Send to Kitchen
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Bill Dialog */}
      <Dialog open={showBillDialog} onOpenChange={setShowBillDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order Bill</DialogTitle>
            <DialogDescription>
              Order #{selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="space-y-2">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.menuItem.name} x {item.quantity}</span>
                    <span>{currencyFormatter.format(item.subtotal)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{currencyFormatter.format(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Discount:</span>
                  <span>-{currencyFormatter.format(selectedOrder.discount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>{currencyFormatter.format(selectedOrder.tax)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>{currencyFormatter.format(selectedOrder.totalAmount)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Kitchen Dialog */}
      <Dialog open={showKitchenDialog} onOpenChange={setShowKitchenDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Kitchen Order</DialogTitle>
            <DialogDescription>
              Order #{selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h5 className="font-medium">Items to Prepare:</h5>
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm p-2 border rounded">
                    <span>{item.menuItem.name}</span>
                    <span className="font-medium">x {item.quantity}</span>
                  </div>
                ))}
              </div>
              {selectedOrder.notes && (
                <div>
                  <h5 className="font-medium mb-1">Special Instructions:</h5>
                  <p className="text-sm text-muted-foreground bg-yellow-50 p-2 rounded">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}