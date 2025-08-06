"use client";
import { useState } from 'react';
import { 
  Store, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Bell, 
  User, 
  Settings,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Users,
  Star,
  Calendar,
  LogOut
} from 'lucide-react';
import { StatusType } from '@/types/StatusType';
import { toast } from 'sonner';
import { useUserContext } from '@/context/userContext';
import { useRouter } from 'next/navigation';

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data
  const orders = [
    {
      id: 'ORD-001',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah@example.com',
      items: [
        { name: 'Wireless Bluetooth Headphones', price: 89.99, quantity: 1 }
      ],
      status: 'pending',
      total: 89.99,
      orderDate: '2024-08-06',
      deliveryAddress: '123 Oak St, New York, NY 10001'
    },
    {
      id: 'ORD-002',
      customerName: 'Mike Chen',
      customerEmail: 'mike@example.com',
      items: [
        { name: 'Organic Coffee Beans', price: 22.75, quantity: 2 }
      ],
      status: 'processing',
      total: 45.50,
      orderDate: '2024-08-05',
      deliveryAddress: '456 Pine Ave, New York, NY 10002'
    },
    {
      id: 'ORD-003',
      customerName: 'Emily Davis',
      customerEmail: 'emily@example.com',
      items: [
        { name: 'Smart Fitness Watch', price: 199.99, quantity: 1 }
      ],
      status: 'shipped',
      total: 199.99,
      orderDate: '2024-08-04',
      deliveryAddress: '789 Elm St, New York, NY 10003',
      trackingNumber: 'TRK-11111'
    },
    {
      id: 'ORD-004',
      customerName: 'John Smith',
      customerEmail: 'john@example.com',
      items: [
        { name: 'Premium Coffee Grinder', price: 149.99, quantity: 1 }
      ],
      status: 'delivered',
      total: 149.99,
      orderDate: '2024-08-03',
      deliveryAddress: '321 Maple St, New York, NY 10004',
      deliveredDate: '2024-08-05',
      rating: 5
    }
  ];

  const products = [
    {
      id: 'PROD-001',
      name: 'Wireless Bluetooth Headphones',
      category: 'Electronics',
      price: 89.99,
      stock: 25,
      sold: 45,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'
    },
    {
      id: 'PROD-002',
      name: 'Organic Coffee Beans',
      category: 'Food & Beverages',
      price: 22.75,
      stock: 50,
      sold: 120,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100&h=100&fit=crop'
    },
    {
      id: 'PROD-003',
      name: 'Smart Fitness Watch',
      category: 'Electronics',
      price: 199.99,
      stock: 8,
      sold: 23,
      status: 'low_stock',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop'
    },
    {
      id: 'PROD-004',
      name: 'Premium Coffee Grinder',
      category: 'Kitchen',
      price: 149.99,
      stock: 0,
      sold: 67,
      status: 'out_of_stock',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&h=100&fit=crop'
    }
  ];

  const analytics = {
    totalRevenue: 12845.67,
    totalOrders: 234,
    totalProducts: products.length,
    avgOrderValue: 54.87,
    topSellingProduct: 'Organic Coffee Beans',
    conversionRate: 3.2,
    returnRate: 1.8,
    customerSatisfaction: 4.6
  };

  type NewStatusType = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'active' | 'low_stock' | 'out_of_stock';

  const getStatusColor = (status: NewStatusType) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: NewStatusType) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'shipped':
        return <TrendingUp className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = [
    {
      label: 'Total Revenue',
      value: `$${analytics.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+12.5%'
    },
    {
      label: 'Total Orders',
      value: analytics.totalOrders,
      icon: ShoppingCart,
      color: 'bg-blue-500',
      change: '+8.2%'
    },
    {
      label: 'Products',
      value: analytics.totalProducts,
      icon: Package,
      color: 'bg-purple-500',
      change: '+2'
    },
    {
      label: 'Avg Order Value',
      value: `$${analytics.avgOrderValue}`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+5.1%'
    }
  ];
  
  const {user, setUser} = useUserContext();
  const router = useRouter();

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
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Store className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">TechStore Pro</h1>
                <p className="text-sm text-gray-600">Vendor Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
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
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
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
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'orders', label: 'Orders', icon: ShoppingCart },
                { id: 'products', label: 'Products', icon: Package },
                { id: 'customers', label: 'Customers', icon: Users },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp },
                { id: 'profile', label: 'Store Profile', icon: Store }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
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
            {activeTab === 'overview' && (
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Quick Stats */}
                  <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-4">Today's Performance</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-green-100 text-sm">Orders</p>
                        <p className="text-2xl font-bold">12</p>
                      </div>
                      <div>
                        <p className="text-green-100 text-sm">Revenue</p>
                        <p className="text-2xl font-bold">$645</p>
                      </div>
                      <div>
                        <p className="text-green-100 text-sm">Visitors</p>
                        <p className="text-2xl font-bold">156</p>
                      </div>
                      <div>
                        <p className="text-green-100 text-sm">Conversion</p>
                        <p className="text-2xl font-bold">7.7%</p>
                      </div>
                    </div>
                  </div>

                  {/* Top Products */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
                    <div className="space-y-4">
                      {products.slice(0, 3).map((product, index) => (
                        <div key={product.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-600">{product.sold} sold</p>
                            </div>
                          </div>
                          <span className="font-bold text-gray-900">${product.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                    <button 
                      onClick={() => setActiveTab('orders')}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div>
                          <p className="font-medium text-gray-900">{order.id}</p>
                          <p className="text-sm text-gray-600">{order.customerName}</p>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-sm border ${getStatusColor(order.status as NewStatusType)} mb-1`}>
                            {getStatusIcon(order.status as NewStatusType)}
                            <span className="capitalize">{order.status}</span>
                          </div>
                          <p className="font-bold text-gray-900">${order.total}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

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
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{order.id}</h3>
                            <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-sm border ${getStatusColor(order.status as NewStatusType)}`}>
                              {getStatusIcon(order.status as NewStatusType)}
                              <span className="capitalize">{order.status}</span>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-1">Customer: {order.customerName}</p>
                          <p className="text-sm text-gray-600">{order.customerEmail}</p>
                          <p className="text-sm text-gray-600 mt-1">Order Date: {order.orderDate}</p>
                          {order.trackingNumber && (
                            <p className="text-sm text-gray-600">Tracking: {order.trackingNumber}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">${order.total}</p>
                          {order.rating && (
                            <div className="flex items-center justify-end mt-1">
                              {[...Array(order.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                              <div>
                                <p className="font-medium text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                              </div>
                              <span className="font-medium text-gray-900">${item.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-1">Delivery Address:</p>
                        <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex space-x-2">
                          {order.status === 'pending' && (
                            <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                              Accept Order
                            </button>
                          )}
                          {order.status === 'processing' && (
                            <button className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors">
                              Mark as Shipped
                            </button>
                          )}
                          <button className="flex items-center space-x-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                            <Eye className="w-4 h-4" />
                            <span>View Details</span>
                          </button>
                        </div>
                        <span className="text-sm text-gray-500">
                          {order.deliveredDate ? `Delivered: ${order.deliveredDate}` : `Ordered: ${order.orderDate}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Product Inventory</h3>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm border ${getStatusColor(product.status as NewStatusType)}`}>
                          <span className="capitalize">{product.status.replace('_', ' ')}</span>
                        </div>
                      </div>
                      
                      <h4 className="font-semibold text-gray-900 mb-2">{product.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{product.category}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Price</p>
                          <p className="font-bold text-gray-900">${product.price}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Stock</p>
                          <p className={`font-bold ${product.stock === 0 ? 'text-red-600' : product.stock < 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {product.stock}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Sold</p>
                          <p className="font-bold text-gray-900">{product.sold}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Revenue</p>
                          <p className="font-bold text-gray-900">${(product.price * product.sold).toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'customers' && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Management</h3>
                <p className="text-gray-600 mb-6">View and manage your customer relationships</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Customers:</span>
                      <span className="font-bold">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Repeat Customers:</span>
                      <span className="font-bold">89</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Customer Satisfaction:</span>
                      <span className="font-bold">4.6/5</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Conversion Rate</h3>
                    <p className="text-3xl font-bold">{analytics.conversionRate}%</p>
                    <p className="text-blue-100 mt-1">+0.5% from last month</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Return Rate</h3>
                    <p className="text-3xl font-bold">{analytics.returnRate}%</p>
                    <p className="text-purple-100 mt-1">-0.3% from last month</p>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Customer Rating</h3>
                    <p className="text-3xl font-bold">{analytics.customerSatisfaction}/5</p>
                    <p className="text-yellow-100 mt-1">+0.2 from last month</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Performance</h3>
                  <div className="text-center py-12 text-gray-600">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4" />
                    <p>Detailed analytics charts would be displayed here</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="max-w-2xl">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                        <input
                          type="text"
                          defaultValue="TechStore Pro"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
                        <input
                          type="text"
                          defaultValue="David Wilson"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          defaultValue="david@techstorepro.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          defaultValue="+1 (555) 345-6789"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Description</label>
                    <textarea
                      rows={4}
                      defaultValue="Premium technology products with exceptional quality and customer service. We specialize in electronics, gadgets, and smart home devices."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Address</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                        <input
                          type="text"
                          defaultValue="456 Business Ave"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                          <input
                            type="text"
                            defaultValue="New York"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                          <input
                            type="text"
                            defaultValue="NY"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                          <input
                            type="text"
                            defaultValue="10001"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                    <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
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