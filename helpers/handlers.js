const request = require('request')

// Handle NLP
function firstTrait(nlp, name) {
  return nlp && nlp.entities && nlp.traits[name] && nlp.traits[name][0];
}

// Handles messages events
function handleMessage(sender_psid, received_message) {
  let response

  // Checks if the message contains text
  if (received_message.text) {
    // Handle greetings
    const greeting = firstTrait(received_message.nlp, 'wit$greetings');
    if (greeting && greeting.confidence > 0.8) {
      response = {
        "text": 'Hi there, whats your first name ?'
      }
    } else {
      const checkDate = received_message.text.split('-')
      // After greetings
      if (checkDate.length === 2) {
        response = {
          text: "please input your birth date using format YYYY-MM-DD ( Y: Year, M: Month, D: Date )"
        }
      } else {
        response = {
          text: "we will show rest date to your birth date"
        }
      }
    }

  } else if (received_message.attachments) {
    // Gets the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
  } 

  // Sends the response message
  callSendAPI(sender_psid, response);  
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  let response;
  
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { "text": "Thanks!" }
  } else if (payload === 'no') {
    response = { "text": "Oops, try sending another image." }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}

module.exports = {
  handleMessage,
  handlePostback,
  callSendAPI
}