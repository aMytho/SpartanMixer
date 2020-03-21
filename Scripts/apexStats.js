// Get your mixer auth key from https://dev.mixer.com/guides/core/basictutorial in the first block of code.
// get your Apex key from https://tracker.gg/developers Make a free account and follow instructions.
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
            access: 'Your Auth Key',
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

// Gets the user that the Access Token we provided above belongs to. Replace the channel ID's to go to a different channel.
client.request('GET', 'users/current')
.then(response => {
    userInfo = response.body;
    return new Mixer.ChatService(client).join(38537887); // replace the channel ID (the number) with your own.
})
.then(response => {
    const body = response.body;
    return createChatSocket1(userInfo.id, 38537887, body.endpoints, body.authkey); // replace the channel ID (the number) with your own.
})
.catch(error => {
    console.error('Something went wrong.');
    console.error(error);
});

// Mixer stuff
    function createChatSocket1 (userId, channelId, endpoints, authkey) {
        // Chat connection
        const socket = new Mixer.Socket(ws, endpoints).boot();

        // Instructions
        socket.on('ChatMessage', data => {
             if (data.message.message[0].data.startsWith('!AL info')) {
              socket.call('whisper', [data.user_name, `All commands have this format. !AL platform person stat value
              Platforms: xbl,psn,PC
              Person: gamertag,originId,psntag,etc
              Stats: kills,headshots,damage,level,grapple distance`]);
              socket.call('whisper', [data.user_name, `You must use the same capitalization as shown above. We can ONLY get what is shown on your banner so this has obvious limits. If one of your unlocked legends does not have a stat it may affect the rest of your data. Ask Mixer.com/Mytho or a channel mod if you have any questions!`]);
    }
}); 


      // Apex general stats for all legends. Gets kills
      socket.on('ChatMessage', data => {
        if (data.message.message[0].data.startsWith('!AL') && data.message.message[0].data.endsWith('kills')){
            apexdata = (data.message.message[0].data);
            let alName = apexdata.split(' ');
            let newname = alName[1];
            socket.call('msg', [`@${data.user_name}, Retrieving data.`]);
            if (newname == "pc"){newname = "origin"}; // converts platforms. You're welcome
            if (newname == "PC"){newname = "origin"}; 
            if (newname == "ps4"){newname = "psn"};
            if (newname == "PS4"){newname = "psn"};
            if (newname == "xbox"){newname = "xbl"};
            if (newname == "XBOX"){newname = "xbl"}; // ^^
            // if (newname != "PC"||"pc"||"xbl"||"psn"){socket.call('msg', [`@${data.user_name}, Platform specified does not exist. Sorry, Apex is not not gamecube.`]);};             
            console.log('new platform is ' + newname)
            request(`https://public-api.tracker.gg/v2/apex/standard/profile/${newname}/${alName[2]}?TRN-Api-Key=PUT_YOUR_KEY_HERE`, function (error, response, body) {
    if (!error && response.statusCode == 200) { // if all is good then do this

     try{
        ALdata = JSON.parse(body);
       let length1 = ALdata.data.segments.length; // useful to see the amount of legends. 
       console.log(length1);
         try {
      var arrlegends = [];
      arrlegends.stats = [] // makes a new array for the data we want stored
      ALdata.data.segments.forEach(function(item) {
        var legend = item.metadata.name;         //get the legends that character has in the json data set
        var kills = item.stats.kills.value;      //gets the kills on that legend
        arrlegends.push(legend);   
        console.log(arrlegends)  //pushes the stats to the new array
        arrlegends.stats.push(kills);
        console.log(arrlegends.stats); // ^^
      });
    } catch(e) {            socket.call('whisper', [data.user_name, `One of more of the stats is missing. Please update your banners to show the stats you want to see. This may affect the total.`]);}
        console.log(arrlegends);
        console.log('This line separates two levels of the ALegends array');
        console.log(arrlegends.stats)
        console.log(`There is ${length1} legends availble.`);
        for (let i = 0; i < arrlegends.length; i++ ) {                     // loops through the array and lets us get data later
          if (arrlegends[i] == 'Lifetime') {socket.call('whisper', [data.user_name, `${arrlegends[i]} kills: ${arrlegends.stats[i]}`]);
          setTimeout(() => {socket.call('msg', [`Apex info successfully sent to ${data.user_name}.`]);}, 3000);
        } else {
            socket.call('whisper', [data.user_name, `Legend: ${arrlegends[i]} kills: ${arrlegends.stats[i]}`]); // Lists the values. Each legend has its own message.

          }
        }
        console.log(` ${data.user_name} got ${alName[1]} apex stats.`);
      ;

    
        
     }catch(e){
      console.log('The player they searched for was missing a stat value');
     }
     } if (response.statusCode == 404) { // if the name is incorrect/missing then do this
        socket.call('msg', [`Incorrect name. Please check all spelling and capitalization.`]); // If the player doesn't exist we do not send any data to chat. Error message instead.
        console.log('The player they searched for does not exist.')

     }
    });

        }
        
    });

          // Apex general stats for all legends. Gets level of account.
          socket.on('ChatMessage', data => {
            if (data.message.message[0].data.startsWith('!AL') && data.message.message[0].data.endsWith('level')){
                apexdata = (data.message.message[0].data);
                let alName = apexdata.split(' ');
                let newname = alName[1];
                socket.call('msg', [`@${data.user_name}, Retrieving data.`]);
                if (newname == "pc"){newname = "origin"}; // converts platforms. You're welcome
                if (newname == "PC"){newname = "origin"};
                if (newname == "ps4"){newname = "psn"};
                if (newname == "PS4"){newname = "psn"};
                if (newname == "xbox"){newname = "xbl"};
                if (newname == "XBOX"){newname = "xbl"}; // ^^
                // if (newname != "PC"||"pc"||"xbl"||"psn"){socket.call('msg', [`@${data.user_name}, Platform specified does not exist. Sorry, Apex is not not gamecube.`]);};             
                console.log('new platform is ' + newname)
                request(`https://public-api.tracker.gg/v2/apex/standard/profile/${newname}/${alName[2]}?TRN-Api-Key=PUT_YOUR_KEY_HERE`, function (error, response, body) {
        if (!error && response.statusCode == 200) { // if all is good then do this
         try{
            ALdata = JSON.parse(body);
           let length1 = ALdata.data.segments.length; // useful to see the amount of legends. 
           console.log(length1);
             try {
            var level = ALdata.data.segments[0].stats.level.value;      //gets the level
        }  catch(e) {socket.call('whisper', [data.user_name, `One of more of the stats is missing. Please update your banners to show the stats you want to see.`]); }
            console.log(`There is ${length1} legends availble.`);
            socket.call('whisper', [data.user_name, `${alName[2]} is level ${level}.`]); // Lists the level
            setTimeout(() => {socket.call('msg', [`Apex info successfully sent to ${data.user_name}.`]);}, 3000);
            console.log(` ${data.user_name} got ${alName[1]} apex stats.`);        
         }catch(e){
          console.log('The player they searched for was missing a stat value');
         }
         } if (response.statusCode == 404) { // if the name is incorrect/missing then do this
            socket.call('msg', [`Incorrect name. Please check all spelling and capitalization.`]); // If the player doesn't exist we do not send any data to chat. Error message instead.
            console.log('The player they searched for does not exist.')
         }
        });
            } 
        });

       
// Apex general stats for all legends. Gets Damage
socket.on('ChatMessage', data => {
  if (data.message.message[0].data.startsWith('!AL') && data.message.message[0].data.endsWith('damage')){
      apexdata = (data.message.message[0].data);
      let alName = apexdata.split(' ');
      let newname = alName[1];
      socket.call('msg', [`@${data.user_name}, Retrieving data.`]);
      if (newname == "pc"){newname = "origin"}; // converts pc to origin. You're welcome
      if (newname == "PC"){newname = "origin"};
      if (newname == "ps4"){newname = "psn"};
      if (newname == "PS4"){newname = "psn"};
      if (newname == "xbox"){newname = "xbl"};
      if (newname == "XBOX"){newname = "xbl"};
      // if (newname != "PC"||"pc"||"xbl"||"psn"){socket.call('msg', [`@${data.user_name}, Platform specified does not exist. Sorry, Apex is not not gamecube.`]);};             
      console.log('new platform is ' + newname)
      request(`https://public-api.tracker.gg/v2/apex/standard/profile/${newname}/${alName[2]}?TRN-Api-Key=PUT_YOUR_KEY_HERE`, function (error, response, body) {
if (!error && response.statusCode == 200) { // if all is good then do this
try{
  ALdata = JSON.parse(body);
 let length1 = ALdata.data.segments.length; // useful to see the amount of legends. 
 console.log(length1);
   try {
var arrlegends = [];
arrlegends.stats = [] // makes a new array for the data we want stored
ALdata.data.segments.forEach(function(item) {
  var legend = item.metadata.name;         //get the legends that character has in the json data set
  var damage = item.stats.damage.value;      //gets the damage on that legend
  arrlegends.push(legend);   
  console.log(arrlegends)  //pushes the stats to the new array
  arrlegends.stats.push(damage);
  console.log(arrlegends.stats); // ^^
});
} catch(e) {            socket.call('whisper', [data.user_name, `One of more of the stats is missing. Please update your banners to show the stats you want to see. This may affect the total.`]); }
  console.log(arrlegends);
  console.log('wait');
  console.log(arrlegends.stats)
  console.log(`There is ${length1} legends availble.`);
  for (let i = 0; i < arrlegends.length; i++ ) {                     // loops through the array and lets us get data
    if (arrlegends[i] == 'Lifetime') {socket.call('whisper', [data.user_name, `${arrlegends[i]} Damage: ${arrlegends.stats[i]}`]);
    setTimeout(() => {socket.call('msg', [`Apex info successfully sent to ${data.user_name}.`]);}, 3000);
} else {
      socket.call('whisper', [data.user_name, `Legend: ${arrlegends[i]} Damage: ${arrlegends.stats[i]}`]); // Lists the values. Each legend has its own message.
    }
  }
  console.log(` ${data.user_name} got ${alName[1]} apex stats.`);
}catch(e){
console.log('The player they searched for was missing a stat value');
}
} if (response.statusCode == 404) { // if the name is incorrect/missing then do this
  socket.call('msg', [`Incorrect name. Please check all spelling and capitalization.`]); // If the player doesn't exist we do not send any data to chat. Error message instead.
  console.log('The player they searched for does not exist.')
}
});
  }
});




// Apex general stats for all legends. Gets Headshots
socket.on('ChatMessage', data => {
  if (data.message.message[0].data.startsWith('!AL') && data.message.message[0].data.endsWith('headshots')){
      apexdata = (data.message.message[0].data);
      let alName = apexdata.split(' ');
      let newname = alName[1];
      socket.call('msg', [`@${data.user_name}, Retrieving data.`]);
      if (newname == "pc"){newname = "origin"}; // converts platforms You're welcome
      if (newname == "PC"){newname = "origin"};
      if (newname == "ps4"){newname = "psn"};
      if (newname == "PS4"){newname = "psn"};
      if (newname == "xbox"){newname = "xbl"};
      if (newname == "XBOX"){newname = "xbl"};// ^^
      // if (newname != "PC"||"pc"||"xbl"||"psn"){socket.call('msg', [`@${data.user_name}, Platform specified does not exist. Sorry, Apex is not not gamecube.`]);};             
      console.log('new platform is ' + newname)
      request(`https://public-api.tracker.gg/v2/apex/standard/profile/${newname}/${alName[2]}?TRN-Api-Key=PUT_YOUR_KEY_HERE`, function (error, response, body) {
if (!error && response.statusCode == 200) { // if all is good then do this
try{
  ALdata = JSON.parse(body);
 let length1 = ALdata.data.segments.length; // useful to see the amount of legends. 
 console.log(length1);
   try {
var arrlegends = [];
arrlegends.stats = [] // makes a new array for the data we want stored
ALdata.data.segments.forEach(function(item) {
  var legend = item.metadata.name;         //get the legends that character has in the json data set
  var headshots = item.stats.headshots.value;      //gets the kills on that legend
  arrlegends.push(legend);   
  console.log(arrlegends)  //pushes the stats to the new array
  arrlegends.stats.push(headshots);
  console.log(arrlegends.stats); // ^^
});
} catch(e) {            socket.call('whisper', [data.user_name, `One of more of the stats is missing. Please update your banners to show the stats you want to see. This may affect the total.`]); }
  console.log(arrlegends);
  console.log('wait');
  console.log(arrlegends.stats)
  console.log(`There is ${length1} legends availble.`);
  for (let i = 0; i < arrlegends.length; i++ ) {                     // loops through the array and lets us get data later
    if (arrlegends[i] == 'Lifetime') {socket.call('whisper', [data.user_name, `${arrlegends[i]} Headshots: ${arrlegends.stats[i]}`]);
    setTimeout(() => {socket.call('msg', [`Apex info successfully sent to ${data.user_name}.`]);}, 2000);
} else {
      socket.call('whisper', [data.user_name, `Legend: ${arrlegends[i]} Headshots: ${arrlegends.stats[i]}`]); // Lists the values. Each legend has its own message.
    }
  }
  console.log(` ${data.user_name} got ${alName[1]} apex stats.`);
}catch(e){
console.log('The player they searched for was missing a stat value');
}
} if (response.statusCode == 404) { // if the name is incorrect/missing then do this
  socket.call('msg', [`Incorrect name. Please check all spelling and capitalization.`]); // If the player doesn't exist we do not send any data to chat. Error message instead.
  console.log('The player they searched for does not exist.')
}
});
  }
});



// Apex general stats for all legends. Gets grapple distance. The code here is slightly different.
socket.on('ChatMessage', data => {
  if (data.message.message[0].data.startsWith('!AL') && data.message.message[0].data.endsWith('grapple distance')){
      apexdata = (data.message.message[0].data);
      let alName = apexdata.split(' ');
      let newname = alName[1];
      socket.call('msg', [`@${data.user_name}, Retrieving data.`]);
      if (newname == "pc"){newname = "origin"}; // converts platforms. You're welcome
      if (newname == "PC"){newname = "origin"}; 
      if (newname == "ps4"){newname = "psn"};
      if (newname == "PS4"){newname = "psn"};
      if (newname == "xbox"){newname = "xbl"};
      if (newname == "XBOX"){newname = "xbl"}; // ^^
      // if (newname != "PC"||"pc"||"xbl"||"psn"){socket.call('msg', [`@${data.user_name}, Platform specified does not exist. Sorry, Apex is not not gamecube.`]);};             
      console.log('new platform is ' + newname)
      request(`https://public-api.tracker.gg/v2/apex/standard/profile/${newname}/${alName[2]}?TRN-Api-Key=PUT_YOUR_KEY_HERE`, function (error, response, body) {
if (!error && response.statusCode == 200) { // if all is good then do this
try{
  ALdata = JSON.parse(body);
 let length1 = ALdata.data.segments.length; // useful to see the amount of legends. 
 console.log(length1);
   try {
var arrlegends = [];
arrlegends.stats = [] // makes a new array for the data we want stored
ALdata.data.segments.forEach(function(item) {
  var legend = item.metadata.name;         //get the legends that character has in the json data set
  var headshots = item.stats;      //gets the stats of all the legends. Headshots will be grapples when we finish
  arrlegends.push(legend);   
  arrlegends.stats.push(headshots); // will be grapples when we finish.
});
} catch(e) {socket.call('whisper', [data.user_name, `One of more of the stats is missing. Please update your banners to show the stats you want to see. This may affect the total.`]); }
  console.log(`There is ${length1} legends availble.`);
  if (arrlegends.includes('Pathfinder')){
  for (let i = 0; i < arrlegends.length; i++ ) {   // loops through the array and lets us get data later
    if (arrlegends[i] == 'Lifetime') {console.log('ahhh')} else if (arrlegends[i] == 'Pathfinder') {
      console.log('Its pathfinder')
      if (arrlegends.stats[i].grappleTravelDistance.value == undefined) {socket.call('whisper', [data.user_name, `One of more of the stats is missing. Please update your banners to show the stats you want to see. This may affect the total.`]); }
      socket.call('whisper', [data.user_name, `${arrlegends[i]} Grapple Travel Distance: ${arrlegends.stats[i].grappleTravelDistance.value}`]);
    }
  }
  console.log(` ${data.user_name} got ${alName[1]} apex stats.`);
} else {socket.call('whisper', [data.user_name, `One of more of the stats is missing. Please update your banners to show the stats you want to see. This may affect the total.`]);}
}catch(e){
console.log('The player they searched for was missing a stat value');
}
} if (response.statusCode == 404) { // if the name is incorrect/missing then do this
  socket.call('msg', [`Incorrect name. Please check all spelling and capitalization.`]); // If the player doesn't exist we do not send any data to chat. Error message instead.
  console.log('The player they searched for does not exist.')
}
});
  }
});


        // Handle errors with the mixer websocket
        socket.on('error', error => {
            console.error('Socket error');
            console.error(error);
        });

        return socket.auth(channelId, userId, authkey)
        .then(() => {
            console.log('Login successful for Apex chatbot.');
            return socket.call('msg', ['Apex test bot has joined the chat. Emphasis on test. :) run !AL info']);
        });
    };
