# ava-webcomponents

> Utility middleware for testing web components in AVA via Puppeteer.

![Travis](http://img.shields.io/travis/Wildhoney/ava-webcomponents.svg?style=for-the-badge)
&nbsp;
![npm](http://img.shields.io/npm/v/ava-webcomponents.svg?style=for-the-badge)
&nbsp;
![License MIT](http://img.shields.io/badge/license-mit-lightgrey.svg?style=for-the-badge)
&nbsp;
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=for-the-badge)](https://github.com/prettier/prettier)

**npm**: `npm install ava-webcomponents`
<br />
**yarn**: `yarn add ava-webcomponents`

## Getting Started

Create a file that renders content to the screen &ndash; such as a web component:

```javascript
class Hello extends HTMLElement {
    connectedCallback() {
        this.innerHTML = 'Hello AVA!';
    }
}

customElements.define('x-ava', Hello);
```

We then use `ava-webcomponents` to import the file in your AVA test, which then gives you access to the Puppeteer `page` variable, as well as a util function for awaiting upgrade of a defined web component. All imports in your web components file will be resolved relative to the nearest `package.json` file, which uses a simple Express server instance to import your files.

```javascript
import test from 'ava';
import withComponent from 'ava-webcomponents';

test(
    'It should render "Hello AVA!";',
    withComponent(`${__dirname}/helpers/example.js`),
    async (t, { page, utils }) => {
        await utils.waitForUpgrade('x-ava');

        const content = await page.evaluate(() => {
            const node = document.createElement('x-ava');
            document.body.append(node);
            return node.innerHTML;
        });

        t.is(content, 'Hello AVA!');
    }
);
```
