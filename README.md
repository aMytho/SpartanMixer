[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/MythoAway7/SpartanMixer) 

# SpartanMixer
A collection of scripts for the Spartans of Mixer. (and for anyone else who wants it )

https://Mixer.com
https://Mixer.com/Mytho
https://Mixer.com/Codestics

Created using github in gitpod.

The purpose of this github project is to give streamers more control over their stream and channel bots. 

The chatbot will have all of the normal functions of a chabot (commands,moderation,ect) when fully completed.

Currently the main file used is commands.js  Feel free to experiment with other files if you wish. HowTo.js shows examples.

Usage-

Download this repository. It contains the chatbot code and all the nodes you need. (and a few extra that help with specific projects) 

Navigate to the scripts folder.

Open Commands.js

Go to https://dev.mixer.com/guides/chat/chatbot
<<<<<<< HEAD
Select node and look at the first block of code. Click on 'click here to get an authkey' inside the block of code. 

In your commands.js file paste the authkey where it says "auth key here". 
Scroll down to view the premade commands. 
=======
Select node and look at the first block of code. Click on 'click here to get an authkey' inside the block of code. Copy the code it gives you. 

In your commands.js file paste the authkey where it says "auth key here". You may need to get a new key if it expires.
>>>>>>> 2356b97d5f0597bb2c55b54c957af82177253c15

Using the same format as the other commands you can copy and paste more commands into the createchatsocket function.
To send the bot to your chat run 'node commands.js' in a terminal in the proper directory. This depends on where the file is downloaded. (To move directories just type 'cd path/to/scripts') ect users/desktop/repo/scripts

There is a few thrid party API's that are in the commands.js folder. (Advice,Pokedex,Dog and Cat facts) These are free API's and you should not take advantage of them. Do not spam them with requests.

