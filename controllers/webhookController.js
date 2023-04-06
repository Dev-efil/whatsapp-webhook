import axios from 'axios';

// To verify the callback url from cloud api
export const verifyWebhook = async (req, res) => {
    try {
        const mode = req.query['hub.mode'];
        const challenge = req.query['hub.challenge'];
        const token = req.query['hub.verify_token'];

        if (!mode || !token) {
            return res.sendStatus(404);
        }
        if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
            return res.status(200).send('Webhook received successfully', challenge);
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

    if (!data?.[0]?.changes?.[0]?.value?.message?.[0]) {
        return res.sendStatus(404);
    }
    else {
        const ourPhoneNumberId = data.value.metadata.phone_number_id;
        const userPhoneNumber = data.value.messages[0].from;

        const apiUrl = `https://graph.facebook.com/v16.0/${ourPhoneNumberId}/messages`;

        try {
            const response = await axios.post(apiUrl,
                {
                    messaging_product: 'whatsapp',
                    to: userPhoneNumber,
                    text: {
                        body: 'Hello to you!'
                    }

                },
                {
                    headers: {
                        ContentType: 'application/json',
                        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
                    }
                }
            );
            console.log(response);
            if (response.status !== 200) {
                return res.send(`Unexpected status code: ${response.status}`);
            }
            return res.sendStatus(200);
        } catch (error) {
            console.log(error);
            return res.sendStatus(500);
        }
    }
}