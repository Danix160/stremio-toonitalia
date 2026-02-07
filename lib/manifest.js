const manifest = {
    id: "org.toonitalia.unofficial",
    version: "1.0.0",
    name: "ToonItalia Scraper",
    description: "Streaming provvisorio da ToonItalia",
    resources: ["stream"],
    types: ["series", "movie"],
    idPrefixes: ["tt"] // Usa ID di IMDb
};

module.exports = manifest;
