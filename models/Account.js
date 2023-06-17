const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accountSchema = new Schema({
   description: String,
   price: String,
   townhall: Number,
   gems: Number,
   sceneries: [String],
   level: Number,
   builderhall: Number,
   skins: [String],
   max: Boolean,
   img: String,
   user: {type: Schema.Types.ObjectId, ref: 'User'}
    
  });

  const Account = mongoose.model("Account", accountSchema);

  module.exports = Account;