import { Attachment } from 'nodemailer/lib/mailer';
import config from '../../config';
import { transporter } from '../../config/emailTransporter';

export const sendEmail = async (to: string, subject: string, text: string, attachments?: Attachment[]) => {
    try {
        const info = await transporter.sendMail({
            from: config.mailgun_from_email_address || '"Visa Portal" <noreply@example.com>',
            to,
            subject,
            text,
            attachments,
        });

        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email: ', error);
        // In production, we might want to throw or log to a service
    }
};

