const { Schema, model } = require('mongoose');

const characterSchema = new Schema(
  {
    nickname: { type: String, required: true, unique: true },
    image: { type: String },
    description: { type: String },
    superpowers: [{ type: String }],
    role: { type: String },
  },
  { timestamps: true }
);

const Character = model('Character', characterSchema);

module.exports = Character;
