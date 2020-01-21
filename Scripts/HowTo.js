// This page gives examples of features for your chatbot. I tried to make this as basic as possible so non programmers can understand.
// Just paste the code where you want the desired effect to take place.
// Basic knowledge of js and node will help though.

// Log a message to the console. Useful for getting alerts if a function or task worked properly. The first example is text and the second is a variable.
console.log('this is normal text')
let testVar = 4
console.log(testVar)


// Add a command. 


function createChatSocket (userId, channelId, endpoints, authkey) {
        // Chat connection
        const socket = new Mixer.Socket(ws, endpoints).boot();

// ADDS COMMANDS. 1 Command per block of code. Use @${data.user.name} to @ a user. Must be placed inside the chatcosket function. (as shown currently)
        socket.on('ChatMessage', data => {
            if (data.message.message[0].data.toLowerCase().startsWith('!gamertag')) {
                socket.call('msg', [`@${data.user_name} my gamertag is dazemoist.`]);
                console.log(`Ponged ${data.user_name}`);
            }
        });
}; 


// How to use variables inside of a string.

console.log(`Fifteen is ${a + b}.`);
// That simple lol. Used for pulling API data for the name of the user whose stats you are getting. ex.
let aUser = 'Name'
client.request('GET',`channels/${aUser}`)





// Search for ANYONE'S stats! (use the next word after a command in a query) ex. below

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

// You would use it like this- !sparks Mytho,!sparks Codestics, !sparks Shroud,ect

// Explanation. Normal starts with. Declare the message from chat as a variable. Make another variable that slices the value of the previous variable (in this case var name gets sliced.)
// the number is determined by how many characters are before the value you want to search. So !-1 + sparks-6 + the space between sparks and the name you search. eg !sparks Mytho.
// The slice is only characters before the next word so you dont have to code for every possible name :)
//Then just call the api using the variable as the channel name. This has many other uses. If you dont understad this check out -https://www.w3schools.com/jsref/jsref_slice_string.asp


// This is how to get the current game and get info about it. You need to replace /channels/mytho with /channels/yourname  




// Tells the chat the current game,viewers,ect
        socket.on('ChatMessage', data => {
            if (data.message.message[0].data.toLowerCase().startsWith('!currentgame')) {
                client.request('GET',`channels/Mytho`)
                .then(res => {
                        const gametitle = res.body.type.name;
                        const gamestr = res.body.type.online;
                        const gamenum = res.body.type.viewersCurrent;
                        const gamedesc = res.body.type.description;
                socket.call('msg', [`The current game is ${gametitle} with ${gamestr} current streamers and ${gamenum} total viewers! Description: ${gamedesc}`]);
                });
                console.log(` ${data.user_name} asked for the current game.`);
            }
        });













//These are examples of other API's to call that are not part of the mixer API. Please, do not spam these or the owners of these may bun/suspend your IP. The first one is a command that will give the user a random piece of advice. Scotty recently added this as well. I wonder if they saw what I did...
// Anyway, once the if message is in the command "!advice" you request an http resonse. It then checks for errors. If none, it logs the message from the advice API. VERY IMPORTANT- You must parse or translate the data into js format so you can use it.
// We do this by  test = JSON.parse(body)  You can replace test with a different varaible name if you wish. Then we navigate the data. This API stores the data in test.slip.advice  We log it to the console and then declare the path test.slip.advice as a varaible. Then we send the variable to chat!
// This may seem complex. IF you don't understand it you can always just copy/paste but I would recomend trying to understand it fully.
// As always feel free to contact me at mixer.com/Mytho for any questions you may have!

         // Advice API
         socket.on('ChatMessage', data => {
            if (data.message.message[0].data.toLowerCase().endsWith('!advice')) {
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

//  This is another API. This gives us 1 random cat fact. This is very similar to the other API above. The path to the data we want is cat.fact  We follow the same proces as above.
// Do not let users spam these commands. It may trigger a suspension from your IP so you would not be able to use this API anymore. I would recomend setting a limit on both of these.        

        // Cat fact API
        socket.on('ChatMessage', data => {
            if (data.message.message[0].data.toLowerCase().endsWith('!cat')) {
                request('https://catfact.ninja/fact?max_length=360', function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(body) //logs the message in json format
                     cat = JSON.parse(body); // translates from json to js so we can use it
                      console.log(cat.fact);  //gives us the advice
                      let catfact = cat.fact // delcares the message as a var to use in the message for chat
                      socket.call('msg', [`${catfact}`]);
                     }
                })
                console.log(` ${data.user_name} learned a cat fact +1 IQ point`);
            }
        });



// More added later
