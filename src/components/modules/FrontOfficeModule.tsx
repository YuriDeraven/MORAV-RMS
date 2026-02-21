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
  Users,
  TrendingUp
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

function Sparkline({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 24" fill="none">
      <path
        d="M0 20 L10 16 L20 18 L30 12 L40 14 L50 8 L60 4"
        stroke="#D9F99D"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M50 8 L60 4"
        stroke="#86EFAC"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

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
    
    setRooms(rooms.map(r => 
      r.id === room.id ? { ...r, status: 'Booked' } : r
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Vacant': return 'bg-[#D9F99D] text-emerald-700'
      case 'Booked': return 'bg-[#FDA4AF] text-rose-700'
      case 'Checked-In': return 'bg-[#D9F99D] text-emerald-800'
      case 'Under-Maintenance': return 'bg-red-100 text-red-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Vacant': return <CheckCircle className="w-3 h-3" />
      case 'Booked': return <Calendar className="w-3 h-3" />
      case 'Checked-In': return <Users className="w-3 h-3" />
      case 'Under-Maintenance': return <AlertCircle className="w-3 h-3" />
      default: return <XCircle className="w-3 h-3" />
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Rooms</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{rooms.length}</p>
              </div>
              <div className="w-16 h-8">
                <Sparkline className="w-full h-full" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Vacant</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">
                  {rooms.filter(r => r.status === 'Vacant').length}
                </p>
              </div>
              <div className="w-16 h-8">
                <Sparkline className="w-full h-full" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Occupied</p>
                <p className="text-3xl font-bold text-rose-500 mt-1">
                  {rooms.filter(r => r.status === 'Checked-In').length}
                </p>
              </div>
              <div className="w-16 h-8">
                <Sparkline className="w-full h-full" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Guests</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{guests.length}</p>
              </div>
              <div className="w-16 h-8">
                <Sparkline className="w-full h-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rooms" className="space-y-4">
        <TabsList className="bg-white p-1 rounded-xl shadow-sm border-0">
          <TabsTrigger 
            value="rooms" 
            className="rounded-lg data-[state=active]:bg-[#D9F99D] data-[state=active]:text-slate-900"
          >
            Room Status
          </TabsTrigger>
          <TabsTrigger 
            value="guests" 
            className="rounded-lg data-[state=active]:bg-[#D9F99D] data-[state=active]:text-slate-900"
          >
            Guest Management
          </TabsTrigger>
          <TabsTrigger 
            value="bookings" 
            className="rounded-lg data-[state=active]:bg-[#D9F99D] data-[state=active]:text-slate-900"
          >
            Bookings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rooms" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-900">Room Status Dashboard</h3>
            <Dialog open={showRoomDialog} onOpenChange={setShowRoomDialog}>
              <DialogTrigger asChild>
                <Button className="bg-[#D9F99D] text-slate-900 hover:bg-[#D9F99D]/80">
                  <Bed className="w-4 h-4 mr-2" />
                  Add Room
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-slate-900">Add New Room</DialogTitle>
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
                  <Button onClick={handleAddRoom} className="bg-[#D9F99D] text-slate-900 hover:bg-[#D9F99D]/80">Add Room</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {rooms.map((room) => (
              <Card key={room.id} className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
                <CardHeader className="pb-3 pt-5 px-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl font-bold text-slate-900">{room.roomNumber}</CardTitle>
                      <CardDescription className="text-slate-500 mt-1">{room.roomType} • Floor {room.floor}</CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(room.status)} flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium`}>
                      {getStatusIcon(room.status)}
                      <span>{room.status}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-5 pt-0">
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Capacity:</span>
                      <span className="font-medium text-slate-900">{room.capacity} guests</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Base Rate:</span>
                      <span className="font-semibold text-slate-900">{currencyFormatter.format(room.baseRate)}</span>
                    </div>
                    <div className="flex space-x-3 pt-3">
                      {room.status === 'Vacant' && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                          onClick={() => handleQuickBookRoom(room)}
                        >
                          Book Room
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-slate-500 hover:text-slate-900 hover:bg-slate-100"
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
            <h3 className="text-lg font-semibold text-slate-900">Guest Management</h3>
            <Dialog open={showGuestDialog} onOpenChange={setShowGuestDialog}>
              <DialogTrigger asChild>
                <Button className="bg-[#D9F99D] text-slate-900 hover:bg-[#D9F99D]/80">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Guest
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-slate-900">{editMode ? 'Edit Guest' : 'Add New Guest'}</DialogTitle>
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
                  <Button onClick={editMode ? handleUpdateGuest : handleAddGuest} className="bg-[#D9F99D] text-slate-900 hover:bg-[#D9F99D]/80">
                    {editMode ? 'Update Guest' : 'Add Guest'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {guests.map((guest) => (
              <Card key={guest.id} className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
                <CardHeader className="pb-3 pt-5 px-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-slate-900">{guest.firstName} {guest.lastName}</CardTitle>
                      <CardDescription className="text-slate-500">{guest.email} • {guest.phone}</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100" onClick={() => handleViewGuest(guest)}>
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="ghost" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100" onClick={() => handleEditGuest(guest)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-5 pt-0">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-slate-900">Address:</span> <span className="text-slate-500">{guest.address || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-slate-900">Nationality:</span> <span className="text-slate-500">{guest.nationality || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-slate-900">ID Number:</span> <span className="text-slate-500">{guest.idNumber || 'N/A'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-900">Bookings</h3>
            <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
              <DialogTrigger asChild>
                <Button className="bg-[#D9F99D] text-slate-900 hover:bg-[#D9F99D]/80">
                  <Calendar className="w-4 h-4 mr-2" />
                  New Booking
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-slate-900">Create New Booking</DialogTitle>
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
                  <Button onClick={handleAddBooking} className="bg-[#D9F99D] text-slate-900 hover:bg-[#D9F99D]/80">Create Booking</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="rounded-2xl border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
                <CardHeader className="pb-3 pt-5 px-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-slate-900">Booking #{booking.bookingNumber}</CardTitle>
                      <CardDescription className="text-slate-500">
                        {booking.guest.firstName} {booking.guest.lastName} • Room {booking.room.roomNumber}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-5 pt-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-slate-900">Check-in:</span> <span className="text-slate-500">{new Date(booking.checkInDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="font-medium text-slate-900">Check-out:</span> <span className="text-slate-500">{new Date(booking.checkOutDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="font-medium text-slate-900">Guests:</span> <span className="text-slate-500">{booking.adults}A/{booking.children}C</span>
                    </div>
                    <div>
                      <span className="font-medium text-slate-900">Total:</span> <span className="text-slate-500">{currencyFormatter.format(booking.totalAmount)}</span>
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
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Guest Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedGuest?.firstName} {selectedGuest?.lastName}
            </DialogDescription>
          </DialogHeader>
          {selectedGuest && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-900">{selectedGuest.firstName}</div>
                </div>
                <div>
                  <Label>Last Name</Label>
                  <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-900">{selectedGuest.lastName}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-900">{selectedGuest.email}</div>
                </div>
                <div>
                  <Label>Phone</Label>
                  <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-900">{selectedGuest.phone}</div>
                </div>
              </div>
              <div>
                <Label>Address</Label>
                <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-900">{selectedGuest.address || 'N/A'}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ID Number</Label>
                  <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-900">{selectedGuest.idNumber || 'N/A'}</div>
                </div>
                <div>
                  <Label>Nationality</Label>
                  <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-900">{selectedGuest.nationality || 'N/A'}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewGuestDialog(false)} className="border-slate-200">
              Close
            </Button>
            <Button onClick={() => {
              setShowViewGuestDialog(false)
              handleEditGuest(selectedGuest!)
            }} className="bg-[#D9F99D] text-slate-900 hover:bg-[#D9F99D]/80">
              <Edit className="w-4 h-4 mr-2" />
              Edit Guest
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
