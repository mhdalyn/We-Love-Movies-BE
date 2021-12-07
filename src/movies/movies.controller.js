const service = require("./movies.service");
const asyncErrorBoundary = require("../error/asyncErrorBoundary");

async function movieExists(req, res, next) {
    const { movieId } = req.params;
    const foundMovie = await service.read(movieId);
    if (foundMovie) {
        res.locals.movie = foundMovie;
        return next();
    };
    next({
        status: 404,
        message: `Movie cannot be found.`
    });
};

function read(req,res,next) {
    res.json({data: res.locals.movie});
};

async function list(req, res, next) {
    const is_showing = req.query.is_showing;
    let data = (is_showing == "true") ? await service.listShowing() : await service.list(); 
    res.json({ data });
};

module.exports = {
    movieExists,
    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(movieExists),read]
};