// This page gives examples of features for your chatbot. I tried to make this as basic as possible so non programmers can understand.
// Just paste the code where you want the desired effect to take place.
// Basic knowledge of js and node will help though.

// Log a message to the console. Useful for getting alerts if a function or task worked properly. The first example is text and the second is a variable.
console.log('this is normal text')
let testVar = 4
console.log(testVar)


// Add a command. Paste this code inside the chatsocket function.


function createChatSocket (userId, channelId, endpoints, authkey) {
        // Chat connection
        const socket = new Mixer.Socket(ws, endpoints).boot();

// ADDS COMMANDS. 1 Command per block of code. Use @${data.user.name} to @ a user.
        socket.on('ChatMessage', data => {
            if (data.message.message[0].data.toLowerCase().startsWith('!gamertag')) {
                socket.call('msg', [`@${data.user_name} my gamertag is dazemoist.`]);
                console.log(`Ponged ${data.user_name}`);
            }
        });
}; 

// More to be added later




