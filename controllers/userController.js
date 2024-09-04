// backend/controllers/userController.js
const User = require('../models/User');
const { uploadToWasabi } = require('../utils/wasabiupload');

exports.registerUser = async (req, res) => {
  try {
    console.log('Received registration request. Body:', req.body);
    console.log('File received:', req.files); // Note: req.files, not req.file

    const { name, email, mobile, occupation } = req.body;

    if (!req.files || !req.files.document) {
      console.error('No document file received');
      return res.status(400).json({ message: 'No document uploaded' });
    }

    const document = req.files.document;
    console.log('Document details:', document);

    // Upload document to Wasabi
    let documentUrl;
    try {
      documentUrl = await uploadToWasabi(document);
    } catch (uploadError) {
      return res.status(500).json({ message: 'Error uploading document', error: uploadError.message });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      mobile,
      occupation,
      documentUrl
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

