"use client";
import { useState } from 'react';
import { Package, Eye, EyeOff, Store, User, Truck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function SignupPage() {
    const [selectedRole, setSelectedRole] = useState<'customer' | 'vendor' | 'delivery' | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        shopName: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const router = useRouter();
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

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };


    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }


        if (!selectedRole) {
            newErrors.role = 'Please select a role';
        }

        if (selectedRole === 'vendor' && !formData.shopName.trim()) {
            newErrors.shopName = 'Shop name is required for vendors';
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            // api call 
            const res = await fetch("https://ordertracker-vepx.onrender.com/api/v1/users/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: selectedRole,
                    shopName: formData.shopName
                })
            });
            const data = await res.json();
            
            if(!data.success) {
                toast.error(data.message || "Signup failed");
                const errorData = await res.json();
                console.error('Signup error:', errorData);
                setErrors(prev => ({ ...prev, api: errorData.message || 'Signup failed' }));
            }

            toast.success(data.message || "Signup successful! Redirecting to home...");
            router.push("/login")

        } catch (error) {
            console.error('Signup error:', error);
        } finally {
            setIsLoading(false);
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
            <div className="w-full max-w-2xl">
                {/* Signup Card */}
                <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-border p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-foreground mb-2">Create Account</h2>
                        <p className="text-muted-foreground">Join TrackIt and start tracking your deliveries</p>
                    </div>

                    {/* Role Selection */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-foreground mb-4">
                            Select your role *
                        </label>
                        {errors.role && <p className="text-red-500 text-xs mb-2">{errors.role}</p>}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {roles.map((role) => {
                                const colors = getRoleColors(role.color);
                                const Icon = role.icon;
                                const isSelected = selectedRole === role.id;

                                return (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => setSelectedRole(role.id)}
                                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${isSelected
                                                ? `${colors.selectedBorder} ${colors.bg} shadow-lg transform scale-105`
                                                : `${colors.border} ${colors.bg} hover:${colors.selectedBorder} hover:shadow-md`
                                            }`}
                                    >
                                        <div className="flex flex-col items-center space-y-2">
                                            <div className={`p-3 rounded-lg ${isSelected ? colors.selectedBg : 'bg-background'}`}>
                                                <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : colors.icon}`} />
                                            </div>
                                            <div className="text-center">
                                                <div className={`font-semibold ${isSelected ? 'text-foreground' : 'text-foreground'}`}>
                                                    {role.name}
                                                </div>
                                                <div className={`text-xs ${isSelected ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
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

                    {/* Signup Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="flex flex-col justify-center md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                                    Full Name *
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-border'
                                        } bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                    placeholder="Enter your full name"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                    Email Address *
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-border'
                                        } bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                    placeholder="Enter your email"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                        </div>

                        {/* Password Fields */}
                        <div className="flex flex-col md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                                    Password *
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 pr-12 rounded-lg border ${errors.password ? 'border-red-500' : 'border-border'
                                            } bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        placeholder="Create password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>

                            {/* Vendor-specific field */}
                            {selectedRole === 'vendor' && (
                                <div>
                                    <label htmlFor="shopName" className="block text-sm font-medium text-foreground mb-2">
                                        Shop Name *
                                    </label>
                                    <input
                                        id="shopName"
                                        name="shopName"
                                        type="text"
                                        required
                                        value={formData.shopName}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 rounded-lg border ${errors.shopName ? 'border-red-500' : 'border-border'
                                            } bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        placeholder="Enter your shop name"
                                    />
                                    {errors.shopName && <p className="text-red-500 text-xs mt-1">{errors.shopName}</p>}
                                </div>
                            )}


                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Creating Account...</span>
                                    </div>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </div>


                    </form>

                    {/* Login Link */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Role-specific features */}
                {selectedRole && (
                    <div className="mt-6 bg-card/60 backdrop-blur-sm rounded-lg border border-border p-4">
                        <h3 className="font-semibold text-foreground mb-2">
                            As a {roles.find(r => r.id === selectedRole)?.name}, you'll get:
                        </h3>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            {selectedRole === 'customer' && (
                                <>
                                    <li>• Real-time order tracking</li>
                                    <li>• Delivery notifications and updates</li>
                                    <li>• Delivery preferences management</li>
                                    <li>• Order history and receipts</li>
                                </>
                            )}
                            {selectedRole === 'vendor' && (
                                <>
                                    <li>• Product inventory management</li>
                                    <li>• Order processing and fulfillment</li>
                                    <li>• Sales analytics and reporting</li>
                                    <li>• Customer communication tools</li>
                                </>
                            )}
                            {selectedRole === 'delivery' && (
                                <>
                                    <li>• Delivery assignment management</li>
                                    <li>• Real-time status updates</li>
                                    <li>• Route optimization tools</li>
                                    <li>• Earnings and performance tracking</li>
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