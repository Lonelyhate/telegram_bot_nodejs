const TelegramApi = require('node-telegram-bot-api')
const {agianOptions, gameOptions} = require('./options.js')
const token = '5389525397:AAFcyOZ36UjlPc0vB5vXn0OVKxF7461sUhQ'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветсвие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Начать игру'}
    ])
    
    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id;
    
        if (text === '/start') {
            return bot.sendMessage(chatId, 'Добро пожаловать к нам')
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if(text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, 'Я вас не понимаю')
    })

    bot.on('callback_query', msg => {
        let flag = false
        const data = msg.data
        const chatId = msg.message.chat.id
        if(data === '/again') {
            return startGame(chatId)
        }
        if(data == chats[chatId]) {
            return  bot.sendMessage(chatId, `Поздравляю, вы угадали, бот загадал ${chats[chatId]}`, agianOptions)
        } else {
            return bot.sendMessage(chatId, `К сожалению ты не угадал, это ${chats[chatId]}`, agianOptions)
        }
    })
}

start()

