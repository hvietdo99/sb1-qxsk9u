require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const assetRoutes = require('./routes/asset');
const transactionRoutes = require('./routes/transaction');
const paymentRoutes = require('./routes/payment');

const app = express();

// Middleware
app.use(express.json());
app.use(passport.initialize());

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/asset', assetRoutes);
app.use('/transaction', transactionRoutes);
app.use('/payment', paymentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});