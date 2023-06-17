const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clanSchema = new Schema({
    price: String,
    name: String,
    level: Number,
    league: String,
    warlog: String,
    img: String,
    user: {type: Schema.Types.ObjectId, ref: 'User'} 
   });
 
   const Clan = mongoose.model('Clan', clanSchema);
 
   module.exports = Clan;