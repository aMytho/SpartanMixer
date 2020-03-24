// Load in some dependencies
const Mixer = require('@mixer/client-node');
const ws = require('ws');


// Instantiate a new Mixer Client
const client = new Mixer.Client(new Mixer.DefaultRequestRunner());

/* With OAuth we don't need to log in. The OAuth Provider will attach
 * the required information to all of our requests after this call.
 * They'll also be authenticated with the user information of the user
 * who owns the token provided.
 */
client.use(new Mixer.OAuthProvider(client, {
    tokens: {
        access: 'auth key here',
        expires: Date.now() + (365 * 24 * 60 * 60 * 1000)
    },
}));

/* Gets our Currently Authenticated Mixer user's information. This returns an object
 * full of useful information about the user whose OAuth Token we provided above.
 */
async function getUserInfo() {
    // Users Current will return information about the user who owns the OAuth
    // token registered above.
    return client.request('GET', 'users/current').then(response => response.body);
}

/**
 * Gets connection information from Mixer's chat servers
 * @param {Number} channelId The channelId of the channel you'd like to
 *  get connection information for.
 * @returns {Promise.<>}
 */
async function getConnectionInformation(channelId) {
    return new Mixer.ChatService(client).join(channelId).then(response => response.body);
}

/**
 * Creates a Mixer chat socket and authenticates
 * @param {number} userId The user to authenticate as
 * @param {number} channelId The channel id of the channel you want to join
 * @returns {Promise.<>}
 */
async function joinChat(userId, channelId) {
    const joinInformation = await getConnectionInformation(channelId);
    // Chat connection
    const socket = new Mixer.Socket(ws, joinInformation.endpoints).boot();

    return socket.auth(channelId, userId, joinInformation.authkey).then(() => socket);
}

// Get our Bot's User Information, Who are they?
getUserInfo().then(async userInfo => {

    /* Join our target Chat Channel, in this case we'll join
     * our Bot's channel.
     * But you can replace the second argument of this function with ANY Channel ID.
     */
    const socket = await joinChat(userInfo.id, userInfo.channel.id);

    // Send a message once connected to chat.
    socket.call('msg', [`Hi! I'm connected!`]) && console.log('You are connected to chat. Go to your chat!');

    // Greet a user when they join your stream. This "calls out the lurkers" so you may want to delete it.
    socket.on('UserJoin', data => {
        socket.call('msg',[
            `Hi ${data.username}! I'm pingbot! Write !ping and I will pong back!`,
        ]);
    });

    // React to our !ping command
    // When there's a new chat message.
    socket.on('ChatMessage', data => {
          if (typeof data.message.message[0].data !== 'undefined') { // Add this for every command. Prevents bot crashing from non chatmessage events.
        if (data.message.message[0].data.toLowerCase().startsWith('!ping')) {
            // Respond with pong
            socket.call('msg', [`@${data.user_name} PONG!`]);
            console.log(`Ponged ${data.user_name}`);
        }}
    });

    
// React to our gamertag command. This is an example of how to add your own commands.
socket.on('ChatMessage', data => {
      if (typeof data.message.message[0].data !== 'undefined') {
    if (data.message.message[0].data.toLowerCase().startsWith('!gt')) {
        socket.call('msg', [`@${data.user_name} My gamertag is DazeMoist`]);
        console.log(` ${data.user_name} asked for your gamertag`);
    }}
});


// Just another command. You can use this block to test commands and their effects. or not, doesn't really matter
socket.on('ChatMessage', data => {
      if (typeof data.message.message[0].data !== 'undefined') {
    if (data.message.message[0].data.toLowerCase().endsWith('!testing')) {
        socket.call('msg', [`@${data.user_name} testing`]);
        console.log(` ${data.user_name} tested a command`);
    }}
});






 // Gets the sparks of a viewer
socket.on('ChatMessage', data => {
      if (typeof data.message.message[0].data !== 'undefined') {
    if (data.message.message[0].data.toLowerCase().startsWith('!sparks')) {
        name = (data.message.message[0].data); // We make a variable out of the message.
        let nameD = name.slice(8); // We slice the message. The sliced message is now a variable. This will be the name of the user. !sparks Mytho
        client.request('GET',`channels/${nameD}`) // Make a request to the api. 
        .then(res => {
                const sparks = res.body.user.sparks; // We make the spark value a variable. T
        socket.call('msg', [`@${data.user_name} ${nameD} has ${sparks} sparks!`]); // Sends it to chat.
        });
        console.log(` ${data.user_name} retrieved ${nameD}'s spark amount`);
    }}
});




 /// Gets the stats of mytho. To change to your channel replace '/channels/mytho' with '/channels/yourname'
socket.on('ChatMessage', data => {
      if (typeof data.message.message[0].data !== 'undefined') {
    if (data.message.message[0].data.toLowerCase().startsWith('!stats')) {
        client.request('GET', `channels/Mytho`)
        .then(res => {
                const sparks = res.body.user.sparks;
                const free = res.body.numFollowers;
                const tree = res.body.viewersTotal;
                const another = res.body.online;
                const ready = res.body.id

        socket.call('msg', [`@${data.user_name} Mytho has ${sparks} sparks and ${free} followers also ${tree} views. Online? ${another} . ID is ${ready}`]); // ok I'll stop with the weird variable names now.
        });
        console.log(` ${data.user_name} retrieved your spark amount`);
    }}
});

    // Handle errors
    socket.on('error', error => {
        console.error('Socket error');
        console.error(error);
    });
});