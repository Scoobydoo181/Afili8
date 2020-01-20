import express from 'express'

const frontendRouter = express.Router()

frontendRouter.get("/", (req, res) => {
    res.render("home");
});

frontendRouter.get("/login", (req, res) => {
    res.render("login");
});

frontendRouter.get("/dashboard", (req, res) => {
    const model = { data: [65, 21, 38, 75, 42, 51] };
    res.render("dashboard", model);
});

export default frontendRouter