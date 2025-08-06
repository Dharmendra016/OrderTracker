"use client";
import { useState } from 'react';
import { Package, Eye, EyeOff, Store, User, Truck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/userContext';

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<'customer' | 'vendor' | 'delivery' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter(); 
  const {setUser} = useUserContext(); 

  const roles = [
    {
      id: 'customer' as const,
      name: 'Customer',
      description: 'Track your orders and manage deliveries',
      icon: User,
      color: 'blue'
    },
    {
      id: 'vendor' as const,
      name: 'Vendor',
      description: 'Manage your products and orders',
      icon: Store,
      color: 'green'
    },
    {
      id: 'delivery' as const,
      name: 'Delivery Partner',
      description: 'Handle deliveries and update status',
      icon: Truck,
      color: 'purple'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
        
        const res = await fetch("http://localhost:8000/api/v1/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password,
                role: selectedRole
            }),
            credentials: "include",
        })

        const data = await res.json();

        if( !data.success ){
            toast.error(data.message || "Login failed");
            setIsLoading(false);
            return;
        }

        setUser(data.user); 
        toast.success(data.message || "Login successful");
        
        if( data.user.role === 'customer' ){
            router.push("/customer");
        }else if( data.user.role === 'vendor' ){
            router.push("/vendor");
        }else if( data.user.role === 'delivery' ){
            router.push("/deliverypartner");
        }
        
    } catch (error) {
        console.error('Login error:', error);
    }
   
  };

  const getRoleColors = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-950/30',
        border: 'border-blue-200 dark:border-blue-800',
        selectedBorder: 'border-blue-500',
        icon: 'text-blue-600',
        selectedBg: 'bg-blue-500',
      },
      green: {
        bg: 'bg-green-50 dark:bg-green-950/30',
        border: 'border-green-200 dark:border-green-800',
        selectedBorder: 'border-green-500',
        icon: 'text-green-600',
        selectedBg: 'bg-green-500',
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-950/30',
        border: 'border-purple-200 dark:border-purple-800',
        selectedBorder: 'border-purple-500',
        icon: 'text-purple-600',
        selectedBg: 'bg-purple-500',
      }
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-indigo-50 dark:from-gray-900 dark:via-background dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-foreground">TrackIt</h1>
            </div>
            <Link href="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-border p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h2>
              <p className="text-muted-foreground">Sign in to your account</p>
            </div>

            {/* Role Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-foreground mb-4">
                Select your role
              </label>
              <div className="space-y-3">
                {roles.map((role) => {
                  const colors = getRoleColors(role.color);
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        isSelected
                          ? `${colors.selectedBorder} ${colors.bg} shadow-lg transform scale-105`
                          : `${colors.border} ${colors.bg} hover:${colors.selectedBorder} hover:shadow-md`
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${isSelected ? colors.selectedBg : 'bg-background'}`}>
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : colors.icon}`} />
                        </div>
                        <div className="flex-1">
                          <div className={`font-semibold ${isSelected ? 'text-foreground' : 'text-foreground'}`}>
                            {role.name}
                          </div>
                          <div className={`text-sm ${isSelected ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                            {role.description}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-background border-border rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-muted-foreground">Remember me</span>
                </label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={!selectedRole || isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>

          {/* Role-specific features */}
          {selectedRole && (
            <div className="mt-6 bg-card/60 backdrop-blur-sm rounded-lg border border-border p-4">
              <h3 className="font-semibold text-foreground mb-2">
                {roles.find(r => r.id === selectedRole)?.name} Features:
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                {selectedRole === 'customer' && (
                  <>
                    <li>• Track orders in real-time</li>
                    <li>• Receive delivery notifications</li>
                    <li>• Manage delivery preferences</li>
                  </>
                )}
                {selectedRole === 'vendor' && (
                  <>
                    <li>• Manage product inventory</li>
                    <li>• Process and fulfill orders</li>
                    <li>• Analytics and reporting</li>
                  </>
                )}
                {selectedRole === 'delivery' && (
                  <>
                    <li>• View assigned deliveries</li>
                    <li>• Update delivery status</li>
                    <li>• Route optimization</li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}