const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const _ = require('lodash');

router.get("/", async (req, res) => {
    const options = {
        method: 'GET',
        headers: {
            'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
        }
    };

    try {
        const response = await fetch('https://intent-kit-16.hasura.app/api/rest/blogs', options);

        if (!response.ok) {
            // Handle non-successful response from the third-party API
            throw new Error('Error fetching data from the API');
        }

        const data = await response.json();

        if (!data || !data.blogs || !Array.isArray(data.blogs)) {
            throw new Error('Invalid data format from the API');
        }

        const size = _.size(data.blogs);
        const titleMax = _.maxBy(data.blogs, function (t) {
            return t.title.length;
        });
        const unique = _.uniq(_.map(data.blogs, "title"));
        const privacyWord = _.filter(data.blogs, function (t) {
            return t.title.search(/privacy/i) >= 0;
        });

        res.send({
            size,
            "titleMax": titleMax.title,
            unique,
            privacyWord
        });
    } catch (error) {
        // Handle errors that occurred during data retrieval, analysis, or search
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;



module.exports = router