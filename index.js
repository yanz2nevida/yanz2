const fs = require('fs');
const {
  Client,
  Collection,
  Intents
} = require('discord.js');
const config = require('./config.json');
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS],
});
const Discord = require('discord.js');
client.discord = Discord;
client.config = config;
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
    client.on(event.name, (...args) => event.execute(...args, client));
};



client.login(config.token);



  process.on('unhandledRejection', (reason, p) => {
    let c = client.channels.cache.get(config.CanalErros)
  
        c.send({content: `Erro: ${reason} ${p}`});
    });



    process.on("uncaughtException", (err, origin) => {

  
    }) 



    process.on('uncaughtExceptionMonitor', (err, origin) => {
     let c = client.channels.cache.get(config.CanalErros)
  
        c.send({content: `Erro: ${err} ${origin}`});
    });


    process.on('multipleResolves', (type, promise, reason) => {
    let c = client.channels.cache.get(config.CanalErros)
  
        c.send({content: `Erro: ${type} ${promise} ${reason}`});

    });
