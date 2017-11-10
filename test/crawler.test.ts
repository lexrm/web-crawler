import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../src/App';

chai.use(chaiHttp);
const expect = chai.expect;

describe('GET api/v1/url', () => {

  it('responds with JSON array', () => {
    return chai.request(app).get('/api/v1/url')
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array');        
      });
  });

  it('should include success', () => {
    return chai.request(app).get('/api/v1/url')
      .then(res => {
        let success = res.body.find(links => links.message === 'Success');
        expect(success).to.exist;
        expect(success).to.have.all.keys([
          'message',
          'status',
          'allRelativeLinks'
        ]);
      });
  });
});
