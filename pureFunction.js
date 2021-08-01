


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

module.exports = {createBtn}
