const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const _ = require("lodash");
const cors = require("cors");
const expressSession = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const markdown = require("markdown").markdown;

const stripHtmlTags = (text) => text.replace(/<\/?[^>]+(>|$)/g, ""); // Function to strip HTML tags

// Middleware setup
app.use(cors());
app.set("view engine", "ejs"); // Set EJS as the view engine
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/scripts", express.static(path.join(__dirname, "node_modules/markdown/lib")));

app.use(
  expressSession({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to 'true' only for HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash(); // Make flash messages available in views
  res.locals.username = req.isAuthenticated() ? req.user.username : null; // Provide username if authenticated
  next(); // Continue with the next middleware
});

// MongoDB connection
const mongoDBUri = "mongodb+srv://admin:fTe6uS1KMiVrWgcN@notes-cluster.1tihbik.mongodb.net/?retryWrites=true&w=majority&appName=Notes-Cluster";
mongoose.connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("connected", () => console.log("Connected to MongoDB"));
mongoose.connection.on("reconnected", () => console.log("Reconnected to MongoDB"));
mongoose.connection.on("disconnected", () => console.log("Disconnected from MongoDB"));
mongoose.connection.on("error", (err) => console.error("MongoDB connection error:", err));

// Close MongoDB connection on SIGINT (Ctrl+C)
process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed due to application termination");
    process.exit(0);
  });
});

// Mongoose schemas
const blogSchema = new mongoose.Schema({
  heading: String,
  content: String,
  author: String,
  date: { type: Date, default: Date.now },
  place: String,
  tags: {
    type: [String], // Tags as an array
    validate: {
      validator: function (tags) {
        //controlla che ogni tag sia di tipo stringa, trimma e controlla che la lunghezza sia 
        return tags.every(tag => typeof tag === 'string' && tag.trim().length > 0);
      },
      message: 'All tags must be non-empty strings',
    },
  },
});


const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const Blog = mongoose.model("Blog", blogSchema);
const User = mongoose.model("User", userSchema);

// Passport setup for user authentication
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: "Incorrect username or password." });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return done(null, false, { message: "Incorrect username or password." });
      }

      return done(null, user); // Successful authentication
    } catch (err) {
      return done(err); // Error during authentication
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id); // serializza l'id utente
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user); //chiama done(), funzione di passport che gestisce success/error o fail
  } catch (err) {
    done(err); // Handle errors during deserialization
  }
});

// middleware per mantenere l'autenticazione dell'utente
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // User is authenticated
  }
  res.redirect("/login"); // Redirect if not authenticated
};

// Routes for login and registration
app.get("/login", (req, res) => {
  res.render("login", { username: req.user ? req.user.username : null });
});


app.post( //https://betaweb.github.io/flashjs/ ma non implementato nella versione corrente
  "/login",
  passport.authenticate("local", {
    successRedirect: "/", // Redirect after successful login
    failureRedirect: "/login", // Redirect after failed login
    failureFlash: true, // Enable flash messages
  })
);

app.get("/register", (req, res) => {
  res.render("register", { username: req.user ? req.user.username : null });
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword, // Store the hashed password
    });

    await newUser.save();

    req.login(newUser, (err) => {
      if (err) {
        return res.status(500).send("Error during login after registration.");
      }

      res.redirect("/"); // Redirect after successful registration
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send("Registration failed."); // Handle registration errors
  }
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).send("Error during logout.");
    }

    res.redirect(302, "/login"); // Use a valid status code and clear redirect
  });
});

// Main routes
app.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      console.error("User not found");
      return res.status(404).send("User not found"); // If user is not found
    }

    const posts = await Blog.find({ author: user.username });

    res.render("home", {
      content: "Welcome to your blog!", // Example content
      posts: posts.map((post) => ({
        ...post.toObject(), // Convert Mongoose document to plain object
        truncatedContent: stripHtmlTags(post.content).substring(0, 100) + "...", // Truncated content
      })),
      username: user.username, // Pass username to the template
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send("Error fetching posts."); // Handle errors
  }
});

app.get("/compose", ensureAuthenticated, (req, res) => {
  res.render("compose");
});

app.post("/compose", ensureAuthenticated, async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).send("User not found");
  }

  const postContentHtml = markdown.toHTML(req.body.post); // Convert Markdown to HTML

// Clean and sanitize tags
const tags = (req.body.tags && typeof req.body.tags === 'string')
  ? JSON.parse(req.body.tags)  // Only parse if it's a valid JSON string
  : Array.isArray(req.body.tags) 
    ? req.body.tags            // If it's already an array
    : [];                      // Fallback to an empty array

const sanitizedTags = tags.map(tag => tag.trim().replace(/[^a-zA-Z0-9-_ ]/g, "")); // Strip special characters and spaces at ends


const newBlog = new Blog({
  heading: req.body.title,
  content: postContentHtml,
  author: user.username,
  place: req.body.place,
  tags: sanitizedTags, // Use the sanitized tags array
});

  try {
    await newBlog.save(); // Save to the database
    res.redirect("/"); // Redirect after successful save
  } catch (error) {
    console.error("Error saving post:", error); // Handle error
    res.status(500).send("Error saving post."); // Respond with a server error
  }
});

app.get("/users/:username/posts/:postTitle", async (req, res) => {
  try {
    const username = req.params.username;
    const postTitle = decodeURIComponent(req.params.postTitle);
    const user = await User.findOne({ username });

    if (!user) {
      console.error("User not found");
      return res.status(404).send("User not found");
    }

    const post = await Blog.findOne({
      heading: new RegExp("^" + _.escapeRegExp(postTitle) + "$", "i"),
      author: username,
    });

    if (!post) {
      return res.status(404).send("Post not found");
    }

    res.render("posts", {
      id: post._id,
      title: post.heading,
      post: post.content,
      author: post.author,
      date: post.date,
      place: post.place,
      tags: post.tags,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).send("Error fetching post.");
  }
});


app.post("/users/:username/posts/delete/:id", ensureAuthenticated, async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Blog.findById(postId);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    if (post.author !== req.user.username) {
      return res.status(403).send("You don't have permission to delete this post.");
    }

    await Blog.findByIdAndDelete(postId);

    res.redirect("/"); // Redirect after successful deletion
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).send("Error deleting post.");
  }
});

app.get('/search', async (req, res) => {
  const queryText = req.query.query.trim();

  if (queryText.length < 3) {
    return res.status(400).send("Query text must be at least 3 characters long.");
  }

  try {
    // Use `$or` to search for posts with matching titles or tags
    const matchingPosts = await Blog.find({
      $or: [
        { heading: { $regex: queryText, $options: 'i' } }, // Case-insensitive search by title
        { tags: { $in: [new RegExp(queryText, 'i')] } } // Search tags array for a matching tag
      ]
    });

    res.json(matchingPosts); // Return the matching posts as JSON
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).send("Error fetching search results.");
  }
});



// Listen on default port 3000
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
