  // This is the same as the pokedex file but it whispers the stats to the viewer. The only info that is sent to everyone is the "I chosse you". The stats are whispered.
  // Questions? Https://Mixer.com/mytho

   var request = require('request');



   

       // Pokedex API
       socket.on('ChatMessage', data => {
                          if (typeof data.message.message[0].data !== 'undefined') {
           if (data.message.message[0].data.startsWith('!pokedex')){
               pokemonmessage = (data.message.message[0].data);
               let pokename = pokemonmessage.slice(9);
               socket.call('msg', [`@${data.user_name} ${pokename}, I choose you!`]);
                                       setTimeout(() => {socket.call('msg', [`Sending data to Trainer ${data.user_name}!`]);}, 2000);

               setTimeout(() => {
                   request(`https://some-random-api.ml/pokedex?pokemon=${pokename}`, function (error, response, body) {
                   if (!error && response.statusCode == 200) {

                    try{
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
                        var pokesprite1;
                        pokesprite1 = pokefact.sprites.animated;
                        let poketype = pokefact.type;
                        let poketype1 = poketype.toString();
                        let pokespecies = pokefact.species
                        let pokespecies1 = pokespecies.toString();
                        let pokeabilities = pokefact.abilities
                        let pokeabilities1 = pokeabilities.toString();
                        let pokegender = pokefact.gender;
                        let pokegender1 = pokegender.toString();
                        let pokeegg = pokefact.egg_groups
                        let pokeegg1 = pokeegg.toString();
                        let pokeEvolutionNames = pokefact.family.evolutionLine;
                        let pokeEvolution1 = pokeEvolutionNames.toString();
                        globaltest = pokesprite1;
                        
                        
                        socket.call('whisper', [data.user_name, `ID=${pokeid}, Height-${pokeheight}, Weight-${pokeweight}, Starting EXP-${pokeExp}, HP-${pokehp},ATTK-${pokeattk}, DEF-${pokedef},Specials (ATTK=${pokespattk}, DEF=${pokespdef}) Speed-${pokespeed}, Total-${poketotals}, Generation-${pokegen}, Evolution Stage-${pokeEvolution}, Order-${pokeEvolution1}`]);
                        setTimeout(() => {socket.call('whisper', [data.user_name, `Type-${poketype1}, Species-${pokespecies1}, Abilities-${pokeabilities1}, Gender-${pokegender1}, Egg Groups-${pokeegg1}`]);}, 2000);
                        setTimeout(() => {socket.call('whisper', [data.user_name, `Description:${pokedesc} Still Image: ${pokesprite0} Animated Image: ${pokesprite1} `]);}, 5000);     
                    
                    }catch(e){
                        if(e){
                        // If fails, Do something else
                        console.log('ahhhitfailed. They searched for a non existent pokemon or it has not been added to the database.') // Tells you it failed in your console.
                        socket.call('msg', [`No Pokemon was found with that name. Please check your spelling. `]); // tells that it failed

                        }
                    }
                       
                
                    }
                   })
               }, 2000);
               console.log(` ${data.user_name} has opened the pokedex and searched for ${pokename}`);
           }}
           
       });

