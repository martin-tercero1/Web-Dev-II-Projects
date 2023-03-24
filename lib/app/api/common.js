function methodNotSupported(req, res) {
    res.status(405);
    res.set('Allow', 'HEAD, GET, POST');
    res.render('error_page', {
        message: `This url does not support ${req.method} requested`
    });
}

function notFound(req, res) {
    res.status(404);
    res.render('error_page', {
        message: "The requested URL could not be found"
    });
}

module.exports = { methodNotSupported, notFound };