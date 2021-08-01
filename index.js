const TelegramApi = require('node-telegram-bot-api')
const objbtnTitle = require('./dataSubMenu')
const listTextMessage = require('./textMessage/textMessage')
const listBtn = require('./btn/btn')
const pureFunction = require('./pureFunction')

const token = '1925452654:AAFtRbRRnXV8nV9UIE4ulCgcB4MnU7UWXRc'

const bot = new TelegramApi(token, { polling: true })

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
    btnResultStatus,btnDescription}=listBtn

const{startText}=listTextMessage
const{createBtn}=pureFunction


const start = () => {

    let chatId
    let userName = ''

    const descriptionOfTheFutureOrder = () => {
        const b = [
            { text: 'Да, оплатить заказ', callback: 'pay' },
            { text: 'Нет, изменить данные', callback: 'editData' },
            { text: 'Отмена', callback: 'Cancel' },
        ]
        const text = `Ваш заказ: \n *Описание* \n Цена (с доставкой): 350грн \n Примерное время доставки: 1 час \n Всё верно?`
        bot.sendMessage(chatId, text, createBtn(b)).then(el => messageOrder.push(el.message_id))
    }

    const deleteMessage = ( idArr) => {
        idArr.map(id => bot.deleteMessage(chatId, id))
    }

    bot.on('message', async (msg, t) => {
        const text = msg.text
        chatId = msg.chat.id
        // console.log(text);
        const userName = msg.from.username

        if (text === '/start') {
            return bot.sendMessage(chatId, startText(msg.from.username), baseMenuBtn)
        }
        
        if (text === '/keyboard') {
            return bot.sendMessage(chatId, 'keyboard', baseMenuBtn)
        }
        if (text.includes('/address')) {
            objOrder.address = text.toLowerCase().replace(/\/address/g, '')
            deleteMessage(messageOrder)
            messageOrder = []
            return bot.sendMessage(chatId, 'Введите номер телефона(+380)\n Перед сообщением введите команду "/phone"', createBtn(btnBack)).then(el => messageOrder.push(el.message_id))
        }
        if (text.includes('/phone')) {
            objOrder.phone = text.toLowerCase().replace(/\/phone/g, '')
            deleteMessage(messageOrder)
            messageOrder = []
            return bot.sendMessage(chatId, 'Добавить комментарий?', createBtn(btnAddComment)).then(el => messageOrder.push(el.message_id))
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

            return bot.sendMessage(chatId, 'Ваше сообщение отправленно в службу поддержки').then(el => messageOrder.push(el.message_id))

        }
        return bot.sendMessage(chatId, 'Не верная команда')

    })
    ////////////////////////////////////////////////////////////////////

    bot.on('callback_query', async el => {

        const chatId = el.message.chat.id
        const callbackData = el.data
        // const textAdminChanel = el.message.text


        // console.log(el);

        

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
        const supportResponse = () => {
            bot.sendMessage(chatId,
                `Введите ваш запрос и наша администрация ответит в ближайшее время.
                (Перед сообщением поставьте команду "support")`)
        }
        const promoCode = () => {

            const subscribeBtn = {
                reply_markup: {
                    inline_keyboard: [[{ text: 'Подписаться', callback_data: 'subscribe' }]]
                }
            }
            bot.sendMessage(chatId,
                `Подпишитесь на наш канал чтобы получить промокод на бесплатную доставку и возможность получать новые промо-коды`, subscribeBtn)
        }
     
        const backBtn = async(message = 'Вернуться назад') => {
            const back = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'BACK', callback_data: 'btnBack' }],
                    ]
                }
            }
            await bot.sendMessage(chatId, message, back).then(prop => botMessageId.push(prop.message_id))
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

        const listFood = (arr) => {
            arr.map((el) => subMenuShow(el.textBtn, el.callbackData))
            setTimeout(()=>backBtn(),500)
        }

        const messegeOrder = (callback) => {

            const result = (obj, user) => {
                bot.sendMessage(idAdminPanel, `Заказ №1: ${obj.title}\n Пользователь: ${user}\n Подписка: нет \n *${obj.comment}*\n Цена (с доставкой): 350грн \n Оплачено: ${obj.pay}`,createBtn(btnResultStatus))
            }

            switch (callback) {
                case 'addOrder':
                    deleteMessage(messageOrder)
                    messageOrder = []
                    return bot.sendMessage(chatId, 'Позиция успешно добавлена!\n Желаете добавить что-то ущё?', createBtn(btnAddAddOrder)).then(el => messageOrder.push(el.message_id))
                case 'addAddOrder':

                    deleteMessage(messageOrder)
                    return messageOrder = []
                case 'payOrder':
                case 'editData':
                    deleteMessage(messageOrder)
                    messageOrder = []
                    return bot.sendMessage(chatId, 'Введите адрес доставки \n Введите команду "/address" перед сообщением', createBtn(btnBack)).then(el => messageOrder.push(el.message_id))
                case 'yes':
                    return bot.sendMessage(chatId, 'Введите ваш коментарий \n Введите команду "/comment" перед сообщением', createBtn(btnBack)).then(el => messageOrder.push(el.message_id))
                case 'no':
                    return descriptionOfTheFutureOrder()
                case 'pay':
                    deleteMessage(messageOrder)
                    messageOrder = []
                    return bot.sendMessage(chatId, 'Выберите способ оплаты:', createBtn(btnPaymentMethod))
                case 'card':
                    objOrder.pay = callback
                    result(objOrder, userName)

                    return bot.sendMessage(chatId, 'Заказ уже готовится! \n курьер приедит к вам с терминалом. \n Приятного аппетита')
                case 'cash':
                    objOrder.pay = callback
                    result(objOrder, userName)
                    return bot.sendMessage(chatId, 'Заказ уже готовится! \n К оплате 350$(чаевые курьеру приветствуются).\n Приятного аппетита')
              

                case 'back':
                    deleteMessage(messageOrder)
                    return messageOrder = []
                case 'cancel':
                    deleteMessage(messageOrder)
                    deleteMessage(botMessageId)
                    botMessageId= []
                    return messageOrder = []
               

                default:
                    return bot.sendMessage(chatId, 'Неверная команда messegeOrder')
            }
        }
        const ordersMenu = (arr, callback) => {
           

            switch (true) {
                case arr.includes(callback):
                    objOrder.title = callback
                    bot.sendMessage(chatId, `*Описание товара: ${callback}*\n   Цена: 300грн`, createBtn(btnDescription)).then(el => messageOrder.push(el.message_id))
                    return

                default:
                    return messegeOrder(callback)
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
                    return bot.sendMessage(chatId, `Что именно вас инетересует?`, createBtn(menuBtn))

                case 'promo':
                    return promoCode()

                case 'support':
                    return supportResponse()

                case 'subscribe':
                    bot.sendMessage(chatId, 'Благодарим вас за подписку!',)
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
                    return botMessageId = []
                default:
                    return ordersMenu(dataArr, callback)
            }
        }



        // console.log(objOrder);

        baseMenu(callbackData, callbackDataArr(objbtnTitle))

    })

}

start()