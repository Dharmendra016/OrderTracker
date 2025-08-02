
export const getLocationCoordinates = async ( address : string): Promise<{ latitude: number, longitude: number }> => {

    try {
        
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);

        if (!response.ok) {
            throw new Error("Failed to fetch location coordinates");
        }

        const data = await response.json();
        if (data.length === 0) {
            throw new Error("No coordinates found for the given address");
        }
        
        const { lat, lon } = data[0];
        
        return {
            latitude: parseFloat(lat),
            longitude: parseFloat(lon)
        };

    } catch (error) {
        console.error("Error in getLocationCoordinates:", error);
        throw new Error("Failed to get location coordinates");
    }


}


export const getDistance = (origin: { latitude: number, longitude: number }, destination: { latitude: number, longitude: number }) => {

    try {

        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (destination.latitude - origin.latitude) * (Math.PI / 180);
        const dLon = (destination.longitude - origin.longitude) * (Math.PI / 180);

        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(origin.latitude * (Math.PI / 180)) * Math.cos(destination.latitude * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers

        return distance;


    } catch (error) {
        console.error("Error in getDistance:", error);
        throw new Error("Failed to calculate distance");        
    }


}

