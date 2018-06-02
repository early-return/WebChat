const Nightmare = require('nightmare');

describe('演示', () => {

  it('开始演示', (done) => {

    const n1 = Nightmare({ show: true });
    const n2 = Nightmare({ show: true });

    n1.goto('http://localhost/login')
      .wait(1000)
      .type('input[type="email"]', 'i@zhiqing.info')
      .click('a.btn')
      .wait(1000)
      .type('input[type="password"]:nth-of-type(1)', '123456')
      .click('a.btn')
      .end()
      .then(() => { done() })
  }).timeout(10000000);

})