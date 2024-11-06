const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient, ObjectId, Binary } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection using Mongoose
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Schema and models
const LinkSchema = new mongoose.Schema({
  link: { type: String, required: true },
  title: { type: String, required: true },
});

const PdfSchema = new mongoose.Schema({
  link: { type: String, required: true },
  title: { type: String, required: true },
});

const blogSchema = new mongoose.Schema({
  imgLink: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const internSchema = new mongoose.Schema({
  imgLink: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: [String], required: true },
  deadline: { type: Date, required: true },
  link: { type: String, required: true },
});

const testimonialSchema = new mongoose.Schema({
  imgLink: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const NewsletterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  country: { type: String, required: true },
});

const Link = mongoose.model("Link", LinkSchema);
const PDF = mongoose.model("Pdf", PdfSchema);
const Blog = mongoose.model("Blog", blogSchema);
const Intern = mongoose.model("Internship", internSchema);
const Testimonial = mongoose.model("Testimonial", testimonialSchema);
const Newsletter = mongoose.model("Newsletter", NewsletterSchema);

// Routes
app.post("/api/pdfs", async (req, res) => {
  try {
    const newPDF = new PDF(req.body);
    await newPDF.save();
    res.status(201).json(newPDF);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/pdfs", async (req, res) => {
  try {
    const pdfs = await PDF.find();
    res.status(200).json(pdfs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
