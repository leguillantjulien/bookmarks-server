var mongoose = require('mongoose');
var Schema = mongoose.Schema;

export const mediaLinkSchema = new Schema({
  id: { type: String, required: false, index: { unique: true } },
  url: { type: String, required: true },
  title: { type: String, required: true },
  author_name: { type: String, required: true },
  added_date: { type: Date, required: true },
  tags: [String],
  type: { type: String, required: true }
}, { versionKey: false });
