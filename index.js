const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient, ObjectId, Binary } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const allowedOrigins = ["https://makeitintl.com", "http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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
  imgLink: String,
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const NewsletterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  country: { type: String, required: true },
});

const DeadlineSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  state: { type: String, required: true },
  Round: { type: String, required: true },
  Date: { type: String, required: true },
});

const Link = mongoose.model("Link", LinkSchema);
const PDF = mongoose.model("Pdf", PdfSchema);
const Blog = mongoose.model("Blog", blogSchema);

const Intern = mongoose.model("Internship", internSchema);
const Testimonial = mongoose.model("Testimonial", testimonialSchema);
const Newsletter = mongoose.model("Newsletter", NewsletterSchema);

const Deadline = mongoose.model("Deadline", DeadlineSchema);

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

app.delete("/api/pdfs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletePDF = await PDF.findByIdAndDelete(id);
    if (!deletePDF) {
      return res.status(404).json({ error: "PDF not found" });
    }
    res.status(200).json({ message: "PDF deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Links
app.post("/api/links", async (req, res) => {
  try {
    const newLink = new Link(req.body);
    await newLink.save();
    res.status(201).json(newLink);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/links", async (req, res) => {
  try {
    const newLink = await Link.find();
    res.status(200).json(newLink);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/links/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLink = await Link.findByIdAndDelete(id);
    if (!deletedLink) {
      return res.status(404).json({ error: "Link not found" });
    }
    res.status(200).json({ message: "Link deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Blogs
app.post("/api/blogs", async (req, res) => {
  try {
    const newBlog = new Blog(req.body);
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/blogs", async (req, res) => {
  try {
    const newBlog = await Blog.find();
    res.status(200).json(newBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/blogs/latest", async (req, res) => {
  try {
    const latestBlogs = await Blog.find().sort({ createdAt: -1 }).limit(3); // Fetch the latest 3 blogs
    res.json(latestBlogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Testimonial
app.post("/api/testimonials", async (req, res) => {
  try {
    const newTestimonial = new Testimonial(req.body);
    await newTestimonial.save();
    res.status(201).json(newTestimonial);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/testimonials", async (req, res) => {
  try {
    const newTestimonial = await Testimonial.find();
    res.status(200).json(newTestimonial);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/testimonials/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTestimonial = await Testimonial.findByIdAndDelete(id);
    if (!deletedTestimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }
    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Newsletter
app.post("/api/newsletter", async (req, res) => {
  try {
    const newNewsletter = new Newsletter(req.body);
    await newNewsletter.save();
    res.status(201).json(newNewsletter);
  } catch (err) {
    res.status(500).json({ err: "Internal Server Error" });
  }
});

//Internship
app.post("/api/internships", async (req, res) => {
  try {
    const newIntern = new Intern(req.body);
    await newIntern.save();
    res.status(201).json(newIntern);
  } catch (err) {
    res.status(500).json({ err: "Internal Server Error" });
  }
});
app.get("/api/internships", async (req, res) => {
  try {
    // Get the current date
    const currentDate = new Date();

    // Fetch internships with a deadline that is after the current date
    const newInterns = await Intern.find({
      deadline: { $gte: currentDate }, // $gte means "greater than or equal to"
    });

    res.status(200).json(newInterns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Deadline Calendar
app.post("/api/deadlines", async (req, res) => {
  try {
    const newdeadline = new Deadline(req.body);
    await newdeadline.save();
    res.status(201).json(newdeadline);
  } catch (err) {
    res.status(500).json({ err: "Internal Server Error" });
  }
});
app.get("/api/deadlines", async (req, res) => {
  try {
    const newdeadline = await Deadline.find();
    res.status(200).json(newdeadline);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
