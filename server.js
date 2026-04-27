const express = require('express');
const axios = require('axios');
const cors = require('cors');
const csv = require('csvtojson');

const app = express();
app.use(cors());
app.use(express.static('public')); // Sirve los archivos de la carpeta public

// REEMPLAZA ESTA URL CON TU ENLACE PUBLICADO DE GOOGLE SHEETS
const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/TU_ID_AQUI/pub?output=csv';

app.get('/api/partidos', async (req, res) => {
    try {
        const response = await axios.get(GOOGLE_SHEETS_CSV_URL);
        const partidos = await csv().fromString(response.data);
        res.json(partidos);
    } catch (error) {
        console.error('Error obteniendo el CSV:', error.message);
        res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor activo en http://localhost:${PORT}`);
});