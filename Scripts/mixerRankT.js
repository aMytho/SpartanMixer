// This is the ranker fromm the mixer website. It compares a stat to the rest of mixer.
// Currently it compares a streamers total viewcount to the rest of mixer. 
// Obviously, you can change this. For example, If I wanted to see my current viewers compared I would replace all the "viewersTotal" with "viewersCurrent"
// Caps DO matter. You can search for more values in the mixer rest index.
// To 
// Questions? Mixer.com/Mytho
// Another resource is the mixer community discord. Sadly I don't have a link but I'm sure you can find it.
'use strict';

const Mixer = require('@mixer/client-node');

const client = new Mixer.Client(new Mixer.DefaultRequestRunner());

const channelName = process.argv[2]; // This takes the word after the filename as the streamer it will compare against. So in terminal you would type "node mixerRankT.js Mytho" Replace Mytho with the person you want to compare against mixer.
// ex. node mixerRankT.js Codestics 

client.use(new Mixer.OAuthProvider(client, {
    clientId: 'auth key', // put your client/authkey here.
}));

client.request('GET', `channels/${channelName}`) // takes the channel name from the terminal entry and uses it here.
.then(res => {
    const viewers = res.body.viewersTotal; // 1st thing to replace 
    console.log(`You have ${viewers} total viewers...`); //2nd thing to replace. Types the stat you asked for in terminal. Remember to replace total viewers wirth your new stat . ex current viewers 

    let rank = 1;
    const run = (page) => {
        return client.request('GET', '/channels', {
            qs: {
                page,
                fields: 'viewersTotal', // 3rd Thing to replace
                order: 'viewersTotal:DESC',// 4th thing to replace
            },
        }).then(res => {
            for (let i = 0; i < res.body.length; i++) {
                const channel = res.body[i];
                if (channel.viewersTotal <= viewers) { // 5th thing to replace. Just the viewerTotal unless you are doing a completly different value.
                    console.log(`Your rank on Mixer is ${rank}!`); // Tells you the final rank of the streamer.
                    return;
                }

                rank++;
            }

            console.log(`Your rank is at least ${rank}...`); // Working towards the end rank
            return run(page + 1);
        });
    };

    return run(0);
}); // That wasn't so hard. :)