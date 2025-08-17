const express = require('express');
const router = express.Router();
const { createClaimRules, idParamRule } = require('../validators/claim.validator');
const validate = require('../middleware/validate');
const { ownsClaim } = require('../middleware/ownership');
const Claim = require('../models/Claim');
const ctrl = require('../controllers/claimController');
const requireAuth = require('../middleware/authMiddleware');

router.use(requireAuth);

// Create
router.post('/', createClaimRules, validate, ctrl.createClaim);

// List mine
router.get('/', ctrl.listMyClaims);

module.exports = router;
