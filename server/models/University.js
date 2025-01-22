const mongoose = require('mongoose');

const UniversitySchema = new mongoose.Schema({
    moto: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    logo: { type: String, required: true },
    about: { type: String, required: true },
    cover: { type: String, required: true },
    contact: {
        number: { type: [String], required: true },
        email: { type: [String], required: true },
        website: { type: String, required: true }
    },
    feeStructure: []
}, { timestamps: true }); 

const University = mongoose.model('University', UniversitySchema);

module.exports = University;
