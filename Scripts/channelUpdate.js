const Carina = require('carina').Carina;
const ws = require('ws');

Carina.WebSocket = ws;

const channelId = 38537887; // The channel you are listening for. You can listen for ANY channel.

const ca = new Carina({
    queryString: {
        'Client-ID': 'auth key here',
    },
    isBot: true,
}).open();

ca.subscribe(`channel:${channelId}:update`, data => { // Listens for any change in the channel such as title change,rating,game, etc.
    console.log(data); // Logs the data to the console.
});