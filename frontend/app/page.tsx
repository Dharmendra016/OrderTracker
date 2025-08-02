import Link from "next/link";

export default function Home() {
  
  return (
      
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-center mt-10">Welcome to the Delivery App</h1>
      <p className="text-center mt-4">This is a simple delivery app built with Next.js and Socket.IO.</p>
      <div className="flex justify-center mt-10">
        <Link href="/login" className="px-6 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600">Login</Link>
        <Link href="/register" className="ml-4 px-6 py-3 bg-green-500 text-white rounded-2xl hover:bg-green-600">Register</Link>
      </div>
      <div className="mt-10 text-center">
        <p className="text-gray-600">© 2023 Delivery App. All rights reserved.</p>
      </div>
    </div>

  );
}
