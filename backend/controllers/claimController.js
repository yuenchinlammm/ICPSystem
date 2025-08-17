const Claim = require('../models/Claim');

exports.createClaim = async (req, res, next) => {
  try {
    const doc = await Claim.create({
      userId: req.user.id,                 // comes from auth middleware
      policyNumber: req.body.policyNumber,
      incidentDate: req.body.incidentDate,
      claimType: req.body.claimType,
      description: req.body.description,
      status: 'Draft'
    });
    return res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

exports.listMyClaims = async (req, res, next) => {
  try {
    const rows = await Claim.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json(rows);
  } catch (e) { next(e); }
};