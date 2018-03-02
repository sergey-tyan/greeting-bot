const TOKEN = process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';
const TelegramBot = require('node-telegram-bot-api');
const options = {
    webHook: {
        // Port to which you should bind is assigned to $PORT variable
        // See: https://devcenter.heroku.com/articles/dynos#local-environment-variables
        port: process.env.PORT
        // you do NOT need to set up certificates since Heroku provides
        // the SSL certs already (https://<app-name>.herokuapp.com)
        // Also no need to pass IP because on Heroku you need to bind to 0.0.0.0
    }
};
// Heroku routes from port :443 to $PORT
// Add URL of your app to env variable or enable Dyno Metadata
// to get this automatically
// See: https://devcenter.heroku.com/articles/dyno-metadata
const url = process.env.APP_URL || 'https://<app-name>.herokuapp.com:443';
const bot = new TelegramBot(TOKEN, options);

// This informs the Telegram servers of the new webhook.
// Note: we do not need to pass in the cert, as it already provided
bot.setWebHook(`${url}/bot${TOKEN}`);

const greetingPart = process.env.GREETING || `Пожалуйста представьтесь и расскажите, как вы узнали о подкасте.

🌍 В этом чате делимся мыслями и обсуждаем эпизоды.

🙂 Будьте вежливы
💬 Пишите мысли целиком
🔵 Предложите тему: #topic
🔴 Дайте совет: #advice
🚫 Нет ботам, рекламе, мату
`;

bot.on('new_chat_members', (msg)=> {
    const { first_name, last_name, username } = msg.new_chat_member;
    const name = username ? username : `${first_name} ${last_name}`;
    const greeting = `
    Добро пожаловать [${name}](tg://user?id=${msg.new_chat_member.id})!

    ${greetingPart}`;
    bot.sendMessage(msg.chat.id, greeting, {parse_mode:'Markdown'});
});

bot.onText(/вакансия/, (msg, match) => {
    const chatId = msg.chat.id;
    if(msg.text.length < 300){

        const { first_name, last_name, username } = msg.from;
        const name = username ? username : `${first_name} ${last_name}`;
        const reply = `[${name}](tg://user?id=${msg.from.id}) пожалуйста ознакомьтесь с рекомендациями по оформлению вакансий https://habrahabr.ru/post/285286/`;
    
        bot.sendMessage(chatId, reply, {parse_mode:'Markdown'});
    }
});