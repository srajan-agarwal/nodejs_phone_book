import request from 'supertest'
import MockAdapter from 'axios-mock-adapter'
import httpMocks from 'node-mocks-http'
import chai from 'chai'

import server from '../../src/server'
import axiosRequest from '../../src/utils/config/Axios'
import ProxyRequestRouter from '../../src/classes/ProxyRequestRouter'

const { expect } = chai

describe('Test proxy middleware unauthorized request', () => {
  it('Test unauthorized request without cookie', function (done) {
    request(server).get('/alps/app?url=https://www.amazon.in').expect(401, done)
  })
  it('Test unauthorized request with wrong session key', function (done) {
    request(server)
      .get('/alps/app?url=https://www.amazon.in')
      .set('Cookie', '__iQ_ALPS_SESSION=test;tenant=demo;')
      .expect(401, done)
  })
})

describe('Test proxy middleware authorized request', () => {
  const authUrl = `${process.env.AUTH_URL || ''}/alps/manage/demo/session-validator`
  let stub: MockAdapter
  before(() => {
    stub = new MockAdapter(axiosRequest)
    stub.onGet(authUrl).replyOnce(200, { valid: true })
  })
  it('Test authorized request', function (done) {
    const testUrl = 'https://www.amazon.in'
    request(server)
      .get(`/alps/app?url=${testUrl}&tenant=demo`)
      .set('Cookie', '__iQ_ALPS_SESSION=test;')
      .then((res) => {
        expect(res.status).equal(200)
        expect(res.headers['content-security-policy']).equal('frame-ancestors *')
        expect(res.headers['access-control-allow-origin']).equal('*')
        expect(res.headers['set-cookie'][0]).equal(
          `__ALPS_PROXY_REMOTE_DOMAIN=${testUrl}; path=/; SameSite=None; secure`,
        )
        expect(res.headers['x-frame-options']).to.be.undefined
        expect(res.text).to.includes(
          `<script type="text/javascript" src="${process.env.SCRIPT_URL || ''}`,
        )
        done()
      })
  })
  it('Test authorized request from node cache', function (done) {
    request(server)
      .get('/alps/app?url=https://www.amazon.in&tenant=demo')
      .set('Cookie', '__iQ_ALPS_SESSION=test;')
      .expect(200, done)
  })

  describe('Test proxy middleware functions', () => {
    it('Test request without url parameter', function (done) {
      request(server).get('/alps/app').set('Cookie', '__iQ_ALPS_SESSION=test;').expect(500, done)
    })
    it('Test request with domainname cookie', function (done) {
      request(server)
        .get('/')
        .set('Cookie', [
          '__iQ_ALPS_SESSION=test;tenant=demo;__ALPS_PROXY_REMOTE_DOMAIN=https://www.amazon.in;',
        ])
        .expect(200, done)
    })
  })

  describe('Test get domain from query and cookies', () => {
    const testUrl = 'https://www.amazon.in'
    it('Test get domain from cookies', function () {
      const req = httpMocks.createRequest({ query: { url: testUrl, tenant: 'demo' } })
      const url = ProxyRequestRouter.getProxyUrl(req)
      expect(url).to.be.equal(testUrl)
    })
    it('Test request with domainname cookie', function () {
      const req = httpMocks.createRequest({ cookies: { __ALPS_PROXY_REMOTE_DOMAIN: testUrl } })
      const url = ProxyRequestRouter.getProxyUrl(req)
      expect(url).to.be.equal(testUrl)
    })
  })
})
