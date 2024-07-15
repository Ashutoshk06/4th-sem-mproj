from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS for all origins

AMADEUS_ENDPOINT = 'https://test.api.amadeus.com'
amadeus_api_key = 'Q4f9te8hASUu0CnGPwbcjbjXmwIGa3x6'
amadeus_api_secret = 'iJSPvhlYG9dIQ4vn'


@app.route('/get_flight_prices', methods=['POST'])
def get_flight_prices():
    try:
        data = request.json
        origin = data.get('origin')
        destination = data.get('destination')
        departure_date = data.get('departure_date')
        
        # Normally, you would need to get the access token first
        # Here we assume the api_key is the bearer token for simplicity
        
        url = f"{AMADEUS_ENDPOINT}/v2/shopping/flight-offers"
        headers = {"Authorization": f"Bearer {amadeus_api_key}"}
        params = {
            "originLocationCode": origin,
            "destinationLocationCode": destination,
            "departureDate": departure_date,
            "adults": 1,
            "currencyCode": "USD",
            "nonStop": "false",
        }

        response = requests.get(url, headers=headers, params=params)
        data = response.json()

        if 'data' not in data:
            return jsonify({"error": "No flight options found."}), 404

        return jsonify(data['data'])

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(port=5000, debug=True)
