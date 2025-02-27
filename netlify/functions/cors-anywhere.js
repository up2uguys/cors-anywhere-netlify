const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const targetUrl = event.queryStringParameters.url;

    if (!targetUrl) {
        return {
            statusCode: 400,
            body: 'Please provide a URL to proxy',
        };
    }

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

        return {
            statusCode: response.status,
            headers: {
                'access-control-allow-origin': '*',
                ...response.headers.raw(),
            },
            body,
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: `Error: ${error.message}`,
        };
    }
};
