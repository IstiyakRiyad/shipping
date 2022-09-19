const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios').default;


const {
    MAIL_API_KEY,
    MAIL_DOMAIN,
    MAIL_TO
} = process.env;

const fileData = fs.readFileSync(path.resolve(__dirname, 'mailTemplate.html')).toString();


const formData = new FormData();

formData.append('from', `Admin <mailgun@${MAIL_DOMAIN}>`);
formData.append('to', `${MAIL_TO}`);
formData.append('subject', 'Notification');
formData.append('text', 'Notification ');
formData.append('html', fileData);


const sendMail = async () => {
    try {
        const {data} = await axios.post(
            `https://api.mailgun.net/v3/${MAIL_DOMAIN}/messages`,
            formData,
            {
                auth: {
                    username: 'api',
                    password: MAIL_API_KEY
                }
            }
        );

        return data;
    }
    catch(error) {
        console.log(error.message);
    }

}



module.exports = sendMail;
