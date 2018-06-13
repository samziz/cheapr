const googleMapsClient = require('@google/maps').createClient({
    key: process.env.REACT_APP_GMAPS_KEY,
    Promise: Promise
});

export const getCoordsFromString = async string => {
    const response = await googleMapsClient.geocode({ address: string }).asPromise();
    const { results } = response.json;
    if (Array.isArray(results)) {
        const firstResult = results[0];
        return firstResult.geometry.location;
    } else {
        throw new Error('Error: Badly formatted response from Geocode API');
    }
};