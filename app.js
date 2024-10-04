// app.js

const express = require('express');
const connectDB = require('./config/db');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // To store sessions in MongoDB
const app = express();


// Connect to the database
connectDB();

// Set view engine to EJS
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Public folder for static assets
app.use(express.static('public'));


app.use(session({
  secret: process.env.SESSION_SECRET, // Use a strong secret stored in environment variables
  
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }), // Store session in MongoDB
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // Session valid for 1 day
}));



// Middleware to attach user to res.locals
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});



// Routes
app.use('/', require('./routes/index'));  // Homepage route
app.use('/product', require('./routes/product'));  // Product details route
app.use('/cart', require('./routes/cart'));  // Cart route
app.use('/checkout', require('./routes/checkout'));
app.use('/order', require('./routes/order'));
app.use('/product', require('./routes/review'));
app.use('/', require('./routes/auth'));  // Authentication routes

app.use('/support', require('./routes/support'));
app.use('/admin', require('./routes/admin')); // Consolidated admin routes





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
















// Routes
// app.use('/', require('./routes/index'));  // Homepage route
// app.use('/product', require('./routes/product'));  // Product details route
// app.use('/cart', require('./routes/cart'));  // Cart route


// app.use('/checkout', require('./routes/checkout'));
// app.use('/order', require('./routes/order'));

// app.use('/', require('./routes/auth'));  // Authentication routes
// app.use('/admin', require('./routes/admin'));
// app.use('/admin', require('./routes/adminOrder')); 
// app.use('/admin', require('./routes/product')); 












