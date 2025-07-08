// server/game/time.js

let serverTime = {
    startTime: Date.now(),
    dayLength: 0.5 * 60 * 1000,      // 5 minút = 1 deň (pre testovanie)
    seasonLength: 4 * 5 * 60 * 1000, // 4 dni = 1 sezóna
    weather: {
        type: 'sunny',  // sunny, cloudy, rain, storm
        intensity: 0.0  // 0.0 - 1.0 (na vizuálne efekty)
    }
};

/**
 * Vypočíta aktuálny čas a sezónu
 */
function getCurrentTime() {
    const now = Date.now();
    const elapsed = now - serverTime.startTime;

    const dayProgress = (elapsed % serverTime.dayLength) / serverTime.dayLength;
    const currentDay = Math.floor(elapsed / serverTime.dayLength);

    const seasonIndex = Math.floor(elapsed / serverTime.seasonLength) % 4;
    const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];

    return {
        day: currentDay,
        dayProgress: dayProgress, // 0.0 - 1.0 (ranné, obed, večer, noc)
        isDay: dayProgress >= 0.25 && dayProgress < 0.75,
        season: seasons[seasonIndex],
        weather: serverTime.weather
    };
}

/**
 * Generuje počasie na ďalší deň podľa sezóny
 */
function generateWeather(season) {
    const rand = Math.random();

    if (season === 'Summer') {
        if (rand < 0.6) return { type: 'sunny', intensity: 1.0 };     // 60% slnečno
        if (rand < 0.8) return { type: 'cloudy', intensity: 0.5 };    // 20% zamračené
        if (rand < 0.95) return { type: 'rain', intensity: 0.7 };     // 15% dážď
        return { type: 'storm', intensity: 1.0 };                     // 5% búrka
    } else if (season === 'Winter') {
        if (rand < 0.4) return { type: 'sunny', intensity: 1.0 };     // 40% slnečno
        if (rand < 0.8) return { type: 'cloudy', intensity: 0.6 };    // 40% zamračené
        return { type: 'snow', intensity: 0.8 };                      // 20% sneženie
    } else {
        if (rand < 0.5) return { type: 'sunny', intensity: 1.0 };     // 50% slnečno
        if (rand < 0.75) return { type: 'cloudy', intensity: 0.5 };   // 25% zamračené
        return { type: 'rain', intensity: 0.6 };                      // 25% dážď
    }
}

/**
 * Spustí broadcast času a počasia
 */
function startTimeBroadcast(io) {
    let lastDay = -1;

    setInterval(() => {
        const time = getCurrentTime();

        // Ak je nový deň, generuj nové počasie
        if (time.day !== lastDay) {
            lastDay = time.day;
            serverTime.weather = generateWeather(time.season);
            console.log(`🌤️ Nový deň ${time.day}: ${serverTime.weather.type}`);
            console.log(time.season)
        }

        // Broadcast času a počasia klientom
        io.emit('timeUpdate', time);
    }, 1000); // každú sekundu
}

module.exports = { startTimeBroadcast, getCurrentTime };
