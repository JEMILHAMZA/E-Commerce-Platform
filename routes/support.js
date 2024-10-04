

// routes/support.js
const express = require('express');
const router = express.Router();
const SupportRequest = require('../models/SupportRequest');
const nodemailer = require('nodemailer');

// routes/support.js

// Help topics data
const helpTopics = [
  {
    title: 'Order Issues',
    slug: 'order-issues',
    details: `
      If you're having trouble with your order, here are some common issues and how to resolve them:
      
      - Tracking an Order: You can track your order by visiting the 'Order History' page in your account. Use the tracking link provided in your order confirmation email.
      
      - Changing an Order: Once an order is placed, changes are only allowed within 1 hour of purchase. To request a change, contact our support team immediately.
      
      - Cancelling an Order: Orders can be canceled within 1 hour of purchase through your account or by contacting support.
  
      If you experience any issues beyond these, please reach out to our customer support.
    `,
    regulations: `
      Regulations for Order Processing:
  
      - All orders are processed within 24 hours.
      - Orders are shipped on business days (Monday-Friday).
      - Orders placed on weekends or holidays will be processed the next business day.
  
      For more information on order policies, please refer to our [Order Policy Documentation].
    `
  }
  ,
  {
    title: 'Returns and Refunds',
    slug: 'returns-refunds',
    details: `
      Returning a product or requesting a refund is simple. Follow the steps below:
  
      - Return Process:
        1. Log into your account and navigate to 'Order History.'
        2. Select the order you want to return and click 'Request Return.'
        3. Fill out the return form and submit it.
  
      - Refund Policy:
        - Refunds will be processed within 7-10 business days once we receive the returned item.
        - Refunds are issued to the original payment method.
      
      - Items Not Eligible for Return:
        - Perishable goods.
        - Items marked 'Final Sale.'
      
      If your product arrived damaged or faulty, please contact support immediately for assistance.
    `,
    regulations: `
      Return Policy and Refund Procedure:
  
      - Items must be returned in original condition and packaging.
      - Return requests must be submitted within 30 days of the purchase date.
      - Refunds will not include shipping fees unless the product was faulty.
  
      Please see our full [Return & Refund Policy] for more detailed information.
    `
  }
  ,
  {
    title: 'Shipping Information',
    slug: 'shipping-information',
    details: `
      Here’s what you need to know about our shipping process:
  
      - Shipping Methods: We offer various shipping options, including standard and expedited shipping. Choose the option that best suits your needs at checkout.
      
      - Shipping Timeframes:
        - Standard Shipping: 5-7 business days.
        - Expedited Shipping: 2-3 business days.
  
      - International Shipping: Available for select countries. International orders may take longer depending on customs and location.
  
      - Tracking Your Shipment: Once your order ships, you will receive a tracking number via email.
  
      If your order does not arrive within the estimated timeframe, please contact support with your order number for assistance.
    `,
    regulations: `
      Shipping Policies:
  
      - We process orders within 24 hours of receiving payment.
      - Delivery times may vary depending on the shipping method and destination.
      - Customers are responsible for paying any customs fees or import duties for international orders.
  
      For more information on shipping rates and policies, please visit our [Shipping Policy].
    `
  }
  ,
  {
    title: 'Account Management',
    slug: 'account-management',
    details: `
      Managing your account is easy. Here's how to handle common account tasks:
  
      - Resetting Your Password: Forgot your password? Go to the 'Login' page and click 'Forgot Password.' You’ll receive an email with instructions to reset your password.
  
      - Updating Account Information: 
        1. Log into your account.
        2. Navigate to 'Account Settings.'
        3. Update your personal information and save changes.
      
      - Managing Payment Methods: 
        - To add or update payment methods, visit 'Payment Methods' in your account settings.
  
      - Closing Your Account: To close your account, contact our support team. Please note, this process is irreversible.
    `,
    regulations: `
      Account Security Guidelines:
  
      - Use a strong password that includes a combination of letters, numbers, and special characters.
      - Do not share your password with anyone.
      - We will never ask for your password via email or phone.
  
      For more detailed guidelines on managing your account, please refer to our [Account Security Documentation].
    `
  }
  
];



// Route to render the main support page with help topics 
router.get('/', (req, res) => {
  res.render('support', { helpTopics, query: req.query });
});

// Route to render individual help topic details based on slug
router.get('/help-topics/:slug', (req, res) => {
  const topic = helpTopics.find(t => t.slug === req.params.slug);

  if (!topic) {
      return res.status(404).send('Help topic not found');
  }

  res.render('helpTopic', { topic });
});













// POST contact form (submit support request)
router.post('/submit', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Save the support request to the database
    const supportRequest = new SupportRequest({ name, email, message });
    await supportRequest.save();

    // Send an email to the admin with the support request (optional)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: email,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Support Request',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    await transporter.sendMail(mailOptions);

    res.redirect('/support?success=true');
  } catch (error) {
    console.error('Error submitting support request:', error);
    res.redirect('/support?error=true');
  }
});

module.exports = router;
