const Car = require('../../models/car');
const User = require('../../models/user'); // Ensure you have a User model if you're referencing users
const Query = require('../../models/query');

// POST endpoint to handle form submission and insert query
const postQuery = async (req, res) => {
  const { name, email, message, contactInfo, category, carId, userId } = req.body;

  // Validate form input
  if (!name || !email || !message || !carId) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Step 1: Find the car owner by carId
    const car = await Car.findById(carId).populate('owner');
    if (!car) {
      return res.status(404).json({ error: 'Car not found.' });
    }

    // Optionally, check if userId is valid if provided
    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
    }

    // Step 2: Create a new query document
    const newQuery = new Query({
      carId,
      userId, // optional
      question: message,
      contactInfo, // optional
      category, // optional
      status: 'pending'
    });

    // Save the query to the database
    const savedQuery = await newQuery.save();

    // Optionally, send an email to the car owner (you can integrate an email service here)

    // Step 3: Respond with success
    res.status(201).json({
      message: 'Query submitted successfully',
      query: savedQuery
    });

  } catch (error) {
    console.error('Error while posting query:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  postQuery
};
