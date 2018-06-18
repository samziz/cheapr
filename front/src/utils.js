const googleMapsClient = require('@google/maps').createClient({
    key: process.env.REACT_APP_GMAPS_KEY,
    Promise: Promise
});

export const capitalise = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export const getCoordsFromString = async string => {
    const response = await googleMapsClient.geocode({ address: string }).asPromise();
    const { results } = response.json;
    if (Array.isArray(results)) {
        const firstResult = results[0];
        return { 
            location: firstResult.geometry.location, 
            name: firstResult.address_components[0].long_name 
        };
    } else {
        throw new Error('Error: Badly formatted response from Geocode API');
    }
};