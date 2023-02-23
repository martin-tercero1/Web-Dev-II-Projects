const supertest = require('supertest');
const cheerio = require('cheerio');
const app = require('../lib/app');

describe('List Page', () => {

  it('should have a To-Do List page', () => {
    return supertest(app)
      .get('/todo/list')
      .expect(200)
      .expect('Content-Type', /^text\/html/);
  });

  it('should initially report no To-Do items', () => {
    return supertest(app)
      .get('/todo/list')
      .then(res => {
        expect(res.text).toMatch(/No to-do items/i);
      });
  });

});

describe('Adding items', () => {

  it('should return a 303', () => {
    return supertest(app)
      .post('/todo/add')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({ item: 'Walk the dog' })
      .expect(303)
      .expect('Location', 'list');
  });

  it('should show items added in subsequent requests', async () => {
    const agent = supertest.agent(app);

    await agent
      .post('/todo/add')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({ item: 'Walk the dog'});

    let res = await agent.get('/todo/list');
    expect(res.text).toMatch(/Walk the dog/);

    await agent
      .post('/todo/add')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({ item: 'Wash the dishes' });

    res = await agent.get('/todo/list');
    expect (res.text).toMatch(/Walk the dog[^]*Wash the dishes/);
  });

  it('should initially report items as incomplete', async () => {
    const agent = supertest.agent(app);

    await agent
      .post('/todo/add')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({ item: 'Walk the dog'});
    await agent
      .post('/todo/add')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({ item: 'Wash the dishes' });

    const res = await agent.get('/todo/list');

    const $ = cheerio.load(res.text);

    for (let i = 0; i < 2; ++i) {
      let cb = $(`input[name="item-${i}"]`);
      expect(cb).not.toBeUndefined();
      expect(cb.attr('type')).toBe('checkbox');
      expect(cb.prop('checked')).toBe(false);
    }
  });

});
