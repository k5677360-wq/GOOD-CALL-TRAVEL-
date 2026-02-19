"""
Good Call Travel - Flask Backend
Integra el scraper de Costamar con el frontend.
"""

from flask import Flask, request, jsonify
try:
    from flask_cors import CORS
except ImportError:
    CORS = None
import traceback

from costamar_v4 import buscar_vuelos_api, extraer_info_vuelo, AEROPUERTOS

app = Flask(__name__)

if CORS:
    CORS(app)
else:
    @app.after_request
    def add_cors(response):
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        return response


@app.route('/api/search', methods=['POST'])
def search_flights():
    """
    Busca vuelos via la API de Costamar.
    Body: { origin, destination, departDate, returnDate, tripType, passengers }
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'success': False, 'error': 'No se recibieron datos'}), 400

    origin      = data.get('origin')
    destination = data.get('destination')
    depart_date = data.get('departDate')
    return_date = data.get('returnDate')
    passengers  = data.get('passengers', {})

    if not all([origin, destination, depart_date]):
        return jsonify({'success': False, 'error': 'Faltan campos requeridos'}), 400

    adults   = passengers.get('adults', 1)
    children = passengers.get('children', 0)
    infants  = passengers.get('infants', 0)

    try:
        print("[SEARCH] {} -> {} | {} | pax: {}/{}/{}".format(
            origin, destination, depart_date, adults, children, infants))

        # Vuelos de ida
        outbound_raw = buscar_vuelos_api(
            origin, destination, depart_date, None, adults, children, infants
        )
        outbound = [
            _format_flight(extraer_info_vuelo(
                v, origin, destination, depart_date, None, adults, children, infants
            ))
            for v in outbound_raw[:10]
        ]

        # Vuelos de retorno
        ret = []
        if return_date:
            return_raw = buscar_vuelos_api(
                destination, origin, return_date, None, adults, children, infants
            )
            ret = [
                _format_flight(extraer_info_vuelo(
                    v, destination, origin, return_date, None, adults, children, infants
                ))
                for v in return_raw[:10]
            ]

        print("[RESULT] {} ida, {} vuelta".format(len(outbound), len(ret)))

        return jsonify({
            'success': True,
            'outbound': outbound,
            'return': ret,
            'search_params': {
                'origin': origin,
                'destination': destination,
                'depart_date': depart_date,
                'return_date': return_date,
                'passengers': passengers
            }
        })

    except Exception as exc:
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(exc)}), 500


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})


@app.route('/api/airports', methods=['GET'])
def airports():
    data = [
        {'code': code, 'name': name, 'displayName': '{} ({})'.format(name, code)}
        for code, name in AEROPUERTOS.items()
    ]
    return jsonify({'airports': data})


def _format_flight(info):
    """Transforma la salida del scraper al formato que espera el frontend."""
    return {
        'id': info.get('numero_vuelo', 'N/A'),
        'airline': info.get('aerolinea', 'N/A'),
        'from': info.get('origen', ''),
        'to': info.get('destino', ''),
        'departTime': info.get('hora_salida', 'N/A'),
        'arrivalTime': info.get('hora_llegada', 'N/A'),
        'duration': _parse_duration(info.get('duracion', '0h 0m')),
        'isDirect': info.get('escalas', 1) == 0,
        'stops': info.get('escalas', 0),
        'price': float(info.get('precio', 0)),
        'flightNumber': info.get('numero_vuelo', 'N/A'),
        'fareClass': info.get('clase', 'Economy'),
        'personalItem': info.get('personal_item', 'Incluido (bolso/mochila)'),
        'handBaggage': info.get('equipaje_mano', 'No especificado'),
        'checkedBaggage': info.get('equipaje_bodega', 'No especificado'),
    }


def _parse_duration(s):
    try:
        parts = s.replace('h','').replace('m','').split()
        return int(parts[0])*60 + (int(parts[1]) if len(parts)>1 else 0)
    except (ValueError, IndexError):
        return 90


if __name__ == '__main__':
    print("\n  Good Call Travel - Backend")
    print("  " + "-"*35)
    print("  POST /api/search    Buscar vuelos")
    print("  GET  /api/health    Health check")
    print("  GET  /api/airports  Aeropuertos")
    print("  http://localhost:5000\n")
    app.run(host='0.0.0.0', port=5000, debug=True)
