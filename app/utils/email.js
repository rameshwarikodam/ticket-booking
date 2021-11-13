const nodemailer = require('nodemailer');
const common = require('../common/constants');

async function shoot(info){
    console.log('email:',common.mail);
    let transporter = nodemailer.createTransport({
        service: common.mail.service,
        host: common.mail.host,
        auth:{
            user: common.mail.user,
            pass: common.mail.pass
        }
    });
    return await transporter.sendMail({
        from: common.mail.user,
        to: info.emailTo,
        cc: info.emailCC,
        subject: info.subject,
        // html: info.bodyTemplate
    });
}

exports.shoot = shoot;