const { body, param } = require('express-validator');

const POLICY_RE = /^[A-Za-z0-9-]{6,20}$/;
const TYPES = ['Motor','Home','Health','Other'];

exports.idParamRule = [ param('id').isMongoId().withMessage('invalid id') ];

exports.createClaimRules = [
  body('policyNumber').trim().notEmpty().withMessage('required')
    .matches(POLICY_RE).withMessage('6–20 letters/digits/-'),
  body('incidentDate').isISO8601().withMessage('invalid date')
    .custom(d => new Date(d) <= new Date()).withMessage('no future dates'),
  body('claimType').isIn(TYPES).withMessage(`one of ${TYPES.join(', ')}`),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('10–1000 chars'),
];

exports.updateClaimRules = [
  body('policyNumber').optional().matches(/^[A-Za-z0-9-]{6,20}$/).withMessage('6–20 letters/digits/-'),
  body('incidentDate').optional()
    .isISO8601().withMessage('invalid date')
    .custom(d => new Date(d) <= new Date()).withMessage('no future dates'),
  body('claimType').optional().isIn(['Motor','Home','Health','Other']).withMessage('invalid type'),
  body('description').optional().isLength({ min: 10, max: 1000 }).withMessage('10–1000 chars'),
];
