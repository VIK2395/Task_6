const { Schema, model } = require('mongoose');

const comicsSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    logo: { type: String },
    publisher: { type: Schema.Types.ObjectId, ref: 'Publisher' },
    author: { type: String },
    characters: [{ type: Schema.Types.ObjectId, ref: 'Character' }],
    rating: { type: Number },
  },
  { timestamps: true }
);

const Comics = model('Comics', comicsSchema);

module.exports = Comics;
