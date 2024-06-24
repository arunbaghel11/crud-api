const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error(err);
});

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const materialsRouter = require('./routes/materials');
app.use('/materials', materialsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
