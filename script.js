document.getElementById('flight-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const departureDate = document.getElementById('departure-date').value;

    const formData = {
        origin: origin,
        destination: destination,
        departure_date: departureDate
    };

    fetch('http://localhost:5000/get_flight_prices', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Flight data received:', data);
        displayResults(data);
    })
    .catch(error => {
        console.error('Error fetching flight data:', error);
        document.getElementById('results').innerHTML = `<p>Error: ${error.message}</p>`;
    });
});

function displayResults(flightOffers) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    flightOffers.forEach(offer => {
        const price = offer.price.total;
        const departureTime = offer.itineraries[0].segments[0].departure.at;
        const arrivalTime = offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1].arrival.at;
        const airline = offer.validatingAirlineCodes[0];

        const offerDiv = document.createElement('div');
        offerDiv.classList.add('offer');
        offerDiv.innerHTML = `
            <p><strong>Airline:</strong> ${airline}</p>
            <p><strong>Price:</strong> $${price}</p>
            <p><strong>Departure Time:</strong> ${departureTime}</p>
            <p><strong>Arrival Time:</strong> ${arrivalTime}</p>
        `;
        resultsDiv.appendChild(offerDiv);
    });
}
