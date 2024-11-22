const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/countries', async (req, res) => {
    try {
        const response = await axios.get('https://date.nager.at/api/v3/AvailableCountries');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching countries' });
    }
});

app.get('/api/country/:code', async (req, res) => {
    const countryCode = req.params.code;
    try {
        const borderResponse = await axios.get(`https://date.nager.at/api/v3/CountryInfo/${countryCode}`);
        const populationResponse = await axios.get(`https://countriesnow.space/api/v0.1/countries/population`);
        const flagResponse = await axios.get(`https://countriesnow.space/api/v0.1/countries/flag/images`);
        console.log('Population response:', populationResponse.data);

        const countryInfo = {
            name: borderResponse.data.commonName,
            borders: borderResponse.data.borders,
            population: populationResponse.data.data.find(country => country.code === countryCode)?.populationCounts.at(-1)?.value,
            flag: flagResponse.data.data.find(flag => flag.iso2 === countryCode)?.flag,
        };

        res.json(countryInfo);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching country info' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});