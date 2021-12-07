const service = require("./reviews.service");
const asyncErrorBoundary = require("../error/asyncErrorBoundary");
const methodNotAllowed = require("../error/methodNotAllowed");

async function list (req,res,next) {
    const movieId = Number(req.params.movieId);
    let data = await service.list(movieId);
    res.json({data});
}

async function reviewExists(req, res, next) {
    const { reviewId } = req.params;
    const foundReview = await service.read(reviewId);
    if (foundReview) {
        res.locals.review = foundReview;
        return next();
    };
    next({
        status: 404,
        message: `Review cannot be found.`
    });
};

async function update (req,res,next) {
    const review = {...req.body.data, review_id:res.locals.review.review_id};
    await service.update(review);
    let updatedReview = await service.read(review.review_id);
    updatedReview = {...updatedReview, critic: await service.readCritic(updatedReview.critic_id)};
    res.json({ data: updatedReview });
};

async function deleteReview (req,res,next) {
    await service.destroy(res.locals.review.review_id);
    res.sendStatus(204);
};

module.exports = {
    list:asyncErrorBoundary(list),
    destroy:[asyncErrorBoundary(reviewExists), asyncErrorBoundary(deleteReview)],
    update:[asyncErrorBoundary(reviewExists),asyncErrorBoundary(update)],
};