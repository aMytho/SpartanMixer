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
            access: 'Auth key here',
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

        // Greet a joined user. May get spam chat depending on how many vewers you have. It also "calls out the lurkers" which is usually not a good thing. Still, I'll keep it here if you need it.
        socket.on('UserJoin', data => {
            socket.call('msg', [`Hi ${data.username} I'm a robot! I like working for you and have no plans to attempt world domination.yet `]);
        });

        // React to our !pong comamand
        socket.on('ChatMessage', data => {
            if (data.message.message[0].data.toLowerCase().startsWith('!ping')) {
                socket.call('msg', [`@${data.user_name} PONG!`]);
                console.log(`Ponged ${data.user_name}`);
            }
        });

       

        // React to our gamertag command. This is an example of how to add your own commands.
        socket.on('ChatMessage', data => {
            if (data.message.message[0].data.toLowerCase().startsWith('!gt')) {
                socket.call('msg', [`@${data.user_name} My gamertag is DazeMoist`]);
                console.log(` ${data.user_name} asked for your gamertag`);
            }
        });


        // Testing a command
        socket.on('ChatMessage', data => {
            if (data.message.message[0].data.toLowerCase().endsWith('!testing')) {
                socket.call('msg', [`@${data.user_name} testing`]);
                console.log(` ${data.user_name} tested a command`);
            }
        });


      


    
         // Gets the sparks of a viewer
        socket.on('ChatMessage', data => {
            if (data.message.message[0].data.toLowerCase().startsWith('!sparks')) {
                name = (data.message.message[0].data);
                let nameD = name.slice(8);
                client.request('GET',`channels/${nameD}`)
                .then(res => {
                        const sparks = res.body.user.sparks;
                socket.call('msg', [`@${data.user_name} ${nameD} has ${sparks} sparks!`]);
                });
                console.log(` ${data.user_name} retrieved ${nameD}'s spark amount`);
            }
        });



        
         /// Gets the stats of mytho. To change to your channel replace '/channels/mytho' with '/channels/yourname'
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

    /*  This is the chatsocket containing the third party API's. If you wish to use it, delete the comment /* here and at the bottom of this document.

// I use this chatsocket for third party api's. It works well. Keeps it simple and separate
    function createChatSocket1 (userId, channelId, endpoints, authkey) {
        // Chat connection
        const socket = new Mixer.Socket(ws, endpoints).boot();

        
       
         // Advice API
         socket.on('ChatMessage', data => {
            if (data.message.message[0].data.toLowerCase().startsWith('!advice')) {
                request('https://api.adviceslip.com/advice', function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(body) //logs the message injson format
                     test = JSON.parse(body); // translates from json to js so we can use it
                      console.log(test.slip.advice);  //gives us the advice
                      let advice = test.slip.advice
                      socket.call('msg', [`${advice}`]);
                     }
                })
                console.log(` ${data.user_name} has recieved advice. Go change the world :)`);
            }
        });

        

        // Cat fact API
        socket.on('ChatMessage', data => {
            if (data.message.message[0].data.toLowerCase().startsWith('!cat')) {
                request('https://catfact.ninja/fact?max_length=360', function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                      console.log(body) //logs the message in json format
                      cat = JSON.parse(body); // translates from json to js so we can use it
                      let catfact = cat.fact // delcares the message as a var to use in the message for chat
                      socket.call('msg', [`${catfact}`]);
                     }
                })
                console.log(` ${data.user_name} learned a cat fact +1 IQ point`);
            }
        });


        // Dog fact API
        socket.on('ChatMessage', data => {
            if (data.message.message[0].data.toLowerCase().startsWith('!dog')) {
                request('https://some-random-api.ml/facts/dog', function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(body) //logs the message in json format
                     dog = JSON.parse(body); // translates from json to js so we can use it
                      let dogfact = dog.fact // delcares the message as a var to use in the message for chat
                      socket.call('msg', [`${dogfact}`]);
                     }
                })
                console.log(` ${data.user_name} learned a dog fact +1 IQ point`);
            }
        });


        // Pokedex API
        socket.on('ChatMessage', data => {
            if (data.message.message[0].data.toLowerCase().startsWith('!pokedex')){
                pokemonmessage = (data.message.message[0].data);
                let pokename = pokemonmessage.slice(9);
                socket.call('msg', [`@${data.user_name} ${pokename}, I choose you!`]);
                setTimeout(() => {
                    request(`https://some-random-api.ml/pokedex?pokemon=${pokename}`, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                     pokefact = JSON.parse(body); 
                      let pokeid = pokefact.id;
                      let pokeheight = pokefact.height;
                      let pokeweight = pokefact.weight;
                      let pokeExp = pokefact.base_experience;
                      let pokehp = pokefact.stats.hp;
                      let pokeattk = pokefact.stats.attack;
                      let pokedef = pokefact.stats.defense;
                      let pokespattk = pokefact.stats.sp_atk;
                      let pokespdef = pokefact.stats.sp_def;
                      let pokespeed = pokefact.stats.speed;
                      let poketotals = pokefact.stats.total;
                      let pokeEvolution = pokefact.family.evolutionStage;
                      let pokedesc = pokefact.description;
                      let pokegen = pokefact.generation;
                      let pokesprite0 = pokefact.sprites.normal;
                      let pokesprite1 = pokefact.sprites.animated;
                      let poketype = pokefact.type;
                      let poketype1 = poketype.toString();
                      let pokespecies = pokefact.species
                      let pokespecies1 = pokespecies.toString();
                      let pokeabilities = pokefact.abilities
                      let pokeabilities1 = pokeabilities.toString();
                      let pokegender = pokefact.gender
                      let pokegender1 = pokegender.toString();
                      let pokeegg = pokefact.egg_groups
                      let pokeegg1 = pokeegg.toString();
                      let pokeEvolutionNames = pokefact.family.evolutionLine;
                      let pokeEvolution1 = pokeEvolutionNames.toString();
                      
                      socket.call('msg', [`ID=${pokeid}, Height-${pokeheight}, Weight-${pokeweight}, Starting EXP-${pokeExp}, HP-${pokehp},ATTK-${pokeattk}, DEF-${pokedef},Specials (ATTK=${pokespattk}, DEF=${pokespdef}) Speed-${pokespeed}, Total-${poketotals}, Generation-${pokegen}, Evolution Stage-${pokeEvolution}, Order-${pokeEvolution1}`]);
                      setTimeout(() => {socket.call('msg', [`Type-${poketype1}, Species-${pokespecies1}, Abilities-${pokeabilities1}, Gender-${pokegender1}, Egg Groups-${pokeegg1}`]);}, 2000);
                      setTimeout(() => {socket.call('msg', [`Description:${pokedesc} Still Image: ${pokesprite0} Animated Image: ${pokesprite1} `]);}, 5000);       
                     }
                    })
                }, 2000);
                console.log(` ${data.user_name} has opened the pokedex and searched for ${pokename}`);
            }
            
        });




        // Handle errors
        socket.on('error', error => {
            console.error('Socket error');
            console.error(error);
        });

        return socket.auth(channelId, userId, authkey)
        .then(() => {
            console.log('Login successful for second chatsocket');
            return socket.call('msg', ['Hi! I\'m a robot. I excute commands for you! 2nd version']);
        });
    };

    */