let hastebin = require('hastebin');
const db = require("quick.db")
module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {

    let ms =     db.get(`tt_${interaction.guild.id}_${interaction.user.id}`)
    if (!interaction.isButton()) return;
    if (interaction.customId == "open-ticket") {

      if(ms == null)  {


   

      interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
        parent: client.config.ticketsAbertos,
        topic: interaction.user.id,
        permissionOverwrites: [{
            id: interaction.user.id,
            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
          },
          {
            id: client.config.cargoSup,
            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
          },
          {
            id: interaction.guild.roles.everyone,
            deny: ['VIEW_CHANNEL'],
          },
        ],
        type: 'text',
      }).then(async c => {
        db.set(`tt_${interaction.guild.id}_${c.id}`, interaction.user.id)
        db.set(`tt_${interaction.guild.id}_${interaction.user.id}`, c.id)

        let embed4 = new client.discord.MessageEmbed()
        .setDescription(`Seu ticket foi iniciado em ${c}`)
           .setColor("BLACK")
     
     
            const bbb = new client.discord.MessageActionRow()
             .addComponents(
                 new client.discord.MessageButton()
                 .setLabel('Ir para o ticket ')
                 .setStyle('LINK')
                 .setURL(`https://discord.com/channels/${interaction.guild.id}/${c.id}`)
          
             )

             let embed5 = new client.discord.MessageEmbed()
             .setDescription(`Seu pedido para selecão de criação de ticket foi iniciado! ${c}`)
                .setColor("BLACK")
          
          
                 const bbb2 = new client.discord.MessageActionRow()
                  .addComponents(
                      new client.discord.MessageButton()
                      .setLabel('Ir para o canal ')
                      .setStyle('LINK')
                      .setURL(`https://discord.com/channels/${interaction.guild.id}/${c.id}`)
               
                  )
        interaction.reply({
       embeds: [embed5],
       components: [bbb2],
          ephemeral: true
        });

        const embed = new client.discord.MessageEmbed()
          .setColor('GREEN')
          .setAuthor(`${interaction.user.username}`, interaction.user.avatarURL(),)
          .setDescription('Selecione o que deseja')

          .setTimestamp();

        const row = new client.discord.MessageActionRow()
          .addComponents(
            new client.discord.MessageSelectMenu()
            .setCustomId('category')
            .setPlaceholder('Selecione uma opção')
            .addOptions([{
                label: 'Categoria 1',
                value: 'c1',
          
              },
              {
                label: 'Categoria 2',
                value: 'c2',
            
              },
              {
                label: 'Categoria 3',
                value: 'c3',
  
              },
            ]),
          );

        msg = await c.send({
          content: `<@!${interaction.user.id}>`,
          embeds: [embed],
          components: [row]
        });

        const collector = msg.createMessageComponentCollector({
          componentType: 'SELECT_MENU',
          time: 20000
        });

        collector.on('collect', i => {
          if (i.user.id === interaction.user.id) {
            if (msg.deletable) {
              msg.delete().then(async () => {
                const embed = new client.discord.MessageEmbed()
                  .setColor('BLACK')
                  .setAuthor('Sistema de tickets', interaction.guild.iconURL())
                  .setDescription(`Espere um moderador atender seu ticket;`)
                  .setTimestamp();

                const row = new client.discord.MessageActionRow()
                  .addComponents(
                    new client.discord.MessageButton()
                    .setCustomId('fcs')
                    .setLabel('Fechar ticket')
      
                    .setStyle('DANGER'),
                  );

                const opened = await c.send({
                  content: `<@&${client.config.cargoSup}>`,
                  embeds: [embed],
                  components: [row]
                });

                opened.pin().then(() => {
                  opened.channel.bulkDelete(1);
                });
              });
            };
            if (i.values[0] == 'c1') {
              c.edit({
                parent: client.config.ticket1
              });
            };
            if (i.values[0] == 'c2') {
              c.edit({
                parent: client.config.ticket2
              });
            };
            if (i.values[0] == 'c3') {
              c.edit({
                parent: client.config.ticket3
              });
            };
          };
        });

        collector.on('end', collected => {
          if (collected.size < 1) {
            c.send(`Esse ticket vai ser deletado...`).then(() => {
              setTimeout(() => {
                if (c.deletable) {
                  c.delete();
       let user =  db.get(`tt_${c.guild.id}_${c.id}`)
            db.delete(`tt_${c.guild.id}_${user}`)
              db.delete(`tt_${c.guild.id}_${c.id}`)
                };
              }, 5000);
            });
          };
        });
      });
    
  return}
  return interaction.reply({
    content: 'Você já tem um ticket criado!',
    ephemeral: true
  });
};

    if (interaction.customId == "fcs") {
      const guild = client.guilds.cache.get(interaction.guildId);
      const chan = guild.channels.cache.get(interaction.channelId);

      const row = new client.discord.MessageActionRow()
        .addComponents(
          new client.discord.MessageButton()
          .setCustomId('confirm-close')
          .setLabel('Finalizar o ticket')
          .setStyle('DANGER'),
          new client.discord.MessageButton()
          .setCustomId('no')
          .setLabel('Negar')
          .setStyle('SECONDARY'),
        );

      const verif = await interaction.reply({
        content: 'Tem certeza que deseja finalizar o ticket?',
        components: [row]
      });

      const collector = interaction.channel.createMessageComponentCollector({
        componentType: 'BUTTON',
        time: 10000
      });

      collector.on('collect', i => {
        if (i.customId == 'confirm-close') {
          interaction.editReply({
            content: `Ticket fechado por <@!${interaction.user.id}>`,
            components: []
          });

          chan.edit({
              name: `closed-${chan.name}`,
              permissionOverwrites: [
                {
                  id: client.users.cache.get(chan.topic),
                  deny: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                },
                {
                  id: client.config.cargoSup,
                  allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                },
                {
                  id: interaction.guild.roles.everyone,
                  deny: ['VIEW_CHANNEL'],
                },
              ],
            })
            .then(async () => {
              const embed = new client.discord.MessageEmbed()
              .setColor('BLACK')
              .setAuthor('Sistema de tickets', interaction.guild.iconURL())
              .setDescription(`Configure esse ticket`)
              .setTimestamp();

              const row = new client.discord.MessageActionRow()
                .addComponents(
                  new client.discord.MessageButton()
                  .setCustomId('delete-ticket')
                  .setLabel('Deletar')
                  .setEmoji('🗑️')
                  .setStyle('DANGER'),
                );

              chan.send({
                embeds: [embed],
                components: [row]
              });
            });

          collector.stop();
        };
        if (i.customId == 'no') {
          interaction.editReply({
            content: 'Cancelado!',
            components: []
          });
          collector.stop();
        };
      });

      collector.on('end', (i) => {
        if (i.size < 1) {
          interaction.editReply({
            content: 'Fechando o ticket cancelado!',
            components: []
          });
        };
      });
    };

    if (interaction.customId == "delete-ticket") {
      const guild = client.guilds.cache.get(interaction.guildId);
      const chan = guild.channels.cache.get(interaction.channelId);

      interaction.reply({
        content: 'Salvando mensagens...'
      });

      chan.messages.fetch().then(async (messages) => {
        let a = messages.filter(m => m.author.bot !== true).map(m =>
          `${new Date(m.createdTimestamp).toLocaleString('fr-FR')} - ${m.author.username}#${m.author.discriminator}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`
        ).reverse().join('\n');
        if (a.length < 1) a = "Ixi, não teve msgs..."
        hastebin.createPaste(a, {
            contentType: 'text/plain',
            server: 'https://hastebin.com'
          }, {})
          .then(function (urlToPaste) {
            const embed = new client.discord.MessageEmbed()
              .setAuthor('Logs Ticket',)
              .setDescription(`Ticket \`${chan.id}\` \n User: <@!${chan.topic}> \n Fechado por: <@!${interaction.user.id}>\n\nLogs: [**Clique aqui para ver as logs**](${urlToPaste})`)
              .setColor('BLUE')
              .setTimestamp();



            client.channels.cache.get(client.config.logsTicket).send({
              embeds: [embed]
            });
            client.users.cache.get(chan.topic).send({
              embeds: [embed]
            }).catch(() => {console.log('Ixi, n posso enviar dm para esse membro')});
            chan.send('Deletando o canal...');

            setTimeout(() => {

            let user =  db.get(`tt_${chan.guild.id}_${chan.id}`)
              db.delete(`tt_${chan.guild.id}_${user}`)
              db.delete(`tt_${chan.guild.id}_${chan.id}`)
              chan.delete();
            }, 5000);
          });
      });
    };
  
  

  },
};
