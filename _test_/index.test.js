const request = require('supertest')
const app = require('../app')

let VERIFY_TOKEN = 'Arie_Sastra_Hadiprawira'

beforeAll(() => {})

describe('WEBHOOKS', () => {
  test('Webhook - Verified Testing', (done) => {
    request(app)
    .get('/webhook?hub.verify_token=Arie_Sastra_Hadiprawira&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe')
    .then(res => {
      const result = res.body
      expect(res.status).toBe(200)
      expect(result).toEqual(expect.any(Object, 'CHALLENGE_ACCEPTED'))

      done()
    })
    .catch(err => {
      done(err)
    })
  });

  test('Webhook - Unverified Testing', (done) => {
    request(app)
    .get('/webhook?hub.verify_token=Token_Salah&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe')
    .then(res => {
      const result = res.body
      expect(res.status).toBe(403)

      done()
    })
    .catch(err => {
      done(err)
    })
  });

  test('Webhook - Success Post', (done) => {
    request(app)
    .post('/webhook')
    .send({
      "object": "page",
      "entry": [
          {
              "messaging": [
                  {"message": "TEST_MESSAGE"}
              ]
          }
      ]
    })
    .then(res => {
      const result = res.body
      expect(res.status).toBe(200)
      expect(result).toEqual(expect.any(Object, 'EVENT_RECEIVED'))

      done()
    })
    .catch(err => {
      done(err)
    })
  });

  test('Webhook - Failed Post', (done) => {
    request(app)
    .post('/webhook')
    .send({
      "object": "",
      "entry": [
          {
              "messaging": [
                  {"message": "TEST_MESSAGE"}
              ]
          }
      ]
    })
    .then(res => {
      const result = res.body
      expect(res.status).toBe(404)

      done()
    })
    .catch(err => {
      done(err)
    })
  });
})

describe('MESSAGE ENDPOINT', () => {
  
})