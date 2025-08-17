const express = require('express');
const router = express.Router();
const { createClaimRules, idParamRule } = require('../validators/claim.validator');
const validate = require('../middleware/validate');
const { ownsClaim } = require('../middleware/ownership');
const Claim = require('../models/Claim');
const ctrl = require('../controllers/claimController');
const requireAuth = require('../middleware/authMiddleware');
const { allowDraftOnly } = require('../middlewares/statusGuard');
const { requireAtLeastOneDocument } = require('../middlewares/attachments');

router.use(requireAuth);

// Create
router.post('/', createClaimRules, validate, ctrl.createClaim);

// List mine
router.get('/', ctrl.listMyClaims);

// DETAIL (ownership enforced)
router.get('/:id', idParamRule, validate, ownsClaim(Claim), ctrl.getMyClaim);

// Submit a Draft claim for review
router.post(
  '/:id/submit',
  idParamRule,
  validate,
  ownsClaim(Claim),
  allowDraftOnly,
  requireAtLeastOneDocument,
  ctrl.submitClaim
);

module.exports = router;
