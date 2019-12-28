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


// More added later