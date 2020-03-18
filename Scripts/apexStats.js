//Work in progress
// This is the apex legends chatbot. Currently it only get kills. It can only get stats that have been on your banner. This has obvious limitations.

   // If a stat is missing it will not send the message to chat unless it comes later in the JSON data.
   // You need an authkey from https://tracker.gg/developers/docs/authentication Video on this soon.
    const Mixer = require('@mixer/client-node');
    const ws = require('ws');
    const Carina = require('carina').Carina;
    var request = require('request');

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
 

    /**
    * Creates a Mixer chat socket and sets up listeners to various chat events.
    * @param {number} userId The user to authenticate as
    * @param {number} channelId The channel id to join
    * @param {string[]} endpoints An array of endpoints to connect to
    * @param {string} authkey An authentication key to connect with
    * @returns {Promise.<>}
    */




// Second chatcocket starts now



// Gets the user that the Access Token we provided above belongs to. Replace the channel ID's to go to a different channel.
client.request('GET', 'users/current')
.then(response => {
    userInfo = response.body;
    return new Mixer.ChatService(client).join(38537887);
})
.then(response => {
    const body = response.body;
    return createChatSocket1(userInfo.id, 38537887, body.endpoints, body.authkey);
})
.catch(error => {
    console.error('Something went wrong.');
    console.error(error);
});


//Chat socket. Refer to howto.js or commands.js
    function createChatSocket1 (userId, channelId, endpoints, authkey) {
        // Chat connection
        const socket = new Mixer.Socket(ws, endpoints).boot();

      // Apex general stats for all legends. Xbox only.
      socket.on('ChatMessage', data => {
        if (data.message.message[0].data.startsWith('!AL xbl ')){
            apexdata = (data.message.message[0].data);
            let alName = apexdata.slice(8);
            socket.call('msg', [`@${data.user_name}, Retrieving data.`]);
      request(`https://public-api.tracker.gg/v2/apex/standard/profile/xbl/${alName}/segments/legend?TRN-Api-Key=`, function (error, response, body) {
    if (!error && response.statusCode == 200) { // if all is good then do this

     try{
        ALdata = JSON.parse(body);
      let length1 = ALdata.data.length; // useful to see the amount of legends. 

      var arrlegends = [];
      arrlegends.stats = [] // makes a new array for the data we want stored
      ALdata.data.forEach(function(item) {
        var legend = item.metadata.name;         //get the legends that character has in the json data set
        var kills = item.stats.kills.value;      //gets the kills on that legend
        arrlegends.push(legend);     //pushes the stats to the new array
        arrlegends.stats.push(kills); // ^^
      });
        console.log(arrlegends);
        console.log(`There is ${length1} legends availble.`);
        for (let i = 0; i < arrlegends.length; i++ ) {                     // loops through the array and lets us get data later
          socket.call('whisper', [data.user_name, `Legend: ${arrlegends[i]} kills: ${arrlegends.stats[i]}`]); // Lists the values. Each legend has its own message.
        }
        setTimeout(() => {socket.call('msg', [`Apex info successfully sent to ${data.user_name}.`]);}, 3000);
        console.log(` ${data.user_name} got xbl apex stats.`);
      ;

    
        
     }catch(e){
      socket.call('msg', [`The player is missing a stat value that you searched. Try updating their banner.`]); // If the player doesn't have the requested data we do not send any data to chat. Error message instead.
      console.log('The player they searched for was missing a stat value');
     }
     } if (response.statusCode == 404) { // if the name is incorrect/missing then do this
        socket.call('msg', [`Incorrect name. Please check all spelling and capitalazation.`]); // If the player doesn't exist we do not send any data to chat. Error message instead.
        console.log('The player they searched for does not exist.')

     }
    });

        }
        
    });





        /*
        // WIP
        socket.on('ChatMessage', data => {
            if (data.message.message[0].data.startsWith('!AL psn Socials')){
                apexdata = (data.message.message[0].data);
                let alName = apexdata.slice(14);
                console.log(`The Profile name is ${alName}`);
                socket.call('msg', [`@${data.user_name}, Retrieving data.`]);
                setTimeout(() => {
                    request(`https://public-api.tracker.gg/v2/apex/standard/profile/psn/${alName}?TRN-Api-Key=`, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        try{
                            ALdata = JSON.parse(body); 
                            console.log(ALdata.data.userInfo.socialAccounts[0].platformUserIdentifier); // gets the twitter if it is the first one. Hope it always is. PSN



    
                       
                            
                            
                            socket.call('msg', [`1`]);
                            setTimeout(() => {socket.call('msg', [`rip`]);}, 2000);
                            setTimeout(() => {socket.call('msg', [`well...`]);}, 5000);     
                        
                        }catch(e){
                            if(e){
                            // If fails, Do something else
                            console.log('ahhhitfailed')
                            socket.call('msg', [`Incorrect name or the player is missing a stat value that you searched. Try updating your banner.`]);
    
                            }
                        }
                     }
                    })
                }, 2000);
                console.log(` ${data.user_name} tried to get apex data.`);
            }
            
        });
        */



 // Apex general stats for all legends. PSn
 socket.on('ChatMessage', data => {
    if (data.message.message[0].data.startsWith('!AL psn ')){
        apexdata = (data.message.message[0].data);
        let alName = apexdata.slice(8);
        socket.call('msg', [`@${data.user_name}, Retrieving data.`]);
request(`https://public-api.tracker.gg/v2/apex/standard/profile/psn/${alName}/segments/legend?TRN-Api-Key=`, function (error, response, body) {
if (!error && response.statusCode == 200) {
 try{ ALdata = JSON.parse(body); 
  let length1 = ALdata.data.length;
  var arrlegends = [];
  arrlegends.stats = [] // makes a new array for the data we want stored
  ALdata.data.forEach(function(item) {
    //get the legends that character has in the json data set
    var legend = item.metadata.name;
    //push the legend into the new array
    var kills = item.stats.kills.value;
    //push the legend into the new array
    arrlegends.push(legend);
    arrlegends.stats.push(kills);
    console.log(arrlegends);
    console.log(`There is ${length1} legends`);
  });
    for (let i = 0; i < arrlegends.length; i++ ) {
      console.log(`legend:` + arrlegends[i] + ` kills: ` + arrlegends.stats[i]);
      socket.call('msg', [`@${data.user_name} Legend: ${arrlegends[i]} kills: ${arrlegends.stats[i]}`]);
    }
    setTimeout(() => {socket.call('msg', [`Apex info successfully sent to ${data.user_name}.`]);}, 3000);
    console.log(` ${data.user_name} got psn apex stats.`);

  ;
  

}catch(e){
    socket.call('msg', [`The player is missing a stat value that you searched. Try updating their banner.`]); // If the player doesn't have the requested data we do not send any data to chat. Error message instead.
    console.log('The player they searched for was missing a stat value');
} 
}
if (response.statusCode == 404) { // if the name is incorrect/missing then do this
    socket.call('msg', [`Incorrect name. Please check all spelling and capitalazation.`]); // If the player doesn't have the requested data we do not send any data to chat. Error message instead.
    console.log('The player they searched for does not exist.')

 }

});
    }
    
});


 // Apex general stats for all legends. PC (orgin)
 socket.on('ChatMessage', data => {
    if (data.message.message[0].data.startsWith('!AL org ')){
        apexdata = (data.message.message[0].data);
        let alName = apexdata.slice(8);
        socket.call('msg', [`@${data.user_name}, Retrieving data.`]);
request(`https://public-api.tracker.gg/v2/apex/standard/profile/origin/${alName}/segments/legend?TRN-Api-Key=b2ccc9d8-136c-48a6-a117-b6afa420817f`, function (error, response, body) {
if (!error && response.statusCode == 200) {
 try{ ALdata = JSON.parse(body); 
  let length1 = ALdata.data.length;

  var arrlegends = [];
  arrlegends.stats = [] // makes a new array for the data we want stored
  ALdata.data.forEach(function(item) {
    //get the legends that character has in the json data set
    var legend = item.metadata.name;
    //push the legend into the new array
    var kills = item.stats.kills.value;
    //push the legend into the new array
    arrlegends.push(legend);
    arrlegends.stats.push(kills);
    console.log(arrlegends);
  });
    console.log(`There is ${length1} legends`);
    for (let i = 0; i < arrlegends.length; i++ ) {
      console.log(`legend:` + arrlegends[i] + ` kills: ` + arrlegends.stats[i]);
      socket.call('msg', [`@${data.user_name} Legend: ${arrlegends[i]} kills: ${arrlegends.stats[i]}`]);
    }
    setTimeout(() => {socket.call('msg', [`Apex info successfully sent to ${data.user_name}.`]);}, 3000);
    console.log(` ${data.user_name} got orgin apex stats.`);

  ;
  

 }catch(e){
    socket.call('msg', [`The player is missing a stat value that you searched. Try updating their banner.`]); // If the player doesn't have the requested data we do not send any data to chat. Error message instead.
    console.log('The player they searched for was missing a stat value'); }

} // end of successful if statement. POG CHAMP

    if (response.statusCode == 404) { // if the name is incorrect/missing then do this
        socket.call('msg', [`Incorrect name. Please check all spelling and capitalazation.`]); // If the player doesn't have the requested data we do not send any data to chat. Error message instead.
        console.log('The player they searched for does not exist.')};
});
    }
    
});


/*
  // WIP
  socket.on('ChatMessage', data => {
    if (data.message.message[0].data.toLowerCase().startsWith('!ping')) {
        socket.call('msg', [`@${data.user_name} PONG!`]);
        socket.on('ChatMessage', data => {
            if (data.message.message[0].data.toLowerCase().startsWith('test')) {
                socket.call('msg', [`@${data.user_name} PONG again.`]);
                
            }
            else if (data.message.message[0].data.toLowerCase().startsWith('2')) {
                socket.call('msg', [`@${data.user_name} 3`]);
                socket.off();
                
            }
            


           

            
            
            
            ;


        });
        console.log(`Ponged ${data.user_name}`);
    }
});
*/



        // Handle errors
        socket.on('error', error => {
            console.error('Socket error');
            console.error(error);
        });

        return socket.auth(channelId, userId, authkey)
        .then(() => {
            console.log('Login successful for Apex Chatbot.');
            return socket.call('msg', ['Apex test bot has joined the chat. Run !AL xbl gamertaghere']);
        });
    };


    