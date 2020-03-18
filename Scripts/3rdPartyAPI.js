   var request = require('request'); // paste this at the top of the file

// To use the API's just put them inside the chatsocket function.
// These are not owned by me so do not spam them with meaningless requests.      

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

