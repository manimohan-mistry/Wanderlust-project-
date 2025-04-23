// console.log(mapToken);
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    // center: [79.08491000,21.14631000], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    center: listing.geometry.coordinates,
    zoom: 9 // starting zoom
});

console.log(listing.geometry.coordinates)

const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates) // listing.geometry.coordinates
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h4>${listing.location}</h4><p>exact location will be provided after bookin!</p)`))
    .addTo(map);


// map.on('load', () => {
//     const width = 64; // The image will be 64 pixels square
//     const bytesPerPixel = 4; // Each pixel is represented by 4 bytes: red, green, blue, and alpha.
//     const data = new Uint8Array(width * width * bytesPerPixel);

//     for (let x = 0; x < width; x++) {
//         for (let y = 0; y < width; y++) {
//             const offset = (y * width + x) * bytesPerPixel;
//             data[offset + 0] = (y / width) * 255; // red
//             data[offset + 1] = (x / width) * 255; // green
//             data[offset + 2] = 128; // blue
//             data[offset + 3] = 255; // alpha
//         }
//     }
//     map.addImage('gradient', { width: width, height: width, data: data })
// })