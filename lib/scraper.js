const axios = require('axios');

async function resolveDirectVideo(playerUrl) {
    try {
        const response = await axios.get(playerUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://toonitalia.xyz/'
            },
            timeout: 5000 // Se il player non risponde in 5 secondi, passiamo oltre
        });

        const html = response.data;

        // Cerchiamo i link HLS (.m3u8) o MP4 che sono la chiave per Stremio
        // Questa regex cattura link che iniziano con http e finiscono con m3u8 o mp4
        const videoRegex = /(https?:\/\/[^"']+\.(?:m3u8|mp4)[^"']*)/i;
        const match = html.match(videoRegex);

        if (match) {
            console.log("Video trovato:", match[1]);
            return match[1];
        }
        
        return null;
    } catch (e) {
        return null;
    }
}

async function getStreams(imdbId, type) {
    // ... (tua logica precedente per trovare pageUrl su ToonItalia) ...
    
    const streams = [];
    
    // Supponiamo che tu abbia trovato i link ai player
    // ... dentro getStreams ...
const foundPlayerUrl = "https://lauradaydo.com/nszirutb2g86"; // Esempio trovato dallo scraping
const directVideo = await resolveDirectVideo(foundPlayerUrl);

if (directVideo) {
    streams.push({
        name: "ToonItalia",
        title: "Streaming Diretto (Interno)",
        url: directVideo // Usando 'url', Stremio usa il suo player
    });
} else {
    streams.push({
        name: "ToonItalia",
        title: "Apri nel Browser (Fallback)",
        externalUrl: foundPlayerUrl // Se il resolver fallisce, non rompiamo l'addon
    });
}
    return streams;
}
