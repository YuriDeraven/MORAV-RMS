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
  Bed, 
  UserPlus, 
  Calendar, 
  CreditCard, 
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users
} from 'lucide-react'

interface Room {
  id: string
  roomNumber: string
  roomType: string
  floor: string
  capacity: number
  baseRate: number
  status: string
}

interface Guest {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  idNumber: string
  nationality: string
}

interface Booking {
  id: string
  bookingNumber: string
  guest: Guest
  room: Room
  checkInDate: string
  checkOutDate: string
  adults: number
  children: number
  totalAmount: number
  status: string
}

const currencyFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export default function FrontOfficeModule() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [guests, setGuests] = useState<Guest[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [showGuestDialog, setShowGuestDialog] = useState(false)
  const [showBookingDialog, setShowBookingDialog] = useState(false)
  const [showRoomDialog, setShowRoomDialog] = useState(false)
  const [showViewGuestDialog, setShowViewGuestDialog] = useState(false)
  const [editMode, setEditMode] = useState(false)

  // Form states
  const [guestForm, setGuestForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    idNumber: '',
    nationality: ''
  })

  const [bookingForm, setBookingForm] = useState({
    guestId: '',
    roomId: '',
    checkInDate: '',
    checkOutDate: '',
    adults: 1,
    children: 0
  })

  const [roomForm, setRoomForm] = useState({
    roomNumber: '',
    roomType: '',
    floor: '',
    capacity: 2,
    baseRate: 0,
    status: 'Vacant'
  })

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      // Mock data for now - will be replaced with API calls
      const mockRooms: Room[] = [
        { id: '1', roomNumber: '101', roomType: 'Standard', floor: '1', capacity: 2, baseRate: 15000, status: 'Vacant' },
        { id: '2', roomNumber: '102', roomType: 'Standard', floor: '1', capacity: 2, baseRate: 15000, status: 'Checked-In' },
        { id: '3', roomNumber: '201', roomType: 'Deluxe', floor: '2', capacity: 2, baseRate: 25000, status: 'Booked' },
        { id: '4', roomNumber: '301', roomType: 'Suite', floor: '3', capacity: 4, baseRate: 45000, status: 'Vacant' },
      ]

      const mockGuests: Guest[] = [
        { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '+2348012345678', address: '123 Lagos Street', idNumber: 'A123456789', nationality: 'Nigerian' },
        { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', phone: '+2348023456789', address: '456 Abuja Road', idNumber: 'B987654321', nationality: 'Nigerian' },
      ]

      const mockBookings: Booking[] = [
        { id: '1', bookingNumber: 'BK001', guest: mockGuests[1], room: mockRooms[2], checkInDate: '2024-01-15', checkOutDate: '2024-01-18', adults: 2, children: 0, totalAmount: 75000, status: 'Booked' },
      ]

      setRooms(mockRooms)
      setGuests(mockGuests)
      setBookings(mockBookings)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddGuest = async () => {
    const newGuest: Guest = {
      id: Date.now().toString(),
      ...guestForm
    }
    setGuests([...guests, newGuest])
    setShowGuestDialog(false)
    setGuestForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      idNumber: '',
      nationality: ''
    })
  }

  const handleViewGuest = (guest: Guest) => {
    setSelectedGuest(guest)
    setShowViewGuestDialog(true)
    setEditMode(false)
  }

  const handleEditGuest = (guest: Guest) => {
    setSelectedGuest(guest)
    setGuestForm({
      firstName: guest.firstName,
      lastName: guest.lastName,
      email: guest.email,
      phone: guest.phone,
      address: guest.address,
      idNumber: guest.idNumber,
      nationality: guest.nationality
    })
    setShowGuestDialog(true)
    setEditMode(true)
  }

  const handleUpdateGuest = async () => {
    if (!selectedGuest) return
    
    const updatedGuests = guests.map(guest => 
      guest.id === selectedGuest.id 
        ? { ...guest, ...guestForm }
        : guest
    )
    
    setGuests(updatedGuests)
    setShowGuestDialog(false)
    setEditMode(false)
    setSelectedGuest(null)
    setGuestForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      idNumber: '',
      nationality: ''
    })
  }

  const handleAddBooking = async () => {
    const guest = guests.find(g => g.id === bookingForm.guestId)
    const room = rooms.find(r => r.id === bookingForm.roomId)
    
    if (!guest || !room) return

    const newBooking: Booking = {
      id: Date.now().toString(),
      bookingNumber: `BK${Date.now()}`,
      guest,
      room,
      checkInDate: bookingForm.checkInDate,
      checkOutDate: bookingForm.checkOutDate,
      adults: bookingForm.adults,
      children: bookingForm.children,
      totalAmount: room.baseRate,
      status: 'Booked'
    }

    setBookings([...bookings, newBooking])
    setShowBookingDialog(false)
    setBookingForm({
      guestId: '',
      roomId: '',
      checkInDate: '',
      checkOutDate: '',
      adults: 1,
      children: 0
    })

    // Update room status
    setRooms(rooms.map(r => 
      r.id === room.id ? { ...r, status: 'Booked' } : r
    ))
  }

  const handleAddRoom = async () => {
    const newRoom: Room = {
      id: Date.now().toString(),
      ...roomForm
    }
    setRooms([...rooms, newRoom])
    setShowRoomDialog(false)
    setRoomForm({
      roomNumber: '',
      roomType: '',
      floor: '',
      capacity: 2,
      baseRate: 0,
      status: 'Vacant'
    })
  }

  const updateRoomStatus = async (roomId: string, status: string) => {
    setRooms(rooms.map(room => 
      room.id === roomId ? { ...room, status } : room
    ))
  }

  const handleQuickBookRoom = async (room: Room) => {
    // Create a temporary guest for quick booking
    const tempGuest: Guest = {
      id: Date.now().toString(),
      firstName: 'Walk-In',
      lastName: 'Guest',
      email: `guest${room.roomNumber}@morav.com`,
      phone: '+234000000000',
      address: 'Walk-in Guest',
      idNumber: 'TEMP',
      nationality: 'Nigerian'
    }

    const newBooking: Booking = {
      id: Date.now().toString(),
      bookingNumber: `BK${Date.now()}`,
      guest: tempGuest,
      room,
      checkInDate: new Date().toISOString().split('T')[0],
      checkOutDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      adults: 1,
      children: 0,
      totalAmount: room.baseRate,
      status: 'Booked'
    }

    setBookings([...bookings, newBooking])
    setGuests([...guests, tempGuest])
    
    // Update room status
    setRooms(rooms.map(r => 
      r.id === room.id ? { ...r, status: 'Booked' } : r
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Vacant': return 'bg-green-100 text-green-800'
      case 'Booked': return 'bg-blue-100 text-blue-800'
      case 'Checked-In': return 'bg-purple-100 text-purple-800'
      case 'Under-Maintenance': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Vacant': return <CheckCircle className="w-4 h-4" />
      case 'Booked': return <Calendar className="w-4 h-4" />
      case 'Checked-In': return <Users className="w-4 h-4" />
      case 'Under-Maintenance': return <AlertCircle className="w-4 h-4" />
      default: return <XCircle className="w-4 h-4" />
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rooms.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vacant Rooms</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {rooms.filter(r => r.status === 'Vacant').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied Rooms</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {rooms.filter(r => r.status === 'Checked-In').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
            <UserPlus className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{guests.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rooms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rooms">Room Status</TabsTrigger>
          <TabsTrigger value="guests">Guest Management</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="rooms" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Room Status Dashboard</h3>
            <Dialog open={showRoomDialog} onOpenChange={setShowRoomDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Bed className="w-4 h-4 mr-2" />
                  Add Room
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Room</DialogTitle>
                  <DialogDescription>
                    Add a new room to the hotel inventory
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="roomNumber">Room Number</Label>
                      <Input
                        id="roomNumber"
                        value={roomForm.roomNumber}
                        onChange={(e) => setRoomForm({...roomForm, roomNumber: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="roomType">Room Type</Label>
                      <Select value={roomForm.roomType} onValueChange={(value) => setRoomForm({...roomForm, roomType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Standard">Standard</SelectItem>
                          <SelectItem value="Deluxe">Deluxe</SelectItem>
                          <SelectItem value="Suite">Suite</SelectItem>
                          <SelectItem value="Presidential">Presidential</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="floor">Floor</Label>
                      <Input
                        id="floor"
                        value={roomForm.floor}
                        onChange={(e) => setRoomForm({...roomForm, floor: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={roomForm.capacity}
                        onChange={(e) => setRoomForm({...roomForm, capacity: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="baseRate">Base Rate (₦)</Label>
                    <Input
                      id="baseRate"
                      type="number"
                      value={roomForm.baseRate || ''}
                      onChange={(e) => setRoomForm({...roomForm, baseRate: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddRoom}>Add Room</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {rooms.map((room) => (
              <Card key={room.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{room.roomNumber}</CardTitle>
                      <CardDescription>{room.roomType} - Floor {room.floor}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(room.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(room.status)}
                        <span>{room.status}</span>
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Capacity:</span>
                      <span>{room.capacity} guests</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Base Rate:</span>
                      <span className="font-semibold">{currencyFormatter.format(room.baseRate)}</span>
                    </div>
                    <div className="flex space-x-2 pt-2">
                      {room.status === 'Vacant' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleQuickBookRoom(room)}
                        >
                          Book Room
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          const newStatus = room.status === 'Vacant' ? 'Under-Maintenance' : 'Vacant'
                          updateRoomStatus(room.id, newStatus)
                        }}
                      >
                        {room.status === 'Under-Maintenance' ? 'Make Available' : 'Maintenance'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="guests" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Guest Management</h3>
            <Dialog open={showGuestDialog} onOpenChange={setShowGuestDialog}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Guest
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editMode ? 'Edit Guest' : 'Add New Guest'}</DialogTitle>
                  <DialogDescription>
                    {editMode ? 'Update guest information' : 'Register a new guest in the system'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={guestForm.firstName}
                        onChange={(e) => setGuestForm({...guestForm, firstName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={guestForm.lastName}
                        onChange={(e) => setGuestForm({...guestForm, lastName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={guestForm.email}
                        onChange={(e) => setGuestForm({...guestForm, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={guestForm.phone}
                        onChange={(e) => setGuestForm({...guestForm, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={guestForm.address}
                      onChange={(e) => setGuestForm({...guestForm, address: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="idNumber">ID Number</Label>
                      <Input
                        id="idNumber"
                        value={guestForm.idNumber}
                        onChange={(e) => setGuestForm({...guestForm, idNumber: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="nationality">Nationality</Label>
                      <Input
                        id="nationality"
                        value={guestForm.nationality}
                        onChange={(e) => setGuestForm({...guestForm, nationality: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={editMode ? handleUpdateGuest : handleAddGuest}>
                    {editMode ? 'Update Guest' : 'Add Guest'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {guests.map((guest) => (
              <Card key={guest.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{guest.firstName} {guest.lastName}</CardTitle>
                      <CardDescription>{guest.email} • {guest.phone}</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleViewGuest(guest)}>
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEditGuest(guest)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Address:</span> {guest.address || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Nationality:</span> {guest.nationality || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">ID Number:</span> {guest.idNumber || 'N/A'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Bookings</h3>
            <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Calendar className="w-4 h-4 mr-2" />
                  New Booking
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Booking</DialogTitle>
                  <DialogDescription>
                    Book a room for a guest
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="guest">Guest</Label>
                    <Select value={bookingForm.guestId} onValueChange={(value) => setBookingForm({...bookingForm, guestId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select guest" />
                      </SelectTrigger>
                      <SelectContent>
                        {guests.map((guest) => (
                          <SelectItem key={guest.id} value={guest.id}>
                            {guest.firstName} {guest.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="room">Room</Label>
                    <Select value={bookingForm.roomId} onValueChange={(value) => setBookingForm({...bookingForm, roomId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room" />
                      </SelectTrigger>
                      <SelectContent>
                        {rooms.filter(r => r.status === 'Vacant').map((room) => (
                          <SelectItem key={room.id} value={room.id}>
                            {room.roomNumber} - {room.roomType} ({currencyFormatter.format(room.baseRate)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="checkIn">Check-in Date</Label>
                      <Input
                        id="checkIn"
                        type="date"
                        value={bookingForm.checkInDate}
                        onChange={(e) => setBookingForm({...bookingForm, checkInDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="checkOut">Check-out Date</Label>
                      <Input
                        id="checkOut"
                        type="date"
                        value={bookingForm.checkOutDate}
                        onChange={(e) => setBookingForm({...bookingForm, checkOutDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="adults">Adults</Label>
                      <Input
                        id="adults"
                        type="number"
                        value={bookingForm.adults}
                        onChange={(e) => setBookingForm({...bookingForm, adults: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="children">Children</Label>
                      <Input
                        id="children"
                        type="number"
                        value={bookingForm.children}
                        onChange={(e) => setBookingForm({...bookingForm, children: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddBooking}>Create Booking</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Booking #{booking.bookingNumber}</CardTitle>
                      <CardDescription>
                        {booking.guest.firstName} {booking.guest.lastName} • Room {booking.room.roomNumber}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Check-in:</span> {new Date(booking.checkInDate).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Check-out:</span> {new Date(booking.checkOutDate).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Guests:</span> {booking.adults}A/{booking.children}C
                    </div>
                    <div>
                      <span className="font-medium">Total:</span> {currencyFormatter.format(booking.totalAmount)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* View Guest Dialog */}
      <Dialog open={showViewGuestDialog} onOpenChange={setShowViewGuestDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Guest Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedGuest?.firstName} {selectedGuest?.lastName}
            </DialogDescription>
          </DialogHeader>
          {selectedGuest && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <div className="p-2 border rounded-md bg-gray-50">{selectedGuest.firstName}</div>
                </div>
                <div>
                  <Label>Last Name</Label>
                  <div className="p-2 border rounded-md bg-gray-50">{selectedGuest.lastName}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <div className="p-2 border rounded-md bg-gray-50">{selectedGuest.email}</div>
                </div>
                <div>
                  <Label>Phone</Label>
                  <div className="p-2 border rounded-md bg-gray-50">{selectedGuest.phone}</div>
                </div>
              </div>
              <div>
                <Label>Address</Label>
                <div className="p-2 border rounded-md bg-gray-50">{selectedGuest.address || 'N/A'}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ID Number</Label>
                  <div className="p-2 border rounded-md bg-gray-50">{selectedGuest.idNumber || 'N/A'}</div>
                </div>
                <div>
                  <Label>Nationality</Label>
                  <div className="p-2 border rounded-md bg-gray-50">{selectedGuest.nationality || 'N/A'}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewGuestDialog(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setShowViewGuestDialog(false)
              handleEditGuest(selectedGuest!)
            }}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Guest
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}