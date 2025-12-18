console.log("Listing Coordinates:", listing.geometry);

mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/standard', // Use the standard style for the map
        projection: 'globe', // display the map as a globe
        zoom: 15, // initial zoom level, 0 is the world view, higher values zoom in
        center: listing.geometry.coordinates, // center the map on this longitude and latitude
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.scrollZoom.disable();

    map.on('style.load', () => {
        map.setFog({}); // Set the default atmosphere style
    });

const popupOffsets = {
  top: [0, 10],
  bottom: [0, -10],
  left: [10, 0],
  right: [-10, 0],
};


// create a marker at a coordinate
const marker = new mapboxgl.Marker({color: "red"})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset: popupOffsets})
    .setHTML(`<h3>${listing.location}</h3><p>Extact location</p>`)
    .setMaxWidth("300px"))
    .addTo(map);

console.log("Listing Coordinates:", listing.geometry);
