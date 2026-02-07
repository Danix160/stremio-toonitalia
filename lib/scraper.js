const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://toonitalia.xyz';

// Funzione per estrarre il link video reale dal player (es. VOE, Lauradaydo)
async function resolveDirectVideo(playerUrl) {
    try {
        const response = await axios.get(playerUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': BASE_URL
            },
            timeout: 6000 
        });

        const html = response.data;
        // Regex per trovare link .m3u8 o .mp4
        const videoRegex = /(https?:\/\/[^"']+\.(?:m3u8|mp4)[^"']*)/i;
        const match = html.match(videoRegex);

        return match ? match[1] : null;
    } catch (e) {
        return null;
    }
}

async function getStreams(imdbId, type) {
    try {
        // 1. Ottieni info da Cinemeta per avere il titolo pulito
        const metaRes = await axios.get(`https://v3-cinemeta.strem.io/meta/${type}/${imdbId}.json`);
        if (!metaRes.data || !metaRes.data.meta) return [];
        
        const title = metaRes.data.meta.name;

        // 2. Cerca su ToonItalia
        const searchUrl = `${BASE_URL}/?s=${encodeURIComponent(title)}`;
        const { data } = await axios.get(searchUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const $ = cheerio.load(data);
        
        let pageUrl = '';
        $('.entry-title a').each((i, el) => {
            const foundTitle = $(el).text();
            if (foundTitle.toLowerCase().includes(title.toLowerCase())) {
                pageUrl = $(el).attr('href');
                return false;
            }
        });

        if (!pageUrl) return [];

        // 3. Estrai i link dei player dalla pagina
        const pageRes = await axios.get(pageUrl);
        const page$ = cheerio.load(pageRes.data);
        const streams = [];
        const playerLinks = [];

        page$('a').each((i, el) => {
            const href = page$(el).attr('href');
            if (href && (href.includes('voe') || href.includes('chuckle-tube') || href.includes('lauradaydo') || href.includes('wstream'))) {
                playerLinks.push(href);
            }
        });

        // 4. Risolvi i link (Limitiamo a 2 per non andare in timeout su Vercel)
        for (const link of playerLinks.slice(0, 2)) {
            const direct = await resolveDirectVideo(link);
            if (direct) {
                streams.push({
                    name: "ToonItalia 🚀",
                    title: `Player Interno (${new URL(link).hostname})`,
                    url: direct
                });
            } else {
                streams.push({
                    name: "ToonItalia 🌐",
                    title: `Apri nel Browser (${new URL(link).hostname})`,
                    externalUrl: link
                });
            }
        }

        return streams;
    } catch (e) {
        console.error("Scraper Error:", e.message);
        return []; // Restituisci array vuoto invece di crashare
    }
}

module.exports = { getStreams };
