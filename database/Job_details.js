import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const insert = new Schema({
  title: { type: String },
  link: { type: String },
  location: { type: String },
  date: { type: String },
})

const details = new Schema({
  title: { type: String },
  link: { type: String },
  location: { type: String },
  date: { type: String },
})


// Main document schema
const job_schema = new Schema({
  id: { type: Number },
  page: { type: Number },
  insert,
}, { timestamps: true });

// Create the model from the schema
const Job_detailed = mongoose.model('Job_detailed', job_schema);

export default Job