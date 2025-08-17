exports.allowDraftOnly = (req, res, next) => {
  const s = req.claim?.status || req.body?.status;
  if (s !== 'Draft') return res.status(400).json({ message: 'Only Draft claims can be submitted' });
  next();
};
