const service = require("./theaters.service");
const asyncErrorBoundary = require("../error/asyncErrorBoundary");

async function list (req,res,next) {
    const movieId = Number(req.params.movieId);
    const data = movieId ? await service.listShowings(movieId) : await service.list();
    res.json({data})
};

module.exports = {
    list:asyncErrorBoundary(list),
};