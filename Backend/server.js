

//next code
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


// Creating an express application
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(bodyParser.json());
app.use(cors());


// Database connection
mongoose.connect('mongodb+srv://abhilashkurapati2365:dxvQUrIl7pljoIfs@cluster0.rnwqv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB Atlas connected...');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Routes Setup
const authRoutes = require('./routes/auth');
const budgetRoutes = require('./routes/budgetRoutes');




app.use('/auth', authRoutes);
app.use('/api', budgetRoutes);



// Routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Starting the Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


