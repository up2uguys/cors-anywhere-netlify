const fetch = require('node-fetch');
const punycode = require('punycode'); // Gunakan punycode.js sebagai alternatif

exports.handler = async function(event, context) {
    const targetUrl = event.queryStringParameters.url;

    if (!targetUrl) {
        return {
            statusCode: 400,
            body: 'Please provide a URL to proxy',
        };
    }

    console.log('Fetching URL:', targetUrl);

    const options = {
        method: event.httpMethod,
        headers: {
            ...event.headers,
            host: new URL(targetUrl).host,
        },
    };

    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(event.httpMethod)) {
        options.body = event.body;
    }

    try {
        const response = await fetch(targetUrl, options);
        const body = await response.text();

        console.log('Response status:', response.status);
        console.log('Response body:', body);

        return {
            statusCode: response.status,
            headers: {
                'access-control-allow-origin': '*',
                'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'access-control-allow-headers': 'Content-Type, Authorization',
                ...response.headers.raw(),
            },
            body,
        };
    } catch (error) {
        console.error('Error fetching URL:', error);
        return {
            statusCode: 500,
            headers: {
                'access-control-allow-origin': '*',
            },
            body: `Error: ${error.message}`,
        };
    }
};
