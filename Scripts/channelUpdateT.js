const Carina = require('carina').Carina;
const ws = require('ws');

Carina.WebSocket = ws;

const channelId = 38537887;

const ca = new Carina({
    queryString: {
        'Client-ID': 'd43323de123cbfacfff584781ab0fe0f9a74e3dcf0790c63',
    },
    isBot: true,
}).open();

ca.subscribe(`channel:${channelId}:update`, data => {
    console.log(data);
});