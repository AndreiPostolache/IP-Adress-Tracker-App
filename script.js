const btn = document.querySelector("#button");
const input = document.querySelector("#form");
const ipValue = document.querySelector("#ip");
const userLocation = document.querySelector("#location");
const userIsp = document.querySelector("#isp");
const userTimezone = document.querySelector("#timezone");

let map;
let marker;

// Get the user's IP address and display their location on the map
window.addEventListener("DOMContentLoaded", async function () {
  const ipFetch = await fetch("https://api.ipify.org?format=json");
  const dataFetch = await ipFetch.json();
  console.log(dataFetch);
  await ipLocation(dataFetch.ip);
});

// Update the marker position on the map based on IP address
const ipLocation = async function (ip) {
  try {
    const ipFetch = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=at_vEZDW3vA9DHLmL40DKG34AFv71M1I&ipAddress=${ip}`
    );
    const dataFetch = await ipFetch.json();
    const { lat: latitude, lng: longitude } = dataFetch.location;

    ipValue.textContent = dataFetch.ip;
    userLocation.textContent = `${dataFetch.location.city}, ${dataFetch.location.country}`;
    userTimezone.textContent = dataFetch.location.timezone;
    userIsp.textContent = dataFetch.isp;

    // Update marker icon image
    const myIcon = L.icon({
      iconUrl: "./images/icon-location.svg",
      iconSize: [30, 40],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76],
    });

    // Update marker position
    if (marker) {
      marker.setLatLng([latitude, longitude]);
    } else {
      // Create new marker and add it to the map
      marker = L.marker([latitude, longitude], { icon: myIcon }).addTo(map);
    }

    // Pan the map to the new marker position
    map.panTo([latitude, longitude]);
  } catch (err) {
    console.log(err);
  }
};

// Initialize the map and add the tile layer
map = L.map("map").setView([0, 0], 15);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Handle user input
btn.addEventListener("click", function (e) {
  e.preventDefault();
  ipLocation(input.value);
});
