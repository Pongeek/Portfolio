import sgMail from '@sendgrid/mail';

export interface EmailData {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
}

export class SendGrid {
  constructor(apiKey: string) {
    if (apiKey) {
      sgMail.setApiKey(apiKey);
    }
  }

  async sendEmail(data: EmailData): Promise<void> {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SendGrid API key is not configured');
    }
    
    await sgMail.send(data);
  }
} 