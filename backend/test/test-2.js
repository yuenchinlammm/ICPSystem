const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../app'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Claim = require('../models/Claim');
const { createClaim,listMyClaim, getMyClaim, updateMyClaim ,deleteMyClaim } = require('../controllers/claimController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;

describe('DeleteClaim Function Test', () => {

  it('should delete a claim successfully', async () => {
    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock claim found in the database
    const claim = { remove: sinon.stub().resolves() };

    // Stub Claim.findById to return the mock task
    const findByIdStub = sinon.stub(Claim, 'findById').resolves(claim);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteClaim(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(task.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Claim deleted' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if task is not found', async () => {
    // Stub Claim.findById to return null
    const findByIdStub = sinon.stub(Claim, 'findById').resolves(null);

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteClaim(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Claim not found' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Claim.findById to throw an error
    const findByIdStub = sinon.stub(Claim, 'findById').throws(new Error('DB Error'));

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteClaim(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

});
