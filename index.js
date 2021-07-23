const TelegramApi = require('node-telegram-bot-api')

const token = '1925452654:AAFtRbRRnXV8nV9UIE4ulCgcB4MnU7UWXRc'

const bot = new TelegramApi(token, { polling: true })

bot.setMyCommands([
    {command: '/start', description:'Начало работы'},
    {command: '/keyboard', description:'Вызвать клавматуру'},
])

const completedOrders = [
    {
        order: 1, 
        address:'Введенный адрес', 
        phone:'9998881214', 
        comment:'Введённый комент',
        status:'Введённый статус'
    },
    {
        order: 2, 
        address:'Введенный адрес', 
        phone:'9998881214', 
        comment:'Введённый комент',
        status:'Введённый статус'
    },
    {
        order: 3, 
        address:'Введенный адрес', 
        phone:'9998881214', 
        comment:'Введённый комент',
        status:'Введённый статус'
    },
]

const arrSupport = []

const idAdminPanel = -1001203491315

const objbtnTitle = [
    {textBtn:'БигБургер меню', callbackData: 'burgerMenu'},
    {textBtn:'Фитнес меню', callbackData: 'fitnesMenu'},
    {textBtn:'Мясное меню', callbackData: 'meanMenu'},
    {textBtn:'Нагеты Меню', callbackData: 'nagetsMenu'},
]

const start = () => {
    
    bot.on('message', async (msg, t) => {
        const text = msg.text
        const chatId = msg.chat.id
        const userName = msg.from.username
        // console.log(msg);
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
      
        if (text === '/start') {
            return bot.sendMessage(chatId, `Добро пожаловать, @${userName} ! Я @test2107Foodbot с моей помощью ты сможешь поесть быстро и вкусно 😋`,opts)
        }
        if (text === '/keyboard') {
            return bot.sendMessage(chatId, 'keyboard', opts)
        }
        if (text.toLowerCase().includes('support')) {
            
            await bot.sendMessage(idAdminPanel, text.replace(/support/g,''))
            return bot.sendMessage(chatId, 'Ваше сообщение отправленно в службу поддержки')
            
        }
        return bot.sendMessage(chatId, 'Не верная команда')
        
    })
    ////////////////////////////////////////////////////////////////////

    bot.on('callback_query', async el => {
        
        const chatId = el.message.chat.id
        const callbackData = el.data
        // console.log(callbackData);
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
        const supportResponse=()=>{
            bot.sendMessage(chatId,
                 `Введите ваш запрос и наша администрация ответит в ближайшее время.
                (Перед сообщением поставьте команду "support")`)
        }
        const promoCode=()=>{
            
            const subscribeBtn = {
                reply_markup: {
                    inline_keyboard: [[{ text: 'Подписаться', callback_data: 'subscribe' }]]
                }
            }
            bot.sendMessage(chatId,
                 `Подпишитесь на наш канал чтобы получить промокод на бесплатную доставку и возможность получать новые промо-коды`,subscribeBtn)
        }
        const menuShow=()=>{
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
            bot.sendMessage(chatId,`Что именно вас инетересует?`,menuBtn)
           
        }
        const subMenuShow=(textBtn,callbackData)=>{
            const btn = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: textBtn, callback_data: callbackData }],
                        
                    ]
                }
            }
            const url = './img/burger.jpg';
            bot.sendPhoto(chatId, './img/burger.jpg',btn);
        }
        const backBtn =()=>{
            const back = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'BACK', callback_data: 'btnBack' }],
                    ]
                }
            }
            bot.sendMessage(chatId,'Вернуться назад',back)
        }

        
        switch (callbackData) {
            case 'order':
                return showOrders(completedOrders)
                
            case 'menu':
                return menuShow()
              
            case 'promo':
                return promoCode()
              
            case 'support':
                return supportResponse()
                
            case 'subscribe':
                return bot.sendMessage(chatId, 'Благодарим вас за подписку!')

            case 'menuBtn':
                await backBtn()
                return objbtnTitle.map(el=>subMenuShow(el.textBtn,el.callbackData))

            case 'pizza':
                return bot.sendMessage(chatId, 'pizza!')
            case 'burger':
                return bot.sendMessage(chatId, 'burger!')
            case 'drink':
                return bot.sendMessage(chatId, 'drink!')
              
            default:
                return bot.sendMessage(chatId, 'fuck')
        }

        
           
    })
    
}

start()