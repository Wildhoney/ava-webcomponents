import test from 'ava';
import withComponent from '../index.js';

test(
    'It should be able to test custom elements using Puppeteer;',
    withComponent(`${__dirname}/helpers/mock.js`),
    async (t, { page, utils }) => {
        await utils.waitForUpgrade('x-name');

        const content = await page.evaluate(async () => {
            const node = document.createElement('x-name');
            document.body.append(node);
            return node.innerHTML;
        });
        t.is(content, 'Hello Adam!');

        {
            const content = await page.evaluate(async () => {
                const node = document.querySelector('x-name');
                node.setAttribute('name', 'Maria');
                return node.innerHTML;
            });
            t.is(content, 'Hello Maria!');
        }
    }
);
