import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const job_schema = new Schema({
  title: { type: String },
  link: { type: String },
  employer: { type: String },
  location: { type: String },
  date: { type: String },
  emails: [{ type: String }],
  schedule: [{ type: String }],
  category: [{ type: String }],

}, { timestamps: true })


// Create the model from the schema
const Job = mongoose.model('Job', job_schema);

export default Job