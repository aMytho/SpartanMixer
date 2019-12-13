const Carina = require('carina').Carina;
const ws = require('ws');

Carina.WebSocket = ws;

const channelId = 38537887;

const ca = new Carina({
    queryString: {
        'Client-ID': 'auth key here',
    },
    isBot: true,
}).open();

ca.subscribe(`channel:${channelId}:update`, data => {
    console.log(data);
});