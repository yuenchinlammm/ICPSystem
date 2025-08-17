const Document = require('../models/Document');

exports.requireAtLeastOneDocument = async (req, res, next) => {
  try {
    const claimId = req.params.id;
    const count = await Document.countDocuments({ claimId });
    if (count < 1) return res.status(400).json({ message: 'Please attach at least one document before submission' });
    next();
  } catch (e) {
    next(e);
  }
};
