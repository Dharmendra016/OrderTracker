"use client";
import { useState } from 'react';
import { 
  Package, 
  MapPin, 
  Clock, 
  Bell, 
  User, 
  Settings, 
  Search,
  Filter,
  Star,
  Truck,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  LogOut
} from 'lucide-react';
import { StatusType } from '@/types/StatusType';
import { useUserContext } from '@/context/userContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const { user, setUser } = useUserContext();
    const router = useRouter(); 


  // Mock data
  const orders = [
    {
      id: 'ORD-001',
      title: 'Wireless Bluetooth Headphones',
      vendor: 'TechStore Pro',
      status: 'delivered',
      orderDate: '2024-08-01',
      deliveryDate: '2024-08-03',
      amount: 89.99,
      trackingNumber: 'TRK-12345',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'
    },
    {
      id: 'ORD-002',
      title: 'Organic Coffee Beans (2 Pack)',
      vendor: 'Bean Heaven',
      status: 'in_transit',
      orderDate: '2024-08-04',
      estimatedDelivery: '2024-08-06',
      amount: 45.50,
      trackingNumber: 'TRK-67890',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100&h=100&fit=crop'
    },
    {
      id: 'ORD-003',
      title: 'Smart Fitness Watch',
      vendor: 'GadgetWorld',
      status: 'processing',
      orderDate: '2024-08-05',
      estimatedDelivery: '2024-08-08',
      amount: 199.99,
      trackingNumber: 'TRK-11111',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop'
    },
    {
      id: 'ORD-004',
      title: 'Premium Leather Wallet',
      vendor: 'Luxury Goods Co',
      status: 'cancelled',
      orderDate: '2024-08-02',
      amount: 120.00,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop'
    }
  ];

  const notifications = [
    {
      id: 1,
      type: 'delivery',
      message: 'Your order #ORD-002 is out for delivery',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'promotion',
      message: 'Special discount: 20% off on electronics',
      time: '1 day ago',
      read: true
    },
    {
      id: 3,
      type: 'order',
      message: 'Order #ORD-003 has been confirmed',
      time: '2 days ago',
      read: true
    }
  ];

  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: StatusType) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'in_transit':
        return <Truck className="w-4 h-4" />;
      case 'processing':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = [
    {
      label: 'Total Orders',
      value: orders.length,
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      label: 'In Transit',
      value: orders.filter(o => o.status === 'in_transit').length,
      icon: Truck,
      color: 'bg-orange-500'
    },
    {
      label: 'Delivered',
      value: orders.filter(o => o.status === 'delivered').length,
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      label: 'This Month',
      value: '$' + orders.reduce((sum, o) => sum + o.amount, 0).toFixed(2),
      icon: Star,
      color: 'bg-purple-500'
    }
  ];

  const HandleLogout = () => {
    toast.success('Logged out successfully');
    setUser(null);
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Package className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">TrackIt Customer</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-8 h-8 text-gray-600 bg-gray-200 rounded-full p-1" />
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
                { id: 'orders', label: 'My Orders', icon: Package },
                { id: 'tracking', label: 'Track Package', icon: MapPin },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'profile', label: 'Profile', icon: User }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
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
            {activeTab === 'orders' && (
              <div>
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="processing">Processing</option>
                      <option value="in_transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <img
                            src={order.image}
                            alt={order.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{order.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">Order ID: {order.id}</p>
                            <p className="text-sm text-gray-600 mb-2">Vendor: {order.vendor}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>Ordered: {order.orderDate}</span>
                              {order.deliveryDate && <span>Delivered: {order.deliveryDate}</span>}
                              {order.estimatedDelivery && <span>Est. Delivery: {order.estimatedDelivery}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-sm border ${getStatusColor(order.status as StatusType)} mb-2`}>
                            {getStatusIcon(order.status as StatusType)}
                            <span className="capitalize">{order.status.replace('_', ' ')}</span>
                          </div>
                          <p className="text-lg font-bold text-gray-900">${order.amount}</p>
                          {order.rating && (
                            <div className="flex items-center justify-end mt-1">
                              {[...Array(order.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-600">Tracking: {order.trackingNumber}</span>
                        <div className="flex space-x-2">
                          <button className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                            <Eye className="w-4 h-4" />
                            <span>Track</span>
                          </button>
                          <button className="flex items-center space-x-1 px-3 py-1 text-sm text-green-600 border border-green-600 rounded hover:bg-green-50">
                            <Plus className="w-4 h-4" />
                            <span>Reorder</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tracking' && (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Your Package</h3>
                <p className="text-gray-600 mb-6">Enter your tracking number to get real-time updates</p>
                <div className="max-w-md mx-auto">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Enter tracking number"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Track
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border ${
                      notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          notification.type === 'delivery' ? 'bg-blue-500' :
                          notification.type === 'promotion' ? 'bg-green-500' : 'bg-purple-500'
                        }`}>
                          {notification.type === 'delivery' && <Truck className="w-4 h-4 text-white" />}
                          {notification.type === 'promotion' && <Star className="w-4 h-4 text-white" />}
                          {notification.type === 'order' && <Package className="w-4 h-4 text-white" />}
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">{notification.message}</p>
                          <p className="text-sm text-gray-600 mt-1">{notification.time}</p>
                        </div>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
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
                          defaultValue="John Doe"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          defaultValue="john@example.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          defaultValue="+1 (555) 123-4567"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                        <input
                          type="text"
                          defaultValue="123 Main St"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                          <input
                            type="text"
                            defaultValue="New York"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                          <input
                            type="text"
                            defaultValue="NY"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                          <input
                            type="text"
                            defaultValue="10001"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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