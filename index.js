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

const botMessageId = []

const start = () => {
   
    bot.on('message', async (msg, t) => {
        const text = msg.text
        const chatId = msg.chat.id

        // console.log(chatId);

        const userName = msg.from.username
        
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
                        [{ text:textBtn , callback_data: callbackData }],
                        
                    ]
                }
            }
            let url = './img/burger.jpg'
            bot.sendPhoto(chatId, url ,btn).then(prop=>botMessageId.push(prop.message_id))
            console.log(botMessageId);
        }
        const  backBtn =()=>{
            const back = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'BACK', callback_data: 'btnBack' }],
                    ]
                }
            }
            console.log(botMessageId[0])
                if(botMessageId.length > 0){
                    return bot.sendMessage(chatId,'Вернуться назад',back)
                }
                
           
        }
        const listFood =(arr)=>{

            setTimeout(() =>backBtn(),1500)
            arr.map(el=>subMenuShow(el.textBtn,el.callbackData))
           
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
               return listFood(objbtnTitle.menu)
            case 'pizza':
                return listFood(objbtnTitle.pizza)
            case 'burgerMenu':
                return listFood(objbtnTitle.burger)
            case 'drink':
                return listFood(objbtnTitle.drink)
            case 'btnBack': 
            // await console.log(toString(botMessageId[0]))
            await bot.deleteMessage(chatId, botMessageId[-1]).then(res=>console.log(res))
                break
                // return bot.deleteMessage(chatId, toString(botMessageId[-1])).then(res=>console.log(res))
            default:
                return bot.sendMessage(chatId, 'fuck')
        }
    })
  
}

start()