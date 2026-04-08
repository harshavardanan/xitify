const mongoose = require("mongoose");
const { Schema } = mongoose;

const TagSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Tag name is required"],
      trim: true,
    },
    value: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { _id: false }
);

const XitItemSchema = new Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ["open", "checked", "ongoing", "obsolete", "inQuestion"],
      default: "open",
    },
    priority: {
      type: String,
      trim: true,
      default: null,
    },
    description: {
      type: String,
      required: [true, "Item description cannot be empty."],
      trim: true,
    },
    dueDate: {
      type: String,
      trim: true,
      default: null,
    },
    tags: {
      type: [TagSchema],
      default: [],
    },
  },
  { _id: false }
);

const GroupSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      default: null,
    },
    items: {
      type: [XitItemSchema],
      required: true,
    },
  },
  { _id: false }
);

const XitDocumentSchema = new Schema({
  documentTitle: {
    type: String,
    required: [true, "A document title is required."],
    trim: true,
    default: "Untitled Document",
  },
  groups: {
    type: [GroupSchema],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
});

XitDocumentSchema.pre("save", function (next) {
  this.lastModified = Date.now();
  next();
});

const XitDocument = mongoose.model("XitDocument", XitDocumentSchema);
module.exports = XitDocument;
