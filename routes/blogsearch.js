const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const _ = require('lodash');

const memoizedSearch = _.memoize((search, data) => {
    return _.filter(data, (t) => {
        return t.title.toLowerCase().split(" ").includes(search.toLowerCase());
    });
});

router.get('/', async (req, res) => {
    let search = req.query.query;

    const options = {
        method: 'GET',
        headers: {
            'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
        }
    };

    try {
        const response = await fetch('https://intent-kit-16.hasura.app/api/rest/blogs', options);

        if (!response.ok) {
            throw new Error('Error fetching data from the API');
        }

        const data = await response.json();

        if (!data || !data.blogs || !Array.isArray(data.blogs)) {
            throw new Error('Invalid data format from the API');
        }

        // Use the memoizedSearch function to perform the search
        const word = memoizedSearch(search, data.blogs);

        res.send(word);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
