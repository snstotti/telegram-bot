const TelegramApi = require('node-telegram-bot-api')

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

const objbtnTitle = {
    menu: [
        { textBtn: 'БигБургер меню', callbackData: 'burgerMenu' },
        { textBtn: 'Фитнес меню', callbackData: 'fitnesMenu' },
        { textBtn: 'Мясное меню', callbackData: 'meanMenu' },
        { textBtn: 'Нагетсы меню', callbackData: 'nagetsMenu' },
    ],
    pizza: [
        { textBtn: 'Пицца с ветчиной', callbackData: 'ham' },
        { textBtn: 'Пицца мексикана', callbackData: 'meksikana' },
        { textBtn: 'Пицца моцарела', callbackData: 'mocarela' },
        { textBtn: 'Пицца с салями', callbackData: 'salymi' },
    ],
    burger: [
        { textBtn: 'БигБургер', callbackData: 'bigBurger' },
        { textBtn: 'Крабс-бургер', callbackData: 'crabsBurger' },
        { textBtn: 'Чиз-бургек', callbackData: 'cheesBurger' },
        { textBtn: 'Бургер', callbackData: 'burger' },
    ],
    drink: [
        { textBtn: 'Лимонад', callbackData: 'lemonade' },
        { textBtn: 'Пиво', callbackData: 'beer' },
        { textBtn: 'Вода с газом', callbackData: 'waterGas' },
        { textBtn: 'Вода без газа', callbackData: 'water' },
    ],
}

let botMessageId = []

let objOrder = {
    title: '',
    address: '',
    phone: '',
    comment: '',
    pay: ''
}

const start = () => {
    let userName = ''
    let chatId
    const createBtn = (arrData) => {
        const btn = {
            reply_markup: {
                inline_keyboard: arrData.map(el => {
                    return [{ text: el.text, callback_data: el.callback }]
                })
            }
        }
        return btn
    }
    const descriptionOfTheFutureOrder = () => {
        const b = [
            { text: 'Да, оплатить заказ', callback: 'pay' },
            { text: 'Нет, изменить данные', callback: 'editData' },
            { text: 'Отмена', callback: 'Cancel' },
        ]
        const text = `Ваш заказ: \n *Описание* \n Цена (с доставкой): 350грн \n Примерное время доставки: 1 час \n Всё верно?`
        bot.sendMessage(chatId, text, createBtn(b))
    }

    bot.on('message', async (msg, t) => {
        const text = msg.text
        chatId = msg.chat.id

        // console.log(chatId);

        userName = msg.from.username

        const opts = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Меню🍔', callback_data: 'menu' },
                    { text: 'Мои заказы📜', callback_data: 'order' }],

                    [{ text: 'Промо-код🌟', callback_data: 'promo' },
                    { text: 'Поддержка👨‍💻', callback_data: 'support' }]
                ]
            }
        }

        const btnBack = [{ text: 'Назад', callback: 'back' }]
        const btnAddComment = [
            { text: 'Да', callback: 'yes' },
            { text: 'Нет', callback: 'no' },
            { text: 'Назад', callback: 'back' },
        ]

        if (text === '/start') {
            return bot.sendMessage(chatId, `Добро пожаловать, @${userName} ! Я @test2107Foodbot с моей помощью ты сможешь поесть быстро и вкусно 😋`, opts)
        }
        if (text === '/keyboard') {
            return bot.sendMessage(chatId, 'keyboard', opts)
        }
        if (text.includes('/address')) {
            objOrder.address = text.toLowerCase().replace(/address/g, '')
            return bot.sendMessage(chatId, 'Введите номер телефона(+380)\n Перед сообщением введите команду "\tel"', createBtn(btnBack))
        }
        if (text.includes('/phone')) {
            objOrder.phone = text.toLowerCase().replace(/phone/g, '')
            return bot.sendMessage(chatId, 'Добавить комментарий?', createBtn(btnAddComment))
        }
        if (text.includes('/comment')) {
            objOrder.comment = text.toLowerCase().replace(/comment/g, '')
            return descriptionOfTheFutureOrder()
        }
        if (text.toLowerCase().includes('support')) {

            await bot.sendMessage(idAdminPanel, text.toLowerCase().replace(/support/g, ''))
            return bot.sendMessage(chatId, 'Ваше сообщение отправленно в службу поддержки')

        }
        return bot.sendMessage(chatId, 'Не верная команда')

    })
    ////////////////////////////////////////////////////////////////////

    bot.on('callback_query', async el => {

        const chatId = el.message.chat.id
        const callbackData = el.data

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
        const menuShow = () => {
            const menuBtn = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Меню', callback_data: 'menuBtn' }],
                        [{ text: 'Пицца', callback_data: 'pizza' }],
                        [{ text: 'Бургеры', callback_data: 'burger' }],
                        [{ text: 'Напитки', callback_data: 'drink' }],
                    ]
                }
            }
            bot.sendMessage(chatId, `Что именно вас инетересует?`, menuBtn)

        }
        const backBtn = (message = 'Вернуться назад') => {
            const back = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'BACK', callback_data: 'btnBack' }],
                    ]
                }
            }
            return bot.sendMessage(chatId, message, back).then(prop => botMessageId.push(prop.message_id))
        }
        const subMenuShow = (textBtn, callbackData) => {
            const btn = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: textBtn, callback_data: callbackData }],

                    ]
                }
            }
            let url = './img/burger.jpg'
            bot.sendPhoto(chatId, url, btn).then(prop => botMessageId.push(prop.message_id))
        }
        const messegeOrder = (callback) => {

            const btnAddAddOrder = [
                { text: 'Дополнить заказ', callback: 'addAddOrder' },
                { text: 'Оплатить Заказ', callback: 'payOrder' },
                { text: 'Назад', callback: 'back' },
            ]
            const btnPaymentMethod = [
                { text: 'Карта', callback: 'card' },
                { text: 'Наличные', callback: 'cash' },

            ]
            const btnBack = [{ text: 'Назад', callback: 'back' }]


            const result = (callback, user) => {
                bot.sendMessage(idAdminPanel, `Заказ №1: \n Пользователь: ${user}\n Подписка: нет \n *описание*\n Цена (с доставкой): 350грн \n Оплачено: ${callback}`)
            }

            switch (callback) {
                case 'addOrder':
                    return bot.sendMessage(chatId, 'Позиция успешно добавлена!\n Желаете добавить что-то ущё?', createBtn(btnAddAddOrder))
                case 'payOrder':
                    return bot.sendMessage(chatId, 'Введите адрес доставки \n Введите команду "/address" перед сообщением', createBtn(btnBack))
                case 'yes':
                    return bot.sendMessage(chatId, 'Введите ваш коментарий \n Введите команду "/comment" перед сообщением', createBtn(btnBack))
                case 'no':
                    return descriptionOfTheFutureOrder()
                case 'pay':
                    return bot.sendMessage(chatId, 'Выберите способ оплаты:', createBtn(btnPaymentMethod))
                case 'card':
                    objOrder.pay = callback
                    result(callback, userName)

                    return bot.sendMessage(chatId, 'Заказ уже готовится! \n курьер приедит к вам с терминалом. \n Приятного аппетита')
                case 'cash':
                    objOrder.pay = callback
                    result(callback, userName)
                    return bot.sendMessage(chatId, 'Заказ уже готовится! \n К оплате 350$(чаевые курьеру приветствуются).\n Приятного аппетита')

                default:
                    return bot.sendMessage(chatId, 'Неверная команда messegeOrder')
            }
        }
        const ordersMenu = (arr, callback) => {
            const btnDescription = [{ text: 'Добавить в заказ', callback: 'addOrder' }, { text: 'Назад', callback: 'back' }]

            switch (true) {
                case arr.includes(callback):
                    objOrder.title=callback
                    return bot.sendMessage(chatId, `*Описание товара: ${callback}*\n   Цена: 300грн`, createBtn(btnDescription))
                default:
                    return messegeOrder(callback)
            }
        }
        const listFood = (arr) => {
            setTimeout(() => backBtn(), 1500)
            arr.map(el => subMenuShow(el.textBtn, el.callbackData))
        }
        const deleteMessage = (idArr) => {
            idArr.map(id => bot.deleteMessage(chatId, id))
        }

        const callbackDataArr = (objData) => {
            let arr = []
            for (let data in objData) {
                objData[data].map(el => arr.push(el.callbackData))
            }
            return arr
        }



        const baseMenu = (callback, dataArr) => {

            switch (callback || true) {
                case 'order':
                    return showOrders(completedOrders)

                case 'menu':
                    return menuShow()

                case 'promo':
                    return promoCode()

                case 'support':
                    return supportResponse()

                case 'subscribe':
                    bot.sendMessage(chatId, 'Благодарим вас за подписку!',)
                    return objOrder.subscribe = true

                case 'menuBtn':
                    return listFood(objbtnTitle.menu)
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


        
console.log(objOrder);
        baseMenu(callbackData, callbackDataArr(objbtnTitle))
        
    })

}

start()