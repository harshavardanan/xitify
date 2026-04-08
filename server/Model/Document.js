const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  docId: { type: String, required: true, unique: true },
  content: { type: Object, required: true }, // TipTap JSON
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Document", DocumentSchema);
