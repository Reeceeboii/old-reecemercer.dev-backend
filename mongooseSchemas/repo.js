const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const repoSchema = new Schema({
    _id: Schema.ObjectId, name: String, desc: String, link: String, starCount: Number,
    language: String, forks: Number
});

module.exports = mongoose.model('Repo', repoSchema);
