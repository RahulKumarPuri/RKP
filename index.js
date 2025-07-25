const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ✅ Models
const User = require("./models/User");
const Transaction = require("./models/Transaction");

// ✅ Auth Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).send("Token missing");

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send("Invalid token");
    req.user = decoded;
    next();
  });
};

// ✅ Register User
app.post("/register", async (req, res) => {
  const { name, mobile, password, email } = req.body;
  try {
    const user = new User({ name, mobile, password, email });
    await user.save();
    res.send({ message: "User Registered" });
  } catch (err) {
    res.status(500).send("Registration failed");
  }
});

// ✅ Login User
app.post("/login", async (req, res) => {
  const { mobile, password } = req.body;
  const user = await User.findOne({ mobile, password });
  if (!user) return res.status(401).send("Invalid credentials");

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET
  );
  res.send({ token });
});

// ✅ Buy Stock
app.post("/buy", verifyToken, async (req, res) => {
  const { stock, amount, txnId } = req.body;
  try {
    await Transaction.create({
      user: req.user.email,
      stock,
      amount,
      txnId,
      status: "pending"
    });
    res.send({ message: "Purchase request saved" });
  } catch (err) {
    res.status(500).send("Failed to save transaction");
  }
});

// ✅ Admin Panel – View All TXNs
app.get("/admin/transactions", verifyToken, async (req, res) => {
  if (req.user.email !== "cryptonicarea@gmail.com")
    return res.status(403).send("Access Denied");

  const data = await Transaction.find();
  res.send(data);
});

// ✅ Admin – Mark TXN as Paid
app.post("/admin/mark-paid", verifyToken, async (req, res) => {
  if (req.user.email !== "cryptonicarea@gmail.com")
    return res.status(403).send("Access Denied");

  const { txnId } = req.body;

  const txn = await Transaction.findOne({ txnId });
  if (!txn) return res.status(404).send("Transaction not found");

  txn.status = "paid";
  await txn.save();

  res.send({ message: "Transaction marked as paid" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
