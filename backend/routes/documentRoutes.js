const express = require('express');
const router = express.Router();

const requireAuth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { idParamRule } = require('../validators/claim.validators');
const { upload, handleUploadError } = require('../libs/upload');
const { ownsClaim, ownsDocument } = require('../middlewares/ownership');
const Claim = require('../models/Claim');
const ctrl = require('../controllers/document.controller');

router.use(requireAuth);

// Upload to claim
router.post('/claims/:id/documents',
  idParamRule, validate, ownsClaim(Claim),
  upload, handleUploadError,
  ctrl.uploadDocument
);

// List claim docs
router.get('/claims/:id/documents',
  idParamRule, validate, ownsClaim(Claim),
  ctrl.listDocuments
);

// Delete a doc
router.delete('/documents/:docId',
  ownsDocument(), // checks ownership
  ctrl.deleteDocument
);
// Preview (inline)
router.get('/documents/:docId/preview', ownsDocument(), ctrl.previewDocument);

// Download (attachment)
router.get('/documents/:docId/download', ownsDocument(), ctrl.downloadDocument);


module.exports = router;
