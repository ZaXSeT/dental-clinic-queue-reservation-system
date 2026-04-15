const nodemailer = require('nodemailer');

async function testEmail() {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'zackyxieantigravity1@gmail.com',
            pass: 'gitd iqqa svtp qvbk'
        }
    });

    try {
        console.log('Attempting to send test email...');
        await transporter.sendMail({
            from: '"Test" <zackyxieantigravity1@gmail.com>',
            to: 'zackyxieantigravity1@gmail.com', // send to self
            subject: 'SMTP Test',
            text: 'If you see this, SMTP is working!'
        });
        console.log('✅ SMTP is working correctly!');
    } catch (error) {
        console.error('❌ SMTP Error:', error);
    }
}

testEmail();
