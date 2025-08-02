import MapComponent from "@/components/MapComponent";

export default function Page() {
    return (
        <div className="flex flex-col h-full w-full items-center justify-center">
        <h1 className="text-2xl font-bold">Map Page</h1>
        <MapComponent/>
        </div>
    );
    }
