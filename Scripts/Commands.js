   // Some of these commands are coded for a specific user so you need to chnage it to your own channel.
   // When I release it officially I will change the user. 
   const Mixer = require('@mixer/client-node');
    const ws = require('ws');

    let userInfo;

    const client = new Mixer.Client(new Mixer.DefaultRequestRunner());

    // With OAuth we don't need to log in. The OAuth Provider will attach
    // the required information to all of our requests after this call.
    client.use(new Mixer.OAuthProvider(client, {
        tokens: {
            access: 'auth key here',
            expires: Date.now() + (365 * 24 * 60 * 60 * 1000)
        },
    }));

    // Gets the user that the Access Token we provided above belongs to.
    client.request('GET', 'users/current')
    .then(response => {
        userInfo = response.body;
        return new Mixer.ChatService(client).join(response.body.channel.id);
    })
    .then(response => {
        const body = response.body;
        return createChatSocket(userInfo.id, userInfo.channel.id, body.endpoints, body.authkey);
    })
    .catch(error => {
        console.error('Something went wrong.');
        console.error(error);
    });

    /**
    * Creates a Mixer chat socket and sets up listeners to various chat events.
    * @param {number} userId The user to authenticate as
    * @param {number} channelId The channel id to join
    * @param {string[]} endpoints An array of endpoints to connect to
    * @param {string} authkey An authentication key to connect with
    * @returns {Promise.<>}
    */

   

    function createChatSocket (userId, channelId, endpoints, authkey) {
        // Chat connection
        const socket = new Mixer.Socket(ws, endpoints).boot();

        // Greet a joined user
        socket.on('UserJoin', data => {
            socket.call('msg', [`Hi ${data.username} test bot activated. If this is the wrong chat just ban me and I wont come back. `]);
        });

        // React to our !pong comamand
        socket.on('ChatMessage', data => {
            if (data.message.message[0].data.toLowerCase().startsWith('!ping')) {
                socket.call('msg', [`@${data.user_name} PONG!`]);
                console.log(`Ponged ${data.user_name}`);
            }
        });


        // React to our gamertag command
        socket.on('ChatMessage', data => {
            if (data.message.message[0].data.toLowerCase().startsWith('!gt')) {
                socket.call('msg', [`@${data.user_name} My gamertag is DazeMoist`]);
                console.log(` ${data.user_name} asked for your gamertag`);
            }
        });


        // Testing a command
        socket.on('ChatMessage', data => {
            if (data.message.message[0].data.toLowerCase().startsWith('!testing')) {
                socket.call('msg', [`@${data.user_name} testing`]);
                console.log(` ${data.user_name} tested a command`);
            }
        });


        // Testing a command
        socket.on('ChatMessage', data => {
            if (data.message.message[0].data.toLowerCase().startsWith('!test command')) {
                client.request('GET', `channels/Mytho`)
                .then(res => {
                        const viewers = res.body.viewersTotal;

                socket.call('msg', [`@${data.user_name} ${viewers}`]);
                });
                console.log(` ${data.user_name} tested a command`);
            }
        });


         // Gets the sparks of a viewer
        socket.on('ChatMessage', data => {
            if (data.message.message[0].data.toLowerCase().startsWith('!sparks')) {
                client.request('GET', `channels/Mytho`)
                .then(res => {
                        const sparks = res.body.user.sparks;

                socket.call('msg', [`@${data.user_name} Mytho has ${sparks} sparks!`]);
                });
                console.log(` ${data.user_name} retrieved your spark amount`);
            }
        });


         /// Gets the stats of mytho
        socket.on('ChatMessage', data => {
            if (data.message.message[0].data.toLowerCase().startsWith('!stats')) {
                client.request('GET', `channels/Mytho`)
                .then(res => {
                        const sparks = res.body.user.sparks;
                        const free = res.body.numFollowers;
                        const tree = res.body.viewersTotal;
                        const another = res.body.online;
                        const ready = res.body.id

                socket.call('msg', [`@${data.user_name} Mytho has ${sparks} sparks and ${free} followers also ${tree} views. Online? ${another} . ID is ${ready}`]);
                });
                console.log(` ${data.user_name} retrieved your spark amount`);
            }
        });


        // Handle errors
        socket.on('error', error => {
            console.error('Socket error');
            console.error(error);
        });

        return socket.auth(channelId, userId, authkey)
        .then(() => {
            console.log('Login successful');
            return socket.call('msg', ['Hi! I\'m a robot. I excute commands for you!']);
        });
    }