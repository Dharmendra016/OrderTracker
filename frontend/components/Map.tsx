"use client";
import { MapContainer, TileLayer, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Map(){

    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100vh", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <CircleMarker center={[51.505, -0.09]} radius={20} color="blue">
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </CircleMarker>
        </MapContainer>
    )
}