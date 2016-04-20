var Botkit = require('botkit')

var accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
var verifyToken = process.env.FACEBOOK_VERIFY_TOKEN
var port = process.env.PORT

if(!accessToken) throw new Error('FACEBOOK_PAGE_ACCESS_TOKEN is required but missing')
if(!verifyToken) throw new Error('FACEBOOK_VERIFY_TOKEN is required but missing')
if(!port) throw new Error('PORT is required but missing')

var controller = Botkit.facebookbot({
	access_token: accessToken,
	verify_token: verifyToken
})

var bot = controller.spawn()
controller.setupWebserver(port, fuction(err, webserver){
	if(err) return console.log(err)
	controller.createWebhookEndpoints(webserver, bot, fuction(){
		console.log('Ready player 1')
	})
})

controller.hears(['hello','hi'], 'message_received', fuction(bot, message) {
	bot.reply(message, 'Hello!')
	bot.reply(message, 'I want to show you something')
	bot.reply(message, {
		attachement: {
			type: 'template',
			payload: {
				template_type: 'button',
				text: 'Which do you prefer?',
				buttons: [
					{
						type: 'postback',
						title: 'Cats',
						payload: 'show_cat'
					},
					{
						type: 'postback',
						title: 'Dogs',
						payload: 'show_dog'
					}
				]
			}
		}
	})
})


controller.on('facebook_postback', fuction(bot, message){
	switch (message.payload){
		case 'show_cat':
			bot.reply(message, {
				attachement: {
					type: 'image',
					payload: {
						url: 'https://media.giphy.com/media/QgcQLZa6glP2w/giphy.gif'
					}
				}
			})
			break;
		case 'show_dog':
			bot.reply(message, {
				attachement: {
					type: 'image',
					payload: {
						url: 'https://media.giphy.com/media/9gn4lhW6wiQ6c/giphy.gif'
					}
				}
			})
			break;
	}
})