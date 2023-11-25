const createError = require('http-errors');

function notFoundHandler(req, res, next) {
	next(createError(404, 'Your requested content is not available'));
}

function errorHandler(err, req, res, next) {
	res.locals.error =
		process.env.NODE_ENV === 'production' ? { message: err.message } : err;

	res.status(err.status || 500);

	if (!res.locals.html) {
		// html response
		res.locals = {
			status: err.status || 500,
			message: err.message,
		};

		res.render('error');
	} else {
		// json response
		res.json(res.locals.error);
	}
}

module.exports = {
	notFoundHandler,
	errorHandler,
};
