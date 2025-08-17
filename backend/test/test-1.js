const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../app'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const claim = require('../models/Claim');
const { createClaim,listMyClaim, getMyClaim, updateMyClaim ,deleteMyClaim } = require('../controllers/claimController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;

describe('createClaim Function Test', () => {

  it('should create a new claim successfully', async () => {
    // Mock request data
    const payload = {
    userId: req.user.id,
    policyNumber: req.body.policyNumber,
    incidentDate: req.body.incidentDate,
    claimType: req.body.claimType,
    description: req.body.description,
    status: 'Draft'
  };

    // Mock claim that would be created
    const createdClaim = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };

    // Stub Claim.create to return the createdClaim
    const createStub = sinon.stub(Claim, 'create').resolves(createdClaim);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await createClaim(req, res);

    // Assertions
    expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdClaim)).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });
  
  it('should return 500 if an error occurs', async () => {
    // Stub Task.create to throw an error
    const createStub = sinon.stub(Claim, 'create').throws(new Error('DB Error'));

    // Mock request data
     const payload = {
    userId: req.user.id,
    policyNumber: req.body.policyNumber,
    incidentDate: req.body.incidentDate,
    claimType: req.body.claimType,
    description: req.body.description,
    status: 'Draft'
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await createClaim(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

});

