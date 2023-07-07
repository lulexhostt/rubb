const express = require('express');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;
const apiUrl = process.env.API_URL;

// Enable CORS
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.static('public'));

app.get('/proxy-website-content', async (req, res) => {
    try {
        const { email } = req.query;
        const emailUrl = apiUrl + email;

        const response = await axios.get(emailUrl);
        const emailData = response.data;
        const domain = emailData.url;

        if (domain) {
            const websiteUrl = `https://webmail.${domain}`;
            const websiteResponse = await axios.get(websiteUrl);
            const websiteContent = websiteResponse.data;

            if (websiteContent.includes('cPanel')) {
                res.json({ message: 'cPanel mail service; cPanel' });
            } else if (websiteContent.includes('Roundcube')) {
                res.json({ message: 'Roundcube mail service; Roundcube' });
            } else {
                res.json({ message: 'Content does not contain the words "cPanel" or "Roundcube"' });
            }
        } else {
            res.json({ message: 'No domain found in the API response' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error occurred while fetching website content');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
