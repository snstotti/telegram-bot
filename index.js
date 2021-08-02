require('dotenv').config()
const TelegramApi = require('node-telegram-bot-api')
const objbtnTitle = require('./dataSubMenu')
const listTextMessage = require('./textMessage/textMessage')
const listBtn = require('./btn/btn')
const pureFunction = require('./pureFunction')


const bot = new TelegramApi(process.env.BOT_TOKEN, { polling: true })

bot.setMyCommands([
    { command: '/start', description: 'Начало работы' },
    { command: '/keyboard', description: 'Вызвать клавматуру' },
])

const completedOrders = [
    {
        order: 1,
        address: 'Введенный адрес',
        phone: '9998881214',
        comment: 'Введённый комент',
        status: 'Введённый статус'
    },
    {
        order: 2,
        address: 'Введенный адрес',
        phone: '9998881214',
        comment: 'Введённый комент',
        status: 'Введённый статус'
    },
    {
        order: 3,
        address: 'Введенный адрес',
        phone: '9998881214',
        comment: 'Введённый комент',
        status: 'Введённый статус'
    },
]

const arrSupport = []

const idAdminPanel = -1001203491315
const fastfoodMenuGrum = -1001512473260



let botMessageId = []
let messageOrder = []
let objOrder = {
    title: '',
    address: '',
    phone: '',
    comment: '',
    pay: ''
}
const{
    btnAddComment,baseMenuBtn,
    btnBack,menuBtn,
    btnAddAddOrder,btnPaymentMethod,
    btnResultStatus,btnDescription,
    subscribeBtn,btnBackSubMenu,
    futureOrder}=listBtn

const{startText,getPhone,
    subscribe,addComment,
    supportSuccsess,
    support,wrongСommand,
    addOrder,futureOrderText,
    addressText,enterCommentText,
    paymentMethodText,paymentCardText,
    paymentCashText,question,
    thanksSubscribing}=listTextMessage

const{createBtn}=pureFunction


const start = () => {
    let userName
    let chatId
    const deleteMessage = ( idArr) => {
        return idArr.map(id => bot.deleteMessage(chatId, id))
     }
     const descriptionOfTheFutureOrder = () => {
        bot.sendMessage(chatId, futureOrderText, createBtn(futureOrder))
            .then(el => messageOrder.push(el.message_id))
    }
    bot.on('message', async (msg, t) => {
        const text = msg.text
        chatId = msg.chat.id
        const userName = msg.from.username
        
        if (text === '/start') {
            return bot.sendMessage(chatId, startText(userName), baseMenuBtn)
        }
        
        if (text === '/keyboard') {
            return bot.sendMessage(chatId, 'keyboard', baseMenuBtn)
        }
        if (text.includes('/address')) {
            objOrder.address = text.toLowerCase().replace(/\/address/g, '')
            deleteMessage(messageOrder)
            messageOrder = []
            return bot.sendMessage(chatId, getPhone, createBtn(btnBack)).then(el => messageOrder.push(el.message_id))
        }
        if (text.includes('/phone')) {
            objOrder.phone = text.toLowerCase().replace(/\/phone/g, '')
            deleteMessage(messageOrder)
            messageOrder = []
            return bot.sendMessage(chatId, addComment, createBtn(btnAddComment)).then(el => messageOrder.push(el.message_id))
        }
        if (text.includes('/comment')) {
            objOrder.comment = text.toLowerCase().replace(/\/comment/g, '')
            deleteMessage(messageOrder)
            messageOrder = []
            return descriptionOfTheFutureOrder()
        }
        if (text.toLowerCase().includes('/support')) {
            deleteMessage(messageOrder)
            messageOrder = []
            await bot.sendMessage(fastfoodMenuGrum, text.toLowerCase().replace(/\/support/g, ''))
            return bot.sendMessage(chatId, supportSuccsess).then(el => messageOrder.push(el.message_id))
        }
        return bot.sendMessage(chatId, wrongСommand)

    })
    ////////////////////////////////////////////////////////////////////

    bot.on('callback_query', async el => {
        console.log(el);
        const chatId = el.message.chat.id
        const callbackData = el.data
        const userName = el.from.first_name
        
        const showOrders = (arr) => {
            arr.map(el => {
                return bot.sendMessage(
                    chatId,
                    `
                    <b>Заказ№:</b> ${el.order}
                    <b>Адрес:</b> ${el.address}
                    <b>Телефон:</b> ${el.phone}
                    <b>Комментарий:</b> ${el.comment}
                    <b>Статус:</b> ${el.status}
                    `,
                    { parse_mode: 'HTML' })
            })
        }
        const subMenuShow = async (textBtn, callbackData) => {
            const btn = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: textBtn, callback_data: callbackData }],
                    ]
                }
            }
            let url = './img/burger.jpg'
            await bot.sendPhoto(chatId, url, btn).then(prop => botMessageId.push(prop.message_id))
        }
        const backBtn = async(message = 'Вернуться назад') => {
            await bot.sendMessage(chatId, message, createBtn(btnBackSubMenu))
                .then(prop => botMessageId.push(prop.message_id))
        }
        const listFood = (arr) => {
            arr.map((el) => subMenuShow(el.textBtn, el.callbackData))
            setTimeout(() => backBtn(), 1000)
        }
        const result = (obj, user) => {
            bot.sendMessage(idAdminPanel, `Заказ №1: ${obj.title}\n Пользователь: ${user}\n Подписка: нет \n *${obj.comment}*\n Цена (с доставкой): 350грн \n Оплачено: ${obj.pay}`, createBtn(btnResultStatus))
        }
        const ordersMenu = (arr, callback) => {
           

            switch (true) {
                case arr.includes(callback):
                    objOrder.title = callback
                    bot.sendMessage(chatId, `*Описание товара: ${callback}*\n   Цена: 300грн`, createBtn(btnDescription)).then(el => messageOrder.push(el.message_id))
                    return

                default:
                    return bot.sendMessage(chatId, wrongСommand)
            }
        }
        const callbackDataArr = (objData) => {
            let arr = []
            for (let data in objData) {
                objData[data].map(el => arr.push(el.callbackData))
            }
            return arr
        }



        const baseMenu = async (callback, dataArr) => {

            switch (callback) {
                case 'order':
                    return showOrders(completedOrders)
                case 'menu':
                    return bot.sendMessage(chatId, question, createBtn(menuBtn))
                case 'promo':
                    return bot.sendMessage(chatId, subscribe, subscribeBtn)
                case 'support':
                    return bot.sendMessage(chatId, support)
                case 'subscribe':
                    bot.sendMessage(chatId, thanksSubscribing,)
                    return objOrder.subscribe = true
                case 'menuBtn':
                    return await listFood(objbtnTitle.menu)
                case 'pizza':
                    return listFood(objbtnTitle.pizza)
                case 'burger':
                    return listFood(objbtnTitle.burger)
                case 'drink':
                    return listFood(objbtnTitle.drink)
                case 'btnBack':
                    deleteMessage(botMessageId)
                    return botMessageId = [] ///////
                case 'addOrder':
                    deleteMessage(messageOrder)
                    messageOrder = []
                    return bot.sendMessage(chatId, addOrder, createBtn(btnAddAddOrder))
                        .then(el => messageOrder.push(el.message_id))
                case 'addAddOrder':
                    deleteMessage(messageOrder)
                    return messageOrder = []
                case 'payOrder':
                case 'editData':
                    deleteMessage(messageOrder)
                    messageOrder = []
                    return bot.sendMessage(chatId, addressText, createBtn(btnBack)).then(el => messageOrder.push(el.message_id))
                case 'yes':
                    return bot.sendMessage(chatId, enterCommentText, createBtn(btnBack)).then(el => messageOrder.push(el.message_id))
                case 'no':
                    return descriptionOfTheFutureOrder()
                case 'pay':
                    deleteMessage(messageOrder)
                    messageOrder = []
                    return bot.sendMessage(chatId, paymentMethodText, createBtn(btnPaymentMethod))
                case 'card':
                    objOrder.pay = callback
                    result(objOrder, userName)
                    return bot.sendMessage(chatId, paymentCardText)
                case 'cash':
                    objOrder.pay = callback
                    result(objOrder, userName)
                    return bot.sendMessage(chatId, paymentCashText)
                case 'back':
                    deleteMessage(messageOrder)
                    return messageOrder = []
                case 'cancel':
                    deleteMessage(messageOrder)
                    deleteMessage(botMessageId)
                    botMessageId = []
                    return messageOrder = []
                default:
                    return ordersMenu(dataArr, callback)
            }
        }

        baseMenu(callbackData, callbackDataArr(objbtnTitle))

    })

}

start()