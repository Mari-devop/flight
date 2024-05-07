document.addEventListener('DOMContentLoaded', function () {
    const map = L.map('map').setView([51.505, -0.09], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);


    let flightData = null;
    let interval = null;
    let marker = L.marker([51.505, -0.09]).addTo(map); // Initial marker position

    let startLatLng = [51.505, -0.09]; // Store the start point coordinates
    let latLng = [51.505, -0.09]; // Current marker position

    fetch('flight_data.json')
        .then(response => response.json())
        .then(data => {
            flightData = data;
            document.getElementById('startButton').addEventListener('click', function () {
                resetAndStartAnimation(); // Modified to reset coordinates before starting animation
            });

            document.getElementById('stopButton').addEventListener('click', function () {
                clearInterval(interval);
                marker.setLatLng(startLatLng); // Reset marker position to start point
                latLng = startLatLng; // Reset latLng to start point
            });
        });

    function calculateNewLatLng(currentLatLng, speedKmph, directionDegrees) {
        const directionRadians = directionDegrees * (Math.PI / 180);
        const deltaX = speedKmph * Math.cos(directionRadians) * (1 / 3600);
        const deltaY = speedKmph * Math.sin(directionRadians) * (1 / 3600);
        const newLatLng = [
            currentLatLng[0] + deltaX,
            currentLatLng[1] + deltaY
        ];
        return newLatLng;
    }

    function resetAndStartAnimation() {
        marker.setLatLng(startLatLng); // Reset marker position to start point
        latLng = startLatLng; // Reset latLng to start point

        clearInterval(interval); // Clear any existing animation interval
        let i = 0;
        interval = setInterval(() => {
            if (i < flightData.length) {
                const { speed, direction } = flightData[i];
                latLng = calculateNewLatLng(latLng, parseFloat(speed), parseFloat(direction));
                marker.setLatLng(latLng); // Update marker position
                console.log("New coordinates:", latLng);
                i++;
            } else {
                clearInterval(interval);
                console.log("Flight completed");
            }
        }, 1000);
    }
});