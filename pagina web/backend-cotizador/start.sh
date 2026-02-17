#!/usr/bin/env bash
set -euo pipefail

echo ""
echo "  Good Call Travel - Cotizador de Vuelos"
echo "  ======================================="
echo ""

if ! command -v python3 &>/dev/null; then
    echo "  Error: Se requiere Python 3."
    exit 1
fi

echo "  Python: $(python3 --version)"
echo ""
echo "  1) Modo demo   (solo frontend, datos simulados)"
echo "  2) Modo completo (frontend + backend API real)"
echo ""
read -rp "  Elige [1/2]: " MODE

case "$MODE" in
    1)
        echo ""
        echo "  Iniciando servidor demo en http://localhost:8000"
        python3 -m http.server 8000
        ;;
    2)
        if ! python3 -c "import flask" 2>/dev/null; then
            echo "  Instalando dependencias..."
            pip3 install -r requirements.txt
        fi
        if grep -q "USE_MOCK = true" app.js 2>/dev/null; then
            sed -i.bak 's/USE_MOCK = true/USE_MOCK = false/' app.js
            echo "  Frontend configurado para API real."
        fi
        echo "  Iniciando backend en http://localhost:5000"
        python3 backend.py &
        BACKEND_PID=$!
        trap "kill $BACKEND_PID 2>/dev/null" EXIT
        sleep 2
        echo "  Iniciando frontend en http://localhost:8000"
        echo ""
        echo "  Frontend: http://localhost:8000"
        echo "  Backend:  http://localhost:5000"
        echo "  Ctrl+C para detener."
        echo ""
        python3 -m http.server 8000
        ;;
    *) echo "  Opcion invalida."; exit 1;;
esac
