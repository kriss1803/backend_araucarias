const NodeCache = require("node-cache");

const cache = new NodeCache({
    stdTTL: 60, // 60 segundos
});

module.exports = cache;