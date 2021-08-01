

const pusreFunction = require('./pureFunction')

const {sendMessege} = pusreFunction

const baseMenu=(func,chatId,text,btn)=>{
    
    
    return sendMessege(func,chatId,text,btn)
    // return bot.sendMessage(chatId, `Добро пожаловать, @${userName} ! Я @test2107Foodbot с моей помощью ты сможешь поесть быстро и вкусно 😋`, btn)
}

module.exports = baseMenu