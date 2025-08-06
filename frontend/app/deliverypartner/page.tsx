"use client";
import { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Bell, 
  Route,
  CheckCircle,
  AlertCircle,
  Package,
  Navigation,
  Phone,
  DollarSign,
  Calendar,
  Star,
  Filter,
  Search,
  LogOut,
  User,
} from 'lucide-react';
import { useUserContext } from '@/context/userContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function DeliveryDashboard() {
  const [activeTab, setActiveTab] = useState('deliveries');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const {user, setUser} = useUserContext(); 
  const router = useRouter(); 

  const [isOnline, setIsOnline] = useState(user?.available);

  // Mock data
  const deliveries = [
    {
      id: 'DEL-001',
      orderId: 'ORD-001',
      customerName: 'Sarah Johnson',
      customerPhone: '+1 (555) 987-6543',
      pickupAddress: '456 Store Ave, New York, NY 10001',
      deliveryAddress: 'New baneshwor, Kathmandu, Nepal',
      status: 'picked_up',
      priority: 'high',
      estimatedTime: '30 mins',
      distance: '2.5 mi',
      fee: 12.50,
      items: [
        { name: 'Wireless Headphones', quantity: 1 },
        { name: 'Phone Case', quantity: 2 }
      ]
    },
    {
      id: 'DEL-002',
      orderId: 'ORD-002',
      customerName: 'Mike Chen',
      customerPhone: '+1 (555) 456-7890',
      pickupAddress: '123 Coffee St, New York, NY 10003',
      deliveryAddress: '321 Pine Ave, New York, NY 10004',
      status: 'assigned',
      priority: 'medium',
      estimatedTime: '45 mins',
      distance: '3.8 mi',
      fee: 15.00,
      items: [
        { name: 'Coffee Beans', quantity: 2 },
        { name: 'Coffee Grinder', quantity: 1 }
      ]
    },
    {
      id: 'DEL-003',
      orderId: 'ORD-003',
      customerName: 'Emily Davis',
      customerPhone: '+1 (555) 321-0987',
      pickupAddress: '789 Tech Blvd, New York, NY 10005',
      deliveryAddress: '654 Elm St, New York, NY 10006',
      status: 'delivered',
      priority: 'low',
      completedTime: '25 mins',
      distance: '1.8 mi',
      fee: 10.00,
      rating: 5,
      items: [
        { name: 'Smart Watch', quantity: 1 }
      ]
    }
  ];

  const todaysStats = {
    totalDeliveries: 8,
    completedDeliveries: 5,
    pendingDeliveries: 3,
    totalEarnings: 125.50,
    avgRating: 4.8,
    totalDistance: 45.2
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'picked_up':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_transit':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'assigned':
        return <Clock className="w-4 h-4" />;
      case 'picked_up':
        return <Package className="w-4 h-4" />;
      case 'in_transit':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'all' || delivery.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const updateDeliveryStatus = async (orderId: string, newStatus: string) => {
  try {
    // Update delivery status via API
    const res = await fetch("http://localhost:8000/api/v1/delivery-partners/update-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId, status: newStatus }),
      credentials: "include",
    });

    const data = await res.json();
    if (data.success) {
      toast.success(`Order ${orderId} status updated to ${newStatus}`);

      // If status is 'in_transit', get initial location (optional)
      if (newStatus === "in_transit" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ latitude, longitude });
            toast.success(`Initial location captured: Lat ${latitude}, Lon ${longitude}`);
          },
          (error) => {
            console.error("Error getting initial location:", error);
            toast.error("Failed to get initial location");
          },
          { enableHighAccuracy: true }
        );
      }
    } else {
      toast.error(data.message || "Failed to update order status");
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    toast.error("Failed to update order status");
  }
};
  const [ currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const handleNavigate = (delivery: any) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
        router.push(
          `/ordertracking?deliveryId=${delivery.id}&destination=${encodeURIComponent(
            delivery.deliveryAddress
          )}`
        );
      },
      (error) => {
        console.error("Error getting location for navigation:", error);
        toast.error("Failed to get current location for navigation");
        router.push(
          `/order-tracking?deliveryId=${delivery.id}&destination=${encodeURIComponent(
            delivery.deliveryAddress
          )}`
        );
      }
    );
  } else {
    toast.error("Geolocation is not supported by this browser");
    router.push(
      `/order-tracking?deliveryId=${delivery.id}&destination=${encodeURIComponent(
        delivery.deliveryAddress
      )}`
    );
  }
};

  const stats = [
    {
      label: "Today's Deliveries",
      value: todaysStats.totalDeliveries,
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      label: 'Completed',
      value: todaysStats.completedDeliveries,
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      label: "Today's Earnings",
      value: `$${todaysStats.totalEarnings}`,
      icon: DollarSign,
      color: 'bg-purple-500'
    },
    {
      label: 'Avg Rating',
      value: todaysStats.avgRating,
      icon: Star,
      color: 'bg-yellow-500'
    }
  ];
 
 const HandleLogout = async () => {

    try {
      await fetch("http://localhost:8000/api/v1/users/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include" // Ensure cookies are sent with the request
      })
        toast.success('Logged out successfully');
        setUser(null);
        router.push('/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error('Failed to log out');
    }
    
  };

  const HandleAvailability = async() => {
    
    try {
      
      const res = await fetch("http://localhost:8000/api/v1/delivery-partners/updateavailability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isAvailable: !isOnline }),
        credentials: "include"
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setIsOnline(!isOnline);
        toast.success(`You are now ${isOnline ? 'offline' : 'online'}`);
      } else {
        toast.error(data.message || "Error updating availability");
      }


    } catch (error) {
      console.error("Error updating availability:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Truck className="w-8 h-8 text-purple-600" />
              <h1 className="text-xl font-bold text-gray-900">TrackIt Delivery</h1>
            </div>
            
             <div className="flex items-center space-x-4">
              <button
                onClick={HandleAvailability}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                  isOnline 
                    ? 'bg-green-100 hover:bg-green-200' 
                    : 'bg-red-100 hover:bg-red-200'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`text-sm font-medium ${isOnline ? 'text-green-800' : 'text-red-800'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </button>
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </div>
              <div className="flex items-center space-x-2">
                <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.name}`} className="w-8 h-8 text-gray-600 bg-gray-200 rounded-full p-1" alt="User Avatar" />
                <span className="text-gray-700 font-medium">{user?.name}</span>
              </div>
              <div className="flex items-center space-x-2" onClick={HandleLogout}>
                <LogOut className="w-8 h-8 text-gray-600 bg-gray-200 rounded-full p-1 hover:text-gray-800 hover:cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'deliveries', label: 'My Deliveries', icon: Package },
                { id: 'route', label: 'Route Optimizer', icon: Route },
                { id: 'earnings', label: 'Earnings', icon: DollarSign },
                { id: 'profile', label: 'Profile', icon: User }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'deliveries' && (
              <div>
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search deliveries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="assigned">Assigned</option>
                      <option value="picked_up">Picked Up</option>
                      <option value="in_transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>

                {/* Deliveries List */}
                <div className="space-y-4">
                  {filteredDeliveries.map((delivery) => (
                    <div key={delivery.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(delivery.priority)} mb-2`}></div>
                            <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-sm border ${getStatusColor(delivery.status)}`}>
                              {getStatusIcon(delivery.status)}
                              <span className="capitalize">{delivery.status.replace('_', ' ')}</span>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{delivery.id}</h3>
                              <span className="text-sm text-gray-500">({delivery.orderId})</span>
                            </div>
                            <p className="text-gray-600 mb-1">Customer: {delivery.customerName}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Navigation className="w-4 h-4" />
                                <span>{delivery.distance}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{delivery.estimatedTime || delivery.completedTime}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <DollarSign className="w-4 h-4" />
                                <span>${delivery.fee}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {delivery.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{delivery.rating}</span>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Pickup Address:</p>
                          <p className="text-sm text-gray-600">{delivery.pickupAddress}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Delivery Address:</p>
                          <p className="text-sm text-gray-600">{delivery.deliveryAddress}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Items:</p>
                        <div className="flex flex-wrap gap-2">
                          {delivery.items.map((item, index) => (
                            <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-700">
                              {item.name} (x{item.quantity})
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{delivery.customerPhone}</span>
                        </div>
                        <div className="flex space-x-2">
                          {delivery.status === 'assigned' && (
                            <button
                              onClick={() => updateDeliveryStatus(delivery.id, 'picked_up')}
                              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Mark Picked Up
                            </button>
                          )}
                          {delivery.status === 'picked_up' && (
                            <button
                              onClick={() => updateDeliveryStatus(delivery.id, 'in_transit')}
                              className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                            >
                              Start Delivery
                            </button>
                          )}
                          {delivery.status === 'in_transit' && (
                            <button
                              onClick={() => updateDeliveryStatus(delivery.id, 'delivered')}
                              className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Mark Delivered
                            </button>
                          )}
                          <button onClick={() => handleNavigate(delivery)} className="hover:cursor-pointer flex items-center space-x-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                            <MapPin className="w-4 h-4" />
                            <span>Navigate</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'route' && (
              <div className="text-center py-12">
                <Route className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Route Optimization</h3>
                <p className="text-gray-600 mb-6">Optimize your delivery route for maximum efficiency</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-gray-900">Active Deliveries:</span>
                    <span className="text-blue-600 font-bold">{deliveries.filter(d => ['assigned', 'picked_up'].includes(d.status)).length}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-gray-900">Total Distance:</span>
                    <span className="text-blue-600 font-bold">6.3 mi</span>
                  </div>
                  <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Optimize Route
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'earnings' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Today's Earnings</h3>
                    <p className="text-3xl font-bold">${todaysStats.totalEarnings}</p>
                    <p className="text-green-100 mt-1">+15% from yesterday</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">This Week</h3>
                    <p className="text-3xl font-bold">$680.25</p>
                    <p className="text-blue-100 mt-1">38 deliveries</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">This Month</h3>
                    <p className="text-3xl font-bold">$2,845.80</p>
                    <p className="text-purple-100 mt-1">156 deliveries</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Payments</h3>
                  <div className="space-y-4">
                    {[
                      { date: '2024-08-06', amount: 125.50, deliveries: 8, status: 'pending' },
                      { date: '2024-08-05', amount: 142.25, deliveries: 9, status: 'paid' },
                      { date: '2024-08-04', amount: 98.75, deliveries: 6, status: 'paid' },
                      { date: '2024-08-03', amount: 156.00, deliveries: 10, status: 'paid' }
                    ].map((payment, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div>
                          <p className="font-medium text-gray-900">{payment.date}</p>
                          <p className="text-sm text-gray-600">{payment.deliveries} deliveries</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${payment.amount}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="max-w-2xl">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          defaultValue="Alex Rodriguez"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          defaultValue="alex@example.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          defaultValue="+1 (555) 234-5678"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Driver License</label>
                        <input
                          type="text"
                          defaultValue="DL123456789"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                          <option>Motorcycle</option>
                          <option>Car</option>
                          <option>Van</option>
                          <option>Bicycle</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">License Plate</label>
                        <input
                          type="text"
                          defaultValue="ABC-1234"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Model</label>
                        <input
                          type="text"
                          defaultValue="Honda CBR 150R"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Number</label>
                        <input
                          type="text"
                          defaultValue="INS-789456123"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                    <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}