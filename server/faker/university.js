const University = require('../models/University');

const universities = [
    {
        "id": 1,
        "moto": "Your journey towards success begins here",
        "name": "Capital University of Science and Technology",
        "image": "https://via.placeholder.com/150x200",
        "logo": "https://via.placeholder.com/100x100",
        "about": "The Capital University of Science & Technology (Urdu: جامعہ دارالحکومت سائنس و ٹیکنالوجی) is a private university located in Islamabad, Pakistan. Established in 1998 under the banner of Muhammad Ali Jinnah University Islamabad Campus, the university offers undergraduate and post-graduate programs with a strong emphasis on business management, applied sciences, engineering and computer science.",
        "cover": "https://via.placeholder.com/150x200",
        "contact": {
            "number": ["051-982389", "051-982382"],
            "email": ["info@cust.edu.pk"],
            "website": "https://www.cust.edu.pk"
        },
        "feeStructure": {
            "BBA": 1700,
            "BSCS": 1900,
            "BSSE": 2000,
        }
    },
    {
        "id": 2,
        "moto": "Your journey towards success begins here",
        "name": "Evergreen University",
        "image": "https://via.placeholder.com/150x200",
        "logo": "https://via.placeholder.com/100x100",
        "about": "Nestled amidst lush greenery, Evergreen University fosters a sustainable learning environment. Our focus is on environmental sciences, renewable energy, and social responsibility.",
        "cover": "https://via.placeholder.com/150x200",
        "contact": {
            "number": ["+1 234-567-8900"],
            "email": ["admissions@evergreen.edu"],
            "website": "https://www.evergreen.edu"
        },
        "feeStructure": {
            "BBA": 1700,
            "BSCS": 1900,
            "BSSE": 2000,
        }
    },
    {
        "id": 3,
        "moto": "Your journey towards success begins here",
        "name": "Horizon Institute of Arts and Technology",
        "image": "https://via.placeholder.com/150x200",
        "logo": "https://via.placeholder.com/100x100",
        "about": "Horizon Institute cultivates creativity and innovation. We offer programs in fine arts, design, music, engineering, and computer science, equipping students for the future.",
        "cover": "https://via.placeholder.com/150x200",
        "contact": {
            "number": ["+44 20 7946 0123"],
            "email": ["info@horizon.ac.uk"],
            "website": "https://www.horizon.ac.uk"
        },
        "feeStructure": {
            "BBA": 1700,
            "BSCS": 1900,
            "BSSE": 2000,
        }
    },
    {
        "id": 4,
        "moto": "Your journey towards success begins here",
        "name": "Institute for Global Learning",
        "image": "https://via.placeholder.com/150x200",
        "logo": "https://via.placeholder.com/100x100",
        "about": "The Institute for Global Learning prepares students for a globalized world. We offer international studies, languages, and intercultural communication programs.",
        "cover": "https://via.placeholder.com/150x200",
        "contact": {
            "number": ["+81 3-1234-5678"],
            "email": ["admissions@globallearning.jp"],
            "website": "https://www.globallearning.jp"
        },
        "feeStructure": {
            "BBA": 1700,
            "BSCS": 1900,
            "BSSE": 2000,
        }
    },
    {
        "id": 5,
        "moto": "Your journey towards success begins here",
        "name": "Maritime Academy",
        "image": "https://via.placeholder.com/150x200",
        "logo": "https://via.placeholder.com/100x100",
        "about": "Ahoy, mateys! The Maritime Academy sets sail for a career in the maritime industry. We offer programs in navigation, marine engineering, and oceanography.",
        "cover": "https://via.placeholder.com/150x200",
        "contact": {
            "number": ["+61 2 9876 5432"],
            "email": ["info@maritimeacademy.au"],
            "website": "https://www.maritimeacademy.au"
        },
        "feeStructure": {
            "BBA": 1700,
            "BSCS": 1900,
            "BSSE": 2000,
        }
    },
    {
        "id": 6,
        "moto": "Your journey towards success begins here",
        "name": "Peak Performance University",
        "image": "https://via.placeholder.com/150x200",
        "logo": "https://via.placeholder.com/100x100",
        "about": "Peak Performance University pushes you to reach your full potential. We offer programs in sports science, health & wellness, and performance psychology.",
        "cover": "https://via.placeholder.com/150x200",
        "contact": {
            "number": ["+49 89 1234 5678"],
            "email": ["admissions@ppu.de"],
            "website": "https://www.ppu.de"
        },
        "feeStructure": {
            "BBA": 1700,
            "BSCS": 1900,
            "BSSE": 2000,
        }
    }
]


 const populateUniversity = async () => {
    try {
        // Clear existing university data if needed (optional)
        await University.deleteMany({}); // This will remove all documents in the University collection

        // Insert each university from the universities array into the MongoDB collection
        const insertPromises = universities.map(university => {
            return new University({
                moto: university.moto,
                name: university.name,
                image: university.image,
                logo: university.logo,
                about: university.about,
                cover: university.cover,
                contact: university.contact,
                feeStructure: university.feeStructure
            }).save(); // Save each university document
        });

        // Wait for all the insertions to complete
        await Promise.all(insertPromises);

        console.log('Universities populated successfully.');
    } catch (error) {
        console.error('Error populating universities:', error);
    }
};

module.exports = {
    populateUniversity
}