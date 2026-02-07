const { addonBuilder, getRouter } = require("stremio-addon-sdk");
const manifest = require("../lib/manifest");

const builder = new addonBuilder(manifest);

// Logica per trovare i video
builder.defineStreamHandler(async (args) => {
    // Per ora restituiamo un link di test per vedere se funziona
    if (args.type === "movie" || args.type === "series") {
        return {
            streams: [
                {
                    title: "Test Stream (ToonItalia)",
                    url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                }
            ]
        };
    }
    return { streams: [] };
});

const addonInterface = builder.getInterface();
const router = getRouter(addonInterface);

module.exports = (req, res) => {
    router.handle(req, res);
};
