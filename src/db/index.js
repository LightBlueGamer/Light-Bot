const Josh = require("@joshdb/core");
const provider = require("@joshdb/sqlite");

const config = new Josh({
    name: "config",
    provider,
});

const economy = new Josh({
    name: "economy",
    provider,
});

const levels = new Josh({
    name: "levels",
    provider,
});

module.exports = { config, economy, levels };
