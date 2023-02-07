// To test an HTTP server
const request = require('supertest');

const { describe, it, expect } = require('@jest/globals');

const app = require('./app');

describe('The /hello endpoint', () => {
    it('Should respond with a 200', () => 
        request(app)
          .get('/hello')
          .expect(200)
    )

    it('Should respond with html text', () =>
      request(app)
        .get('/hello')
        .expect('Content-Type', /^text\/plain/));

    it('Should include Hello, world! as part of the response', () => 
      request(app)
        .get('/hello')
        .expect((res) => {
          expect(res.text.includes('Hello, world!')).toBe(true);
        })
    );
});

describe('Any other endpoint', () => {
        it('Should respond with a 404', () => 
            request(app)
              .get('/whatever')
              .expect(404)
        )

        it('Should respond with plain text', () => 
            request(app)
              .get('/whatever')
              .expect('Content-Type', /^text\/plain/)
        )

        it('Should include Not Found as part of the response', () => 
            request(app)
              .get('/whatever')
              .expect(res => {
                expect(res.text.includes('Not found')).toBe(true);
              })
        )
});