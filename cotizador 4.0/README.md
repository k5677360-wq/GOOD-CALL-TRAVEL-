# Good Call Travel - Cotizador de Vuelos

Sistema de búsqueda y cotización de vuelos con detalle expandible, información de equipaje y precios en tiempo real.

## Estructura

```
├── index.html          Página principal
├── styles.css          Estilos
├── app.js              Lógica del frontend
├── backend.py          Servidor Flask
├── costamar_v4.py      Scraper Costamar v4.2
├── logos/              Carpeta para logos de aerolíneas
│   ├── LA.png          LATAM Airlines
│   ├── H2.png          Sky Airline
│   ├── JA.png          JetSMART
│   └── ...             (agregar según necesidad)
├── requirements.txt    Dependencias Python
├── start.sh            Script de inicio
└── README.md
```

## Logos de aerolíneas

Crea una carpeta `logos/` junto a los archivos y coloca las imágenes PNG de cada aerolínea nombradas con su código IATA:
- `LA.png` para LATAM Airlines
- `H2.png` para Sky Airline  
- `JA.png` para JetSMART
- `AV.png` para Avianca

Si el logo no existe, se mostrará el código de la aerolínea como placeholder.

## Inicio rápido

### Modo demo
Abre `index.html` en el navegador. Funciona con datos simulados.

### Modo completo
```bash
pip install -r requirements.txt
python backend.py          # http://localhost:5000
python -m http.server 8000 # http://localhost:8000
```
En `app.js` cambiar `USE_MOCK = true` a `USE_MOCK = false`.

## Características
- Tarjetas de vuelo expandibles con detalle completo
- Iconos de equipaje (bolso personal, mano, facturado)
- Logos de aerolíneas configurables
- Tarifas LIGHT / PLUS / FULL
- Filtro de vuelos directos
- Ordenamiento por precio, duración u hora
- Cálculo de precios con impuestos
