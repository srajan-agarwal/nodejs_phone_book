import chai from 'chai'
import MockAdapter from 'axios-mock-adapter'
import RequestHelper from '../../src/utils/helper/RequestHelper'
import request from '../../src/utils/config/Axios'
import { AxiosError, AxiosResponse } from 'axios'
const expect = chai.expect

describe('Test auth service', () => {
  let stub: MockAdapter
  const authUrl = `${process.env.AUTH_URL || ''}/alps/manage/demo/session-validator`
  before(() => {
    stub = new MockAdapter(request)
    stub
      .onGet(authUrl, {
        headers: {
          Cookie: `__iQ_ALPS_SESSION=test`,
        },
      })
      .replyOnce(200)
  })
  it('Test authorised request', async function () {
    const response = (await RequestHelper.doGet(authUrl, 'test')) as AxiosResponse
    expect(response.status).to.be.equal(200)
  })
})

describe('Test network error', () => {
  let stub: MockAdapter
  const authUrl = `${process.env.AUTH_URL || ''}/alps/manage/demo/session-validator`
  before(() => {
    stub = new MockAdapter(request)
    stub
      .onGet(authUrl, {
        headers: {
          Cookie: `__iQ_ALPS_SESSION=test`,
        },
      })
      .networkError()
  })
  it('Test auth service network error', async function () {
    const response = (await RequestHelper.doGet(authUrl, 'test')) as AxiosError
    expect(response.message).to.be.equal('Network Error')
  })
})
