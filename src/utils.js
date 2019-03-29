import fs from 'fs';
import path from 'path';
import express from 'express';
import pkgUp from 'pkg-up';

export async function findIndexFile(cwd) {
    const pkg = await pkgUp({ cwd });
    const content = JSON.parse(fs.readFileSync(pkg, 'utf-8'));
    const file = content.module || content.esnext || content.main || null;
    return path.join(cwd, file);
}

export async function initServer(root, page) {
    const app = express();
    app.use(express.static(root));
    const url = await new Promise(resolve => {
        const listener = app.listen(async () => {
            const port = listener.address().port;
            const url = `http://0.0.0.0:${port}`;
            await page.goto(url);
            resolve(url);
        });
    });
    return url;
}

export function isImport({ type }) {
    return type === 'ImportDeclaration';
}
