const { Schema, model } = require('mongoose');

const publisherSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    dateFounded: { type: String },
    parantCompany: { type: String },
    countryOfOrigin: { type: String },
  },
  { timestamps: true }
);

const Publisher = model('Publisher', publisherSchema);

module.exports = Publisher;
