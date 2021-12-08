const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
    critic_id: "critic.critic_id",
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
    created_at: "critic.created_at",
    updated_at: "critic.updated_at"
});

function list(movie_id) {
    return knex("reviews as r")
        .join("critics as c", "c.critic_id", "r.critic_id")
        .select("*")
        .where({ movie_id })
        .then(reviews => reviews.map(addCritic))
};

function readCritic(critic_id) {
    return knex("critics")
        .select("*")
        .where({ critic_id })
        .first();
};

function read(review_id) {
    return knex("reviews")
        .select("*")
        .where({ review_id })
        .first();
};

function update(updatedReview) {
    return knex("reviews")
        .update(updatedReview, "*")
        .where({ "review_id": updatedReview.review_id })
};

function destroy(review_id) {
    return knex("reviews")
        .where({ review_id }).del();
};

module.exports = {
    list,
    read,
    update,
    destroy,
    readCritic
};