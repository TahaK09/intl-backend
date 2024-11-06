const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient, ObjectId, Binary } = require("mongodb");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection using Mongoose
mongoose
  .connect(
    "mongodb+srv://dars:darshan-123@cluster0.z0rsm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
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

// Email sending route
app.post("/api/send-email", async (req, res) => {
  const { subject, content } = req.body;
  const emails = await Newsletter.find({});
  const emailList = emails.map((e) => e.email);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: emailList,
    subject,
    text: content,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return res.status(500).send(error.toString());
    res.status(200).send("Emails sent: " + info.response);
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
