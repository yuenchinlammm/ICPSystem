module.exports.ownsClaim = (ClaimModel) => async (req, res, next) => {
  try {
    const id = req.params.id;
    const doc = await ClaimModel.findById(id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    if (String(doc.userId) !== String(req.user.id))
      return res.status(403).json({ message: 'Forbidden' });
    req.claim = doc; // stash for controller
    next();
  } catch (e) { next(e); }
};
