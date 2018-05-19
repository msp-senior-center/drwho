const util = require('util');
const fs = require('fs');
const pug = require('pug');

const asyncReadFile = util.promisify(fs.readFile);

async function renderTemplate(path, data) {
    const fileContent = await asyncReadFile(path);
    const tmpl = pug.compile(fileContent);
    return tmpl(data);
}

module.exports = async function (context, req) {
    context.res = {
        headers: {
            'Content-Type': 'text/html'
        },
        body: await renderTemplate(
            __dirname + '/' + 'page.html',
            { staticFileStorage: process.env.STATIC_FILE_STORAGE }
        ),
        isRaw: true
    };
};