import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1>Welcome to the Order Tracker</h1>
      <p>This is the home page of the Order Tracker application.</p>
      <Link href="/ordertracking" className="text-blue-600">Track an Order</Link>
    </div>
  );
}