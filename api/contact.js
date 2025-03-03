import sgMail from '@sendgrid/mail';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Get and validate SendGrid API key
    const apiKey = process.env.SENDGRID_API_KEY;
    
    if (!apiKey) {
      console.error('Error: SendGrid API key is missing');
      return res.status(500).json({ error: 'Email service is not configured properly' });
    }

    // Set SendGrid API key
    sgMail.setApiKey(apiKey);

    // Create the email content
    const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'portfolio@example.com';
    const toEmail = 'MaximPim95@gmail.com'; // Your email where you want to receive messages
    
    const mailOptions = {
      to: toEmail,
      from: {
        email: fromEmail,
        name: 'Portfolio Contact Form'
      },
      subject: `Portfolio Contact: ${name}`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
      html: `
<h3>New Contact Form Submission</h3>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
      `,
      mailSettings: {
        sandboxMode: {
          enable: false // Explicitly disable sandbox mode
        }
      }
    };

    // Log the email attempt
    console.log('Attempting to send email via SendGrid:', {
      to: toEmail,
      from: fromEmail,
      subject: mailOptions.subject
    });

    // Send the email
    const [response] = await sgMail.send(mailOptions);

    // Check if send was successful
    if (response.statusCode >= 200 && response.statusCode < 300) {
      console.log('Email sent successfully via SendGrid!', {
        statusCode: response.statusCode
      });
      return res.status(200).json({ success: true });
    } else {
      console.error('SendGrid returned non-success status code:', response.statusCode);
      return res.status(500).json({ 
        error: 'Failed to send email', 
        statusCode: response.statusCode 
      });
    }
  } catch (error) {
    // Create detailed error information for logging
    const errorInfo = {
      message: error.message,
      code: error.code,
      response: error.response ? {
        body: error.response.body,
        statusCode: error.response.statusCode
      } : null
    };

    console.error('SendGrid error:', errorInfo);
    
    // Handle known error types
    if (error.code === 'ECONNREFUSED') {
      return res.status(500).json({ error: 'Could not connect to email service' });
    }
    
    if (error.response && error.response.body) {
      // Try to provide more useful error information
      return res.status(500).json({ 
        error: 'Email service error', 
        details: error.response.body.errors ? error.response.body.errors.map(e => e.message).join(', ') : 'Unknown error'
      });
    }

    return res.status(500).json({ error: 'Failed to send email', message: error.message });
  }
} 