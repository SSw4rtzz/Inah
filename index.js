//=============================================================
// Nome:        BotDiscordBDO
// Autor:       Sw4rtz
// Descrição:   Bot para Discord com comandos e algumas funcionalidades para o jogo Black Desert Online
// Versão:      0.6 Alpha
// Data:        13/11/2022
// Run-at:      discord.js
//=============================================================


//npm run start             -           Inicia o bot               - node src/index.js
//npm run dev               -           Reinicia
//npm run stop              -           Para o bot
//npm run build             -           Compila o código
//npm i discord.js@latest   -         Update do discord.js

//------------------------- Issues/A fazeres ------------------------------------
// Resumindo, tenho que tornar o timeout com delay dinamico
// Ele atualmente está a usar unicamente o delay declarado antes e não se muda consuante o código no seu interior
// Atualmente o código de hórarios está comentado no fim do index.js, mas descomentado, está completamente funcional
// Falta adicionar o calendário, básicamente (Sem certezas) está pseudo estático por causa do countdown
//--------------------------------------------------------------------------------

//client.user.setAvatar("https://bdocodex.com/items/ui_artwork/ic_04389.png"); //Muda imagem do BOT

// Importando as bibliotecas do discord.js
const { Client, Events, Routes, Collection, GatewayIntentBits } = require('discord.js');
const { REST } = require('discord.js');
const { token, clint_id, guildId } = require('./config.json');

// Cria uma nova instância do cliente do Discord
const client = new Client({
    intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ] });

const fs = require('node:fs');
const path = require('node:path');


const rest = new REST({ version: '10' }).setToken(token);

// Quando o cliente estiver pronto, executa este código
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.on('ready', () => {
	console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', (interaction) => {
    if(interaction.isChatInputCommand()){
        console.log('Comando de teste executado');
        interaction.reply({content: 'Testado!'});
    }
});

client.on('messageCreate', message => {
    if (message.content === 'ping') {
        message.channel.send('Pong.');
    }
});

async function main(){
    const commands = [
        {
            name: 'teste',
            description: 'Testa se o bot está a funcionar',
        },
    ];
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationGuildCommands(clint_id, guildId), {
          body: commands,
        });
        client.login(token);
      } catch (err) {
        console.log(err);
      }
}

main();

// Log in to Discord with your client's token
//client.login(token);







/*
const {
    Client,
    GatewayIntentBits,
    DataResolver
} = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ]
});
const config = require("./config.json");
client.login(config.token);

// Variáveis globais
var hour, min, sec, day, timer, delay = 30000,
    bossName = "A procurar";

//Quando o cliente está ready, mostra no terminal o bot que está a correr e liga o status do bot
client.on('ready', () => {
    console.log(`A correr ${client.user.tag}`);
    client.user.setActivity("Drepressão", {
        type: "PLAYING"
    });
    //bossesTimer();
});


client.on('message', message => {
    if (message.content === 'ping') {
        message.reply('Pong!');
    }
});



/********* MATERIAL AINDA EM DESENVOLVIMENTO *********/

/* Precisa de importação dos packages selenium e chromedriver, faz as pesquisas por conteudo num determinado site funcionarem
const {
    Builder,
    By
} = require('selenium-webdriver');

require("chromedriver");
*/

/*client.on('message', (message) => {
    if (message.author.bot) return; //Para evitar o loop, porque se eu meter o bot a dizer teste, ele responde-se a si próprio
    console.log(`[${message.author.tag}]: ${message.content}`);
    if (message.content >= 'limpa') {
        clearTimeout(timer);
        clearInterval(timer);
        message.reply('Timeouts limpos');
    }
});*/

/*Com os devidos dellays chama a função bosses
function timeManagement() {

    hourTimer = bossesTimer();
    setInterval(function () {
        console.log("hourTimer: " + hourTimer)
    }, 10000);
    //await bossesTimer(30000);
    timer = setInterval(function () {
        switch (hourTimer.substring(0, 2)) {
            case (hourTimer.substring(0, 2) >= 3):
                console.log("Vai voltar a verificar daqui a 2:50h"); //Imprime texto na consola
                delay = 9000000;
                break;
            case '02':
                console.log("Vai voltar a verificar daqui a 1:20h"); //Imprime texto na consola
                delay = 4320000;
                break;
            case '01':
                console.log("Vai voltar a verificar daqui a 40m"); //Imprime texto na consola
                delay = 2400000;
                break;
            case '00':
                if (hourTimer.substring(2, 4) >= 30) {
                    bossesTimerFast();
                    delay = 1800000;
                    break;
                } else if (hourTimer.substring(2, 4) >= 10) {
                    delayCurto = 300000;
                    timerCurto = setInterval(function () {
                        if (bossesTimerFast() >= 1) {
                            clearInterval(timerCurto);
                        }
                        if (delayCurto >= 10000) {
                            delayCurto /= 3;
                        }
                    }, delayCurto);
                }
        }
    }, delay);
};*/

/************* PARTE DOS BOSSES (DESATIVADO PARA CORRER O BOT SEM VERIFICAÇÕES TEMPORARIAS DE BOSSES) *************
//Atualiza para a que horas é o boss
async function bossesTimer() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // Abre o URL
        await driver.get('https://mmotimer.com/bdo/');
        // Faz get ao elemento timer
        let bossNameID = driver.findElement(By.xpath("/html/body/main/div/div/div[2]/div/div/div")); //Verifica o nome do próximo boss
        var bossName = await bossNameID.getText();
        let bossHourID = driver.findElement(By.xpath("/html/body/main/div/div/div/div/div/div/small")); //verifica a que horas é o próximo boss
        var bossHour = await bossHourID.getText();
        var bossHourHora = bossHour.substring(0, 2) - 1; //Horário de inverno fica com -1
        let bossTimerID = driver.findElement(By.xpath("/html/body/main/div/div/div[2]/div/div/div[3]")); //verifica quanto tempo falta para o próximo boss
        var bossTimer = await bossTimerID.getText();
        console.log(bossName); //Imprime texto na consola
        console.log(bossHourHora); //Imprime texto na consola
        console.log(bossTimer); //Imprime texto na consola
        if (bossTimer.substring(0, 2) >= 10) {
            client.user.setPresence({
                activities: [{
                    name: bossName + " - " + bossHourHora + ':' + bossHour.substring(3, 5) + 'h',
                    type: "PLAYING"
                }],
                status: 'idle'
            });
        } else { //Adiciona o zero antes da hora
            client.user.setPresence({
                activities: [{
                    name: bossName + " - 0" + bossHourHora + ':' + bossHour.substring(3, 5) + 'h',
                    type: "PLAYING"
                }],
                status: 'idle'
            });
        }
    } finally {
        await driver.quit();
    }


    timer = setInterval(function () {
        switch (bossTimer.substring(0, 2)) {
            case (bossTimer.substring(0, 2) >= 3):
                console.log("Vai voltar a verificar daqui a 2:50h"); //Imprime texto na consola
                setTimeout(function () {}, 9000000);
                break;
            case '02':
                console.log("Vai voltar a verificar daqui a 1:20h"); //Imprime texto na consola
                setTimeout(function () {}, 4320000);
                break;
            case '01':
                console.log("Vai voltar a verificar daqui a 40m"); //Imprime texto na consola
                setTimeout(function () {}, 2400000);
                break;
            case '00':
                if (bossTimer.substring(3, 5) >= 30) {
                    bossesTimerFast();
                    setTimeout(function () {}, 1800000);
                    break;
                } else if (bossTimer.substring(3, 5) >= 10) {
                    setTimeout(function () {}, 300000);
                } else {
                    counterMin = bossTimer.substring(3, 5);
                    counterSeg = bossTimer.substring(6, 7);
                    countdownSeg = setInterval(function () {
                        client.user.setPresence({
                            activities: [{
                                name: bossName + " - " + counterMin + ':' + counterSeg,
                                type: "PLAYING"
                            }],
                            status: 'idle'
                        });
                        if (counterSeg == 0) {
                            counterMin--;
                            counterSeg = 60;
                        } else {
                            counterSeg--;
                        };
                    }, 1000);
                }
        }
    }, delay);

    return bossTimer; //Retorna unicamente os 2 primeiros caracteres da variavel bossTimer, equivalendo assim ao numero de horas
};

//Atualiza o tempo que falta (Utilizado para uma pesquisa mais rápida)
async function bossesTimerFast() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // Abre o URL
        await driver.get('https://mmotimer.com/bdo/streamwidget/stream.php?server=eu');
        // Faz get ao elemento timer
        let bossNameID = driver.findElement(By.xpath("/html/body/div/table/tbody/tr/td[2]"));
        var bossName = await bossNameID.getText();
        let bossTimerID = driver.findElement(By.xpath("/html/body/div/table/tbody/tr/td[3]/div"));
        var bossTimer = await bossTimerID.getText();
        console.log(bossName); //Imprime texto na consola
        console.log(bossTimer); //Imprime texto an
        client.user.setPresence({
            activities: [{
                name: bossName + " - " + bossTimer,
                type: "PLAYING"
            }],
            status: 'idle'
        });
    } finally {
        await driver.quit();
    }
    return bossTimer.substring(0, 2); //Retorna unicamente os 2 primeiros caracteres da variavel bossTimer, equivalendo assim ao numero de horas
};



function date() {
    hour = (new Date()).getHours(); //Horas
    min = (new Date()).getMinutes(); //Minutos
    sec = (new Date()).getSeconds(); //Segundos
    day = (new Date()).getDay(); //Dia da semana (Retorna numeros: 0 - Domingo, 1 - Segunda, 2 - Terça, 3 - Quarta, 4 - Quinta, 5 - Sexta, 6 - Sabado)
}

function countdown(boss) {
    if (boss == 'kzarka') {
        if (hour <= 0) {
            var tempo = (hour * 3600) + min * 60 + sec;
            tempo = (1 * 3600) - tempo; //1 = horário do kzarka 1h Domingo
            var tempo_form = new Date(tempo * 1000).toISOString().substr(11, 8);
            return tempo_form;
        }
    }
    if (boss == 'Kutum') {
        var tempo = (hour * 3600) + min * 60 + sec;
        tempo = (4 * 3600) - tempo; //1 = horário do kutum 4h Domingo
        return tempo;
    }
}


//Mostra no status do bot um contagem regressiva de 50 a 0, com uma atualização de 10 em 10 segundos (Apenas para fins de testes)
count = 5;
client.on('message', (message) => {
    if (message.author.bot) return; //Para evitar o loop, porque se eu meter o bot a dizer teste, ele responde-se a si próprio
    console.log(`[${message.author.tag}]: ${message.content}`);
    if (message.content === 'conta') {
        message.reply('ok');
        checkthe_interval = 10000; //This checks every 10 minutes, change 10 to whatever minute you'd like
        count = 50;
        setInterval(function () {
            client.user.setPresence({
                activities: [{
                    name: '' +
                        count,
                    type: "PLAYING"
                }],
                status: 'idle'
            });
            count = count - 10;
        }, checkthe_interval);
    }
});
**************************************************************************************/


//Verifica a hora e o dia e imprime-o.. Para depois fazer as verificações dos bosses
//Isto tem de ser feito por horários, tipo às 23h ele dizer que às 23:15h à um kzarka e às 23:05h começar a fazer uma contagem regressiva de minuto a minuto talvez
/*client.on('message', (message) => {
    date();


    switch (day) {
        //DOMINGO
        case 0:
            //KZARKA 1H
            if (hour < 1) {
                client.user.setPresence({
                    activities: [{
                        name: "Kzarka: " + countdown('Kzarka'),
                        type: "PLAYING"
                    }],
                    status: 'online'
                });
            }

            //KUTUM 4H
            if (hour > 1 && hour < 4) {
                var ciclo = setInterval(function () {
                    var timeDown = countdown('Kutum'); //Tempo que falta
                    /*if (timeDown == 0) {
                        clearInterval(ciclo);
                    } else {
                    timeDown = new Date(timeDown * 1000).toISOString().substr(11, 8);
                    client.user.setPresence({
                        activities: [{
                            name: "Kutum: " + timeDown,
                            type: "PLAYING"
                        }],
                        status: 'online'
                    });
                    //}

                }, 1000);

            } else {
                var saiCiclo = true;
            }
            break;




        case 1:

            break;
    }


if (message.author.bot) return; //Para evitar o loop, porque se eu meter o bot a dizer teste, ele responde-se a si próprio
console.log(`[${message.author.tag}]: ${message.content}`);
if (message.content === 'data') {
    message.reply('Hora : ' + hour);
    message.reply('Minutos : ' + min);
    message.reply('Segundos : ' + sec);
    message.reply('Dia : ' + day);
}
});
*/