const listBtn = {
    btnAddComment: [
        { text: 'Да', callback: 'yes' },
        { text: 'Нет', callback: 'no' },
        { text: 'Назад', callback: 'back' },
    ],
    baseMenuBtn: {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Меню🍔', callback_data: 'menu' },
                { text: 'Мои заказы📜', callback_data: 'order' }],
    
                [{ text: 'Промо-код🌟', callback_data: 'promo' },
                { text: 'Поддержка👨‍💻', callback_data: 'support' }]
            ]
        }
    },
    btnBack: [
        { text: 'Назад', callback: 'back' }
    ],
    menuBtn: [
        { text: 'Меню', callback: 'menuBtn' },
        { text: 'Пицца', callback: 'pizza' },
        { text: 'Бургеры', callback: 'burger' },
        { text: 'Напитки', callback: 'drink' },
    ],
    btnAddAddOrder: [
        { text: 'Дополнить заказ', callback: 'addAddOrder' },
        { text: 'Оплатить Заказ', callback: 'payOrder' },
        { text: 'Назад', callback: 'back' },
    ],
    btnPaymentMethod: [
        { text: 'Карта', callback: 'card' },
        { text: 'Наличные', callback: 'cash' },

    ],
    btnResultStatus: [
        { text: 'В пути', callback: 'inWay' },
        { text: 'Доставлен', callback: 'delivered' },
    ],
    btnDescription: [
        { text: 'Добавить в заказ', callback: 'addOrder' },
        { text: 'Назад', callback: 'back' }
    ]
}



 
module.exports = listBtn