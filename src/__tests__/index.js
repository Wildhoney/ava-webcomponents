import test from 'ava';
import withComponent from '../index.js';

test(
    'It should be able to test custom elements using Puppeteer;',
    withComponent(`${__dirname}/helpers/mock.js`),
    async (t, { page, utils }) => {
        await utils.waitForUpgrade('x-name');

        await utils.attachElement('x-name', { name: 'Adam' });
        t.is(await utils.innerHTML('x-name'), 'Hello Adam!');
        t.is(await utils.outerHTML('x-name'), '<x-name name="Adam">Hello Adam!</x-name>');

        await page.evaluate(() => {
            const node = document.querySelector('x-name');
            node.setAttribute('name', 'Maria');
        });
        t.is(await utils.innerHTML('x-name'), 'Hello Maria!');
        t.is(await utils.outerHTML('x-name'), '<x-name name="Maria">Hello Maria!</x-name>');
    }
);
