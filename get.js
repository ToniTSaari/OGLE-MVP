const path = require('path')

exports.home = (res, req) =>
{
    res.sendfile(path.join(__dirname, './public/index.html'))
}