const mongoose = require('mongoose');

const url = `mongodb+srv://chavdasandip2908:Sandip1105@cluster0.8gbqypn.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(url)
  .then(() => console.log('Connected to the database'))
  .catch((error) => console.error('Error connecting to the database:', error));
