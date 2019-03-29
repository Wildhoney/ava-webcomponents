import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import pkgUp from 'pkg-up';
import { parse } from '@babel/parser';
import generate from '@babel/generator';
import * as utils from './utils.js';

const withComponent = (file, options = {}) => {
    return async (t, run) => {
        t.true(fs.existsSync(file));

        const browser = await puppeteer.launch(options);
        const page = await browser.newPage();
        await page.setBypassCSP(true);

        const root = path.dirname(await pkgUp());
        const nodeModules = path.resolve(root, 'node_modules');
        const url = await utils.initServer(root, page);

        const content = fs.readFileSync(file, 'utf-8');
        const ast = parse(content, { sourceType: 'module' });
        const nodes = ast.program.body.filter(utils.isImport);

        await Promise.all(
            nodes.map(async node => {
                const isModule = !node.source.value.startsWith('.');
                const isRelative = !isModule;
                const resolvedPath = isModule ? path.join(nodeModules, node.source.value) : node.source.value;
                const isModuleDirectory = isModule && fs.statSync(resolvedPath).isDirectory();

                const location = await (async () => {
                    if (isModuleDirectory) return utils.findIndexFile(resolvedPath);
                    if (isModule) return resolvedPath;
                    if (isRelative) return path.join(path.dirname(file), resolvedPath);
                    return null;
                })();

                // Update the location in the AST only if we have it available.
                location && (node.source.value = `${new URL(`./${path.relative(root, location)}`, url)}`);
            })
        );

        await page.addScriptTag({
            type: 'module',
            content: generate(ast).code
        });

        const waitForUpgrade = name => page.waitForFunction(`Boolean(customElements.get('${name}'))`);

        try {
            await run(t, { page, utils: { waitForUpgrade } });
        } finally {
            await page.close();
            await browser.close();
        }
    };
};

withComponent.debug = (file, options) =>
    withComponent(file, {
        ...options,
        headless: false,
        slowMo: 250,
        devtools: true
    });

export default withComponent;
