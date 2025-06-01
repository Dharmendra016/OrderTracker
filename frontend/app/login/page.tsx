"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "sonner"
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface FormData {
    email: string;
    password: string;
    role: string;
}


export default function LoginForm() {

    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
        role: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const {login} = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {

            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/v1/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    role: formData.role
                }),
            })

            const data = await response.json();
            setIsLoading(false);
            if (data.success) {
                toast.success("Login successful!");
                login({
                    email: data.user.email,
                    role: data.user.role,
                    name: data.user.name,
                    id: data.user.id
                })
                setFormData({
                    email: '',
                    password: '',
                    role: ''
                });
            }else{
                toast.error(data.message || "Login failed. Please try again.");
            }
            
        } catch (error) {
            console.error("Login error:", error);
            toast.error("An error occurred during login. Please try again.");
        }


    };

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold text-gray-900">
                            DeliveryTracker
                        </CardTitle>
                        <CardDescription>
                            Real-time delivery tracking platform
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role:value})} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="vendor">Vendor</SelectItem>
                                        <SelectItem value="delivery">Delivery Partner</SelectItem>
                                        <SelectItem value="customer">Customer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name='email'
                                    value={formData.email}
                                    onChange={changeHandler}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name='password'
                                    value={formData.password}
                                    onChange={changeHandler}
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>
                        <p className='text-center mt-5'>Go to signup page <span className='text-blue-400'><Link href="/register">Signup</Link></span></p>
      
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};