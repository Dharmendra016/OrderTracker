// app/ordertracking/page.tsx
'use client';
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamically import the client component
const OrderTrackingClient = dynamic(() => import("@/components/orderTracking"), {
  ssr: false,
});

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<p>Loading tracking view...</p>}>
      <OrderTrackingClient />
    </Suspense>
  );
}
