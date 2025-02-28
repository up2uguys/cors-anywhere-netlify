const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const targetUrl = event.queryStringParameters.url;

    if (!targetUrl) {
        return {
            statusCode: 400,
            body: 'Please provide a URL to proxy',
        };
    }

    console.log('Fetching URL:', targetUrl);

    try {
        const response = await fetch(targetUrl, {
            method: event.httpMethod,
            headers: {
                ...event.headers,
                host: new URL(targetUrl).host,
            },
            body: event.body,
        });

        const body = await response.text();

        console.log('Response status:', response.status);
        console.log('Response body:', body);

        return {
            statusCode: response.status,
            headers: {
                'access-control-allow-origin': '*',
                ...response.headers.raw(),
            },
            body,
        };
    } catch (error) {
        console.error('Error fetching URL:', error);
        return {
            statusCode: 500,
            body: `Error: ${error.message}`,
        };
    }
};
