const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Material = require('../models/Material');

dotenv.config();

const seedData = [
  {
    name: "PLA",
    technology: "FDM",
    colors: ["Red", "Blue", "Green"],
    pricePerGram: 0.03,
    applicationTypes: ["Prototyping", "Educational"],
    imageUrl: "https://example.com/images/pla.jpg"
  },
  {
    name: "ABS",
    technology: "FDM",
    colors: ["Black", "White"],
    pricePerGram: 0.05,
    applicationTypes: ["Mechanical Parts", "Prototyping"],
    imageUrl: "https://example.com/images/abs.jpg"
  },
  {
    name: "Resin",
    technology: "SLA",
    colors: ["Clear", "Gray"],
    pricePerGram: 0.10,
    applicationTypes: ["Dental", "Miniatures"],
    imageUrl: "https://example.com/images/resin.jpg"
  },
  {
    name: "Nylon",
    technology: "SLS",
    colors: ["Natural", "Black"],
    pricePerGram: 0.07,
    applicationTypes: ["Functional Parts", "Prototyping"],
    imageUrl: "https://example.com/images/nylon.jpg"
  },
  {
    name: "PETG",
    technology: "FDM",
    colors: ["Transparent", "White"],
    pricePerGram: 0.04,
    applicationTypes: ["Mechanical Parts", "Prototyping"],
    imageUrl: "https://example.com/images/petg.jpg"
  },
  {
    name: "TPU",
    technology: "FDM",
    colors: ["Black", "White", "Red"],
    pricePerGram: 0.06,
    applicationTypes: ["Flexible Parts", "Prototyping"],
    imageUrl: "https://example.com/images/tpu.jpg"
  }
];

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to MongoDB');
  await Material.deleteMany({});
  await Material.insertMany(seedData);
  console.log('Data seeded successfully');
  mongoose.connection.close();
}).catch(err => {
  console.error(err);
});
