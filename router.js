// libraries
const bodyParser = require('body-parser')

// middleware
// const google_jwt_check = require('./auth/google_jwt_check').google_jwt_check
// const origin_check = require('./auth/origin_check').origin_check

// routes
const Test = require('./routes/test_routes')
const DialogFlow = require('./routes/dialogflow_routes')
const Feedback = require('./routes/feedback_routes')

// bodyParser attempts to parse any request into JSON format
const json_encoding = bodyParser.json({type:'*/*'})

module.exports = function(app){

	// routes
	app.get('/test', json_encoding, Test.test)

	// dialogflow
	app.post('/init_dialogflow', [json_encoding], DialogFlow.init_dialogflow)
	app.post('/send_message', [json_encoding], DialogFlow.send_message)
	app.post('/dialogflow_fulfillment_renthero', [json_encoding], DialogFlow.dialogflow_fulfillment_renthero)

	app.post('/get_chatbot_logs_for_ad', [json_encoding], DialogFlow.get_chatbot_logs_for_ad)
	app.post('/dialogflow_property_question', [json_encoding], DialogFlow.dialogflow_property_question)
	app.post('/dialogflow_init_qualification', [json_encoding], DialogFlow.dialogflow_init_qualification)
	app.post('/dialogflow_execute_event', [json_encoding], DialogFlow.dialogflow_execute_event)

	app.post('/save_user_reaction', [json_encoding], Feedback.save_user_reaction)
}
