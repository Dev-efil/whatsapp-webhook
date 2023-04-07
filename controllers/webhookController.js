import axios from 'axios';

// To verify the callback url from cloud api
export const verifyWebhook = async (req, res) => {
    console.log('verifyWebhook', req.query);
    try {
        const mode = req.query['hub.mode'];
        const challenge = req.query['hub.challenge'];
        const token = req.query['hub.verify_token'];

        if (!mode || !token) {
            return res.sendStatus(404);
        }
        if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
            console.log("challenge", challenge);
            return res.status(200).send(challenge);
        }
        return res.sendStatus(403);
    } catch (error) {
        console.error(error);
        return res.status(500).send('An error occurred while processing the webhook');
    }
}

// To handle reply message to user
export const handleReplyMessage = async (req, res) => {
    const data = req.body.entry;
    console.log(JSON.stringify(data, null, 2));

    if (!data?.[0]?.changes?.[0]?.value?.messages?.[0]) {
        return res.sendStatus(404);
    }
    else {
        const ourPhoneNumberId = data[0].changes[0].value.metadata.phone_number_id;
        const userPhoneNumber = data[0].changes[0].value.messages[0].from;
        console.log('ourPhoneNumberId', ourPhoneNumberId);
        console.log('userPhoneNumber', userPhoneNumber);
        const apiUrl = `https://graph.facebook.com/v16.0/${ourPhoneNumberId}/messages`;
        const dataTemplate = {
            messaging_product: 'whatsapp',
            to: userPhoneNumber,
            type: 'text',
            text: {
                body: 'Hello to you!'
            }
        }
        try {
            const response = await axios.post(apiUrl, dataTemplate,
                {
                    headers: {
                        ContentType: 'application/json',
                        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`
                    }
                }
            );
            console.log('response dataTemplate', response);
            if (response.status !== 200) {
                return res.send(`Unexpected status code: ${response.status}`);
            }
            return res.sendStatus(200);
        } catch (error) {
            console.log("out here", error);
            return res.sendStatus(500);
        }
    }
}