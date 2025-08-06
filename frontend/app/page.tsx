"use client";
import { useState } from 'react';
import { Package, Truck, CheckCircle } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import Link from 'next/link';

export default function Home() {
  const [isHovered, setIsHovered] = useState<null | 'signup' | 'login'>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-indigo-50 dark:from-gray-900 dark:via-background dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm shadow-sm border-b border-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-foreground">TrackIt</h1>
            </div>
            <nav className="hidden md:flex space-x-8 items-center">
              <a href="#features" className="text-muted-foreground hover:text-blue-600 transition-colors">Features</a>
              <a href="#about" className="text-muted-foreground hover:text-blue-600 transition-colors">About</a>
              <a href="#contact" className="text-muted-foreground hover:text-blue-600 transition-colors">Contact</a>
              <ModeToggle/>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Animated Icons */}
          <div className="flex justify-center items-center space-x-8 mb-8">
            <div className="animate-bounce delay-0">
              <Package className="w-12 h-12 text-blue-500" />
            </div>
            <div className="animate-bounce delay-150">
              <Truck className="w-12 h-12 text-green-500" />
            </div>
            <div className="animate-bounce delay-300">
              <CheckCircle className="w-12 h-12 text-purple-500" />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Track Your
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Orders
            </span>
            <span className="block text-4xl md:text-5xl mt-2">in Real-Time</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Never wonder about your package again. Get instant updates, accurate delivery estimates, 
            and complete visibility into your order journey from checkout to doorstep.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/signup"
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-full hover:shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 min-w-[200px]"
              onMouseEnter={() => setIsHovered('signup')}
              onMouseLeave={() => setIsHovered(null)}
            >
              <span className="relative z-10">Create Account</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <Link href="/login"
              className="group px-8 py-4 bg-background text-foreground text-lg font-semibold rounded-full border-2 border-border hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transform hover:scale-105 transition-all duration-300 min-w-[200px]"
              onMouseEnter={() => setIsHovered('login')}
              onMouseLeave={() => setIsHovered(null)}
            >
              Login
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-card/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-border">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Real-Time Updates</h3>
              <p className="text-muted-foreground">Get instant notifications when your package status changes, from processing to delivered.</p>
            </div>

            <div className="bg-card/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-border">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Live Location</h3>
              <p className="text-muted-foreground">See exactly where your package is on an interactive map with precise location tracking.</p>
            </div>

            <div className="bg-card/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-border">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Delivery Guarantee</h3>
              <p className="text-muted-foreground">Get accurate delivery estimates and proactive alerts if there are any delays or issues.</p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">1M+</div>
              <div className="text-muted-foreground">Orders Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">99.9%</div>
              <div className="text-muted-foreground">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">50K+</div>
              <div className="text-muted-foreground">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">24/7</div>
              <div className="text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 mt-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Package className="w-8 h-8 text-blue-400" />
              <h3 className="text-2xl font-bold">TrackIt</h3>
            </div>
            <p className="text-gray-400 mb-8">Your trusted partner for order tracking</p>
            <div className="flex justify-center space-x-8 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
            <p className="text-gray-500 text-sm mt-8">© 2024 TrackIt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}