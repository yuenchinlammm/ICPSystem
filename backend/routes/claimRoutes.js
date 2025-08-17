const express = require('express');
const router = express.Router();
const { createClaimRules, idParamRule } = require('../validators/claim.validator');
const validate = require('../middleware/validate');
const { ownsClaim } = require('../middleware/ownership');
const Claim = require('../models/Claim');
const ctrl = require('../controllers/claimController');
const requireAuth = require('../middleware/authMiddleware');
const { allowDraftOnly } = require('../middleware/statusGuard');
const { requireAtLeastOneDocument } = require('../middleware/attachments');
const { updateClaimRules, idParamRule } = require('../validators/claim.validator');

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
// UPDATE Draft claim
router.put('/:id',
  idParamRule,
  updateClaimRules,
  validate,
  ownsClaim(Claim),
  allowDraftOnly,
  ctrl.updateMyClaim
);

// DELETE Draft claim
router.delete('/:id',
  idParamRule,
  validate,
  ownsClaim(Claim),
  allowDraftOnly,
  ctrl.deleteMyClaim
);

module.exports = router;
