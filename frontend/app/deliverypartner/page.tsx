// "use client";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { useAuth } from "@/contexts/AuthContext";
// import { Badge, CheckCircle, LogOut, Package, Play, Square } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function DeliveryPartnerPage() {

//     const {user,logout} = useAuth();
//     const router = useRouter();

//     useEffect(()=> {
//         if( !user || user.role !== 'deliverypartner') {
//         router.push('/login');
//     }

//     },[])
//     const [assignedOrders, setAssignedOrders] = useState([]);
//     const [activeDelivery, setActiveDelivery] = useState(null);
//     const [currentLocation, setCurrentLocation] = useState({ lat: 40.7128, lng: -74.0060 }); 
//     const [locationTracker, setLocationTracker] = useState({
//         isTracking: true,
//         intervalId: null,
//     });



//     return (
//        <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Delivery Dashboard</h1>
//               <p className="text-gray-600">Welcome back, {user?.name}</p>
//             </div>
//             <div className="flex items-center gap-4">
//               {locationTracker.isTracking && (
//                 <Badge className="bg-green-100 text-green-800">
//                   <div className="flex items-center gap-1">
//                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                     Tracking Active
//                   </div>
//                 </Badge>
//               )}
//               <Button onClick={logout} variant="outline" className="flex items-center gap-2">
//                 <LogOut className="h-4 w-4" />
//                 Logout
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Orders Section */}
//           <div className="space-y-6">
//             {/* Stats */}
//             <div className="grid grid-cols-2 gap-4">
//               <Card>
//                 <CardContent className="p-4">
//                   <div className="flex items-center">
//                     <Package className="h-6 w-6 text-blue-600" />
//                     <div className="ml-3">
//                       <p className="text-sm font-medium text-gray-600">Total Orders</p>
//                       <p className="text-xl font-bold text-gray-900">{assignedOrders.length}</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
              
//               <Card>
//                 <CardContent className="p-4">
//                   <div className="flex items-center">
//                     <CheckCircle className="h-6 w-6 text-green-600" />
//                     <div className="ml-3">
//                       <p className="text-sm font-medium text-gray-600">Completed</p>
//                       <p className="text-xl font-bold text-gray-900">
//                         {assignedOrders.filter(o => o.status === 'delivered').length}
//                       </p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Assigned Orders */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Your Deliveries</CardTitle>
//                 <CardDescription>Orders assigned to you</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {assignedOrders.map((order) => (
//                     <div key={order.id} className="border rounded-lg p-4">
//                       <div className="flex items-center justify-between mb-3">
//                         <h3 className="font-semibold">Order #{order.id}</h3>
//                         <Badge className={getStatusColor(order.status)}>
//                           <div className="flex items-center gap-1">
//                             {getStatusIcon(order.status)}
//                             {order.status}
//                           </div>
//                         </Badge>
//                       </div>
                      
//                       <div className="space-y-2 text-sm text-gray-600">
//                         <div className="flex justify-between">
//                           <span>Customer:</span>
//                           <span className="font-medium">{order.customerName}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Items:</span>
//                           <span className="font-medium">{order.items.join(', ')}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Address:</span>
//                           <span className="font-medium">{order.customerAddress}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Amount:</span>
//                           <span className="font-bold text-green-600">${order.totalAmount}</span>
//                         </div>
//                       </div>

//                       <div className="mt-4 flex gap-2">
//                         {order.status === 'assigned' && (
//                           <Button 
//                             onClick={() => handleStartDelivery(order.id)}
//                             className="flex items-center gap-2"
//                           >
//                             <Play className="h-4 w-4" />
//                             Start Delivery
//                           </Button>
//                         )}
//                         {order.status === 'in-transit' && activeDelivery === order.id && (
//                           <Button 
//                             onClick={() => handleCompleteDelivery(order.id)}
//                             variant="outline"
//                             className="flex items-center gap-2"
//                           >
//                             <Square className="h-4 w-4" />
//                             Complete Delivery
//                           </Button>
//                         )}
//                       </div>
//                     </div>
//                   ))}

//                   {assignedOrders.length === 0 && (
//                     <div className="text-center py-8">
//                       <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                       <p className="text-gray-500">No orders assigned yet</p>
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Map Section */}
//           <div className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Live Location</CardTitle>
//                 <CardDescription>
//                   {locationTracker.isTracking 
//                     ? 'Your location is being tracked in real-time' 
//                     : 'Start a delivery to enable location tracking'
//                   }
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="h-96">
//                   <MapComponent
//                     center={[currentLocation.lat, currentLocation.lng]}
//                     deliveryLocation={currentLocation}
//                     destinationLocation={activeOrder ? { lat: 40.7505, lng: -73.9934 } : undefined}
//                   />
//                 </div>
                
//                 {locationTracker.isTracking && (
//                   <div className="mt-4 p-3 bg-blue-50 rounded-lg">
//                     <div className="flex items-center gap-2 text-blue-800">
//                       <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//                       <span className="text-sm font-medium">
//                         Live tracking: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
//                       </span>
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//     )


// }