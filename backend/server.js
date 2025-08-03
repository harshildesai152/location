const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); 
const db = require('./config/db'); 
const cookieParser = require('cookie-parser'); 
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true 
}));

app.use('/api', userRoutes);


app.get('/', (req, res) => {
  res.send('Hello, World!');
});


const port = process.env.PORT || 3000;

(async () => {
  try {
   
    await db.query('SELECT 1');
    console.log('Database connection successful');

   
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    
    console.error('Database connection failed:', err);
    process.exit(1); 
  }
})();