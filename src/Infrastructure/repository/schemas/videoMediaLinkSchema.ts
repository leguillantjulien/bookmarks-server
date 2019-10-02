var mongoose = require('mongoose');
var Schema = mongoose.Schema;

export const videoMediaLinkSchema = new Schema({
  id: { type: String, required: false, index: { unique: true } },
  url: { type: String, required: true },
  title: { type: String, required: true },
  author_name: { type: String, required: true },
  added_date: { type: Date, required: true },
  tags: [String],
  type: { type: String, required: true },
  height: { type: Number, required: true },
  width: { type: Number, required: true },
  duration: { type: Number, required: true }
}, { versionKey: false });
