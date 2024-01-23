import mongoose from 'mongoose'
const Schema = mongoose.Schema;

// Store schema
const receiptSchema = new Schema({
  name: { type: String },
  address: { type: String },
  city: { type: String },
})

// Item schema
const itemSchema = new Schema({
  description: { type: String },
  price: { type: Number },
  weight_in_grams: { type: Number },
  milliliters: { type: Number },
  quantity: { type: Number }
})

// Total schema
const totalSchema = new Schema({
  amount: { type: Number },
  currency: { type: String }
})

// Main document schema
const receipt_schema = new Schema({
  store: receiptSchema,
  items: [itemSchema],
  total: totalSchema,
  date_time: { type: Date }
}, { timestamps: true });

// Create the model from the schema
const Receipt = mongoose.model('Receipt', receipt_schema);

export default Receipt