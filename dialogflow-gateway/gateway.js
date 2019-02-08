// source: https://github.com/MishUshakov/dialogflow-gateway/blob/master/index.js

const dialogflow = require('dialogflow')

// const serviceAccount = require('./service_account.json')  // <-- change service_account to yours
let privApiKey = process.env.serviceAccount_private_key.replace(String.fromCharCode(92,02),String.fromCharCode(92));

/* AgentsClient retrieves information about the agent */
const agentsClient = new dialogflow.AgentsClient({
    credentials: { // <-- Initialize with service account
        private_key: privApiKey,
        client_email: process.env.serviceAccount_client_email
    }
})

/* SessionsClient makes text requests */
const sessionClient = new dialogflow.SessionsClient({
    credentials: { // <-- Initialize with service account
        private_key: privApiKey,
        client_email: process.env.serviceAccount_client_email
    }
})

/* We need to set this headers, to make our HTTP calls possible */
let headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type, Cache-Control',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*'
}

//gateway = (req, res) => {

module.exports = {

    handleGatewayRequest: (req, res) => {
        
        console.log("Executing handleGatewayRequest ... ");
        console.log("agentsClient ... ", agentsClient);

        /* On GET request return the information about the agent */
        if (req.method == "GET") {
            agentsClient.getAgent({ parent: 'projects/' + process.env.serviceAccount_project_id }, {}, (err, agent) => {
                if (err) {
                    res.set(headers)
                    res.send(500, err.message)
                }

                else {
                    res.set(headers)
                    res.send(agent)
                }
            })
        }

        /* Detect Intent (send a query to dialogflow) */
        else if (req.method == "POST") {

            /* If no body, session, query, or lang, return 400 */
            if (!req.body || !req.body.session_id || !req.body.q || !req.body.lang) {
                res.set(headers)
                res.send(400)
            }

            /* Prepare dialogflow request */
            else {
                let session_id = req.body.session_id
                let q = req.body.q
                let lang = req.body.lang

                let sessionPath = sessionClient.sessionPath(process.env.serviceAccount_project_id, session_id)
                let request = {
                    session: sessionPath,
                    queryInput: {
                        text: {
                            text: q,
                            languageCode: lang
                        }
                    }
                }

                /* Send our request to Dialogflow */
                sessionClient.detectIntent(request).then(responses => {

                        /* If the response should be formatted (?format=true), then return the format the response */
                        if (req.query.format == "true") {
                            let fulfillment = responses[0].queryResult.fulfillmentMessages

                            /* Base of formatted response */
                            let formatted = {
                                id: responses[0].responseId,
                                action: responses[0].queryResult.action,
                                query: responses[0].queryResult.queryText,
                                params: responses[0].queryResult.parameters,
                                diagnosticInfo: responses[0].queryResult.diagnosticInfo,
                                components: []
                            }

                            /* Iterate through components and add them to components list */
                            for (let component in fulfillment) {

                                /* Recognize Dialogflow and Webhook components */
                                if (fulfillment[component].platform == "PLATFORM_UNSPECIFIED") {
                                    if (fulfillment[component].text) {

                                        /* Default/Webhook Text */
                                        formatted.components.push({ name: "DEFAULT", content: fulfillment[component].text.text[0] })
                                    }

                                    if (fulfillment[component].card) {

                                        /* Convert Webhook Card to Actions on Google Card (to follow a common format) */
                                        let google_card = {
                                            title: fulfillment[component].card.title,
                                            formattedText: fulfillment[component].card.subtitle,
                                            image: {
                                                imageUri: fulfillment[component].card.imageUri,
                                                accessibilityText: 'Card Image'
                                            },
                                            buttons: []
                                        }

                                        for (let button in fulfillment[component].card.buttons) {
                                            google_card.buttons.push({
                                                title: fulfillment[component].card.buttons[button].text,
                                                openUriAction: {
                                                    uri: fulfillment[component].card.buttons[button].postback
                                                }
                                            })
                                        }

                                        formatted.components.push({ name: "CARD", content: google_card })
                                    }

                                    if (fulfillment[component].image) {

                                        /* Webhook Image */
                                        formatted.components.push({ name: "IMAGE", content: fulfillment[component].image })
                                    }

                                    if (fulfillment[component].quickReplies) {

                                        /* Webhook Suggestions */
                                        formatted.components.push({ name: "SUGGESTIONS", content: fulfillment[component].quickReplies.quickReplies })
                                    }
                                }

                                /* Recognize Actions on Google components */
                                if (fulfillment[component].platform == "ACTIONS_ON_GOOGLE") {
                                    if (fulfillment[component].simpleResponses) {

                                        /* Google Simple Response */
                                        formatted.components.push({ name: "SIMPLE_RESPONSE", content: fulfillment[component].simpleResponses.simpleResponses[0] })
                                    }

                                    if (fulfillment[component].basicCard) {

                                        /* Google Card */
                                        formatted.components.push({ name: "CARD", content: fulfillment[component].basicCard })
                                    }

                                    if (fulfillment[component].listSelect) {

                                        /* Google List */
                                        formatted.components.push({ name: "LIST", content: fulfillment[component].listSelect })
                                    }

                                    if (fulfillment[component].suggestions) {

                                        /* Convert Google Suggestions to text-only suggestions (like the webhook quick-replies) */
                                        let suggestions = fulfillment[component].suggestions.suggestions.map(suggestion => suggestion.title)
                                        formatted.components.push({ name: "SUGGESTIONS", content: suggestions })
                                    }

                                    if (fulfillment[component].linkOutSuggestion) {

                                        /* Google Link out suggestion */
                                        formatted.components.push({ name: "LINK_OUT_SUGGESTION", content: fulfillment[component].linkOutSuggestion })
                                    }

                                    if (fulfillment[component].payload) {

                                        /* Google Payload */
                                        formatted.components.push({ name: "PAYLOAD", content: fulfillment[component].payload })
                                    }

                                    if (fulfillment[component].carouselSelect) {

                                        /* Google Carousel Card */
                                        formatted.components.push({ name: "CAROUSEL_CARD", content: fulfillment[component].carouselSelect.items })
                                    }
                                }

                                if (fulfillment[component].platform == "FACEBOOK" || fulfillment[component].platform == "SLACK" || fulfillment[component].platform == "TELEGRAM" || fulfillment[component].platform == "KIK" || fulfillment[component].platform == "VIBER" || fulfillment[component].platform == "SKYPE" || fulfillment[component].platform == "LINE") {
                                    if (fulfillment[component].text) {

                                        /* Messenger Text */
                                        formatted.components.push({ name: "DEFAULT", content: fulfillment[component].text.text[0] })
                                    }

                                    if (fulfillment[component].image) {

                                        /* Messenger Image */
                                        formatted.components.push({ name: "IMAGE", content: fulfillment[component].image })
                                    }

                                    if (fulfillment[component].card) {

                                        /* Convert Messenger Card to Actions on Google Card  */
                                        let google_card = {
                                            title: fulfillment[component].card.title,
                                            formattedText: fulfillment[component].card.subtitle,
                                            image: {
                                                imageUri: fulfillment[component].card.imageUri,
                                                accessibilityText: 'Card Image'
                                            },
                                            buttons: []
                                        }

                                        for (let button in fulfillment[component].card.buttons) {
                                            google_card.buttons.push({
                                                title: fulfillment[component].card.buttons[button].text,
                                                openUriAction: {
                                                    uri: fulfillment[component].card.buttons[button].postback
                                                }
                                            })
                                        }

                                        formatted.components.push({ name: "CARD", content: google_card })
                                    }

                                    if (fulfillment[component].payload) {

                                        /* Messenger Payload */
                                        formatted.components.push({ name: "PAYLOAD", content: fulfillment[component].payload })
                                    }
                                }
                            }

                            res.set(headers)
                            res.send(formatted)
                            console.log("res",res);
                        }

                        else {
                            res.set(headers)
                            res.send(responses[0])
                            console.log("res",res);
                        }
                    })
                    .catch(err => {
                        res.set(headers)
                        res.send(500, err.message)
                    })
            }
        }

        /* Pass pre-flight HTTP check */

        else if (req.method == 'OPTIONS') {
            res.set(headers)
            res.send(200)
        }

        /* Send 404 on undefined method */

        else {
            res.set(headers)
            res.send(404)
        }
    }
}

/*
const restify = require('restify')
let server = restify.createServer()

server.get('/', gateway)
server.post('/', gateway)
server.opts('/', gateway)

server.use(restify.plugins.bodyParser())
server.use(restify.plugins.queryParser())

server.listen(8090, () => {
    console.log('Dialogflow Gateway is listening at %s', server.url)
})
*/
