import express from "express";
import cors from "cors";
import { collectionName, connection } from "./dbConfig.js";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { connection } from "./dbConfig.js";

dotenv.config();

const app = express();

const allowedOrigins = ["https://merntodoreact.vercel.app"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// (optional but recommended) handle preflight for all routes
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

app.use(cookieParser());

async function testMongo() {
  try {
    const db = await connection();
    await db.command({ ping: 1 });
    console.log("✅ MongoDB connection OK from Render");
  } catch (err) {
    console.error("❌ MongoDB test connection failed:", err);
  }
}

// Call once when server starts
testMongo();

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.send({ message: "Missing fields", success: false });
  }
  const db = await connection();
  const collection = await db.collection("users");

  const user = await collection.findOne({ email });
  if (!user) {
    return res.send({ message: "User not found", success: false });
  }

  // Compare stored encrypted password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.send({ message: "Invalid password", success: false });
  }

  jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "5d" }, (error, token) => {
     if (error) {
      return res.send({ message: "Error creating token", success: false });
    }

    res.send({
      message: "Login successful",
      success: true,
      token: token,
    });
  });
});

app.post("/signup", async (req, res) => {
  const userData = req.body;
  if (!userData.email || !userData.password) {
    return res.send({ message: "Fields missing", success: false });
  }

  const db = await connection();
  const collection = await db.collection("users");

  // Check if already registered
  const exist = await collection.findOne({ email: userData.email });
  if (exist) {
    return res.send({ message: "User already exists", success: false });
  }

  // Encrypt password
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const result = await collection.insertOne({
    ...userData,
    password: hashedPassword,
  });
  //const result = await collection.insertOne(userData);

  if (result) {
    jwt.sign(
      { email: userData.email },
      process.env.JWT_SECRET,
      { expiresIn: "5d" },
      (error, token) => {
         if (error) {
          return res.send({ message: "Error creating token", success: false });
        }

        res.send({
          message: "SignUp successful",
          success: true,
          token: token,
        });
      }
    );
  }
});

app.post("/add-task", verifyJWTToken, async (req, res) => {
  const { title, description } = req.body;

  // Basic validation
  if (!title || typeof title !== "string" || title.trim().length < 3) {
    return res.status(400).send({
      success: false,
      message: "Title is required and must be at least 3 characters long.",
    });
  }

  if (!description || typeof description !== "string" || description.trim().length < 5) {
    return res.status(400).send({
      success: false,
      message: "Description is required and must be at least 5 characters long.",
    });
  }

  const db = await connection();
  const collection = await db.collection(collectionName);
  const result = await collection.insertOne({
    title,
    description,
    userEmail: req.user.email, // optional: link with logged-in user
    createdAt: new Date(),
  });

  if (result) {
    res.send({
      message: "Task added successfully",
      success: true,
      result,
    });
  } else {
    res.send({
      message: "task not added",
      success: false,
    });
  }
});

app.get("/tasks", verifyJWTToken, async (req, res) => {
  const db = await connection();
  const collection = await db.collection(collectionName);
  const result = await collection.find().toArray();
  if (result) {
    res.send({
      message: "task list fetched",
      success: true,
      result: result,
    });
  } else {
    res.send({
      message: "Error try after some times.",
      success: false,
    });
  }
});

app.get("/task/:id", verifyJWTToken, async (req, res) => {
  const db = await connection();
  const collection = await db.collection(collectionName);
  const id = req.params.id;
  const result = await collection.findOne({ _id: new ObjectId(id) });
  if (result) {
    res.send({
      message: "task fetched",
      success: true,
      result: result,
    });
  } else {
    res.send({
      message: "Error try after some times.",
      success: false,
    });
  }
});

app.put("/update-task", verifyJWTToken, async (req, res) => {
  const db = await connection();
  const collection = await db.collection(collectionName);
  const { _id, ...fields } = req.body;
  const update = { $set: fields };
  const result = await collection.updateOne({ _id: new ObjectId(_id) }, update);
  if (result) {
    res.send({
      message: "task updated",
      success: true,
      result: result,
    });
  } else {
    res.send({
      message: "Error try after some times.",
      success: false,
    });
  }
});

app.delete("/delete/:id", verifyJWTToken, async (req, res) => {
  const db = await connection();
  const id = req.params.id;
  const collection = await db.collection(collectionName);
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  if (result) {
    res.send({
      message: "task deleted",
      success: true,
      result: result,
    });
  } else {
    res.send({
      message: "Error try after some times.",
      success: false,
    });
  }
});

app.delete("/delete-multiple/", verifyJWTToken, async (req, res) => {
  const db = await connection();
  const ids = req.body;
  const deletetaskIds = ids.map((item) => new ObjectId(item));
  const collection = await db.collection(collectionName);
  const result = await collection.deleteMany({ _id: { $in: deletetaskIds } });
  if (result) {
    res.send({
      message: "task deleted",
      success: true,
      result: result,
    });
  } else {
    res.send({
      message: "Error try after some times.",
      success: false,
    });
  }
});

function verifyJWTToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send({
      message: "No token provided",
      success: false,
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).send({
        message: "Invalid token",
        success: false,
      });
    }

    req.user = decoded;
    next();
  });
}

const PORT = process.env.PORT || 3200;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
