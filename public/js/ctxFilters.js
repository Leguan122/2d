// ctxFilters.js

let lastColor = { r: 0, g: 0, b: 0 };
let lastAlpha = 0;
let lastWeather = 'sunny';

/**
 * Hlavná funkcia pre vizuálne efekty
 * @param {CanvasRenderingContext2D} ctx - Kontext canvasu
 * @param {Object} time - Objekt serverového času { dayProgress, season, weather }
 */
export function applyEnvironmentFilter(ctx, time) {
    // Fallback: ak time alebo weather neexistuje
    if (!time) return;
    const { dayProgress = 0.5, season = 'Summer', weather = { type: 'sunny', intensity: 1.0 } } = time;

    // Vypočítaj cieľový odtieň a intenzitu podľa času a počasia
    const targetColor = calculateDayColor(dayProgress, season, weather);
    const targetAlpha = calculateNightAlpha(dayProgress, weather);

    // Hladký prechod medzi farbami
    lastColor.r += (targetColor.r - lastColor.r) * 0.05;
    lastColor.g += (targetColor.g - lastColor.g) * 0.05;
    lastColor.b += (targetColor.b - lastColor.b) * 0.05;

    // Hladký prechod medzi alfami
    lastAlpha += (targetAlpha - lastAlpha) * 0.05;

    // Nastav filter
    ctx.fillStyle = `rgba(${Math.round(lastColor.r)}, ${Math.round(lastColor.g)}, ${Math.round(lastColor.b)}, ${lastAlpha})`;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Blesky pri búrke (náhodné záblesky)
    if (weather.type === 'storm' && Math.random() < 0.01) {
        flashLightning(ctx);
    }
}

/**
 * Dynamicky vypočíta intenzitu stmavenia podľa dňa a počasia
 */
function calculateNightAlpha(dayProgress, weather) {
    let alpha = 0;

    // Noc (hladký prechod)
    if (dayProgress < 0.15) {
        alpha = easeInOut((0.15 - dayProgress) / 0.15) * 0.7;
    } else if (dayProgress > 0.85) {
        alpha = easeInOut((dayProgress - 0.85) / 0.15) * 0.7;
    }

    // Počasie znižuje jas
    if (weather.type === 'cloudy') {
        alpha += 0.2 * weather.intensity;
    } else if (weather.type === 'rain') {
        alpha += 0.3 * weather.intensity;
    } else if (weather.type === 'storm') {
        alpha += 0.4 * weather.intensity;
    }

    return Math.min(1, alpha);
}

/**
 * Vypočíta cieľovú farbu podľa času, sezóny a počasia
 */
function calculateDayColor(dayProgress, season, weather) {
    let r = 0, g = 0, b = 0;

    // Denné odtiene
    if (dayProgress < 0.15) {
        // Svitanie
        r = 255; g = 180; b = 120;
    } else if (dayProgress > 0.85) {
        // Súmrak
        r = 255; g = 140; b = 100;
    } else {
        // Deň
        r = 255; g = 255; b = 255;
    }

    // Sezónne odtiene
    switch (season) {
        case 'Spring': g += 20; break;                 // Sviežejšia zeleň
        case 'Summer': r += 15; g += 10; break;        // Teplejšie tóny
        case 'Autumn': r += 40; g += 20; b -= 20; break; // Oranžové nádychy
        case 'Winter': b += 40; r -= 20; g -= 20; break; // Modrý chlad
    }

    // Počasie
    if (weather.type === 'cloudy') {
        r -= 30 * weather.intensity;
        g -= 30 * weather.intensity;
        b -= 30 * weather.intensity;
    } else if (weather.type === 'rain') {
        r -= 50 * weather.intensity;
        g -= 50 * weather.intensity;
        b -= 50 * weather.intensity;
    } else if (weather.type === 'storm') {
        r -= 80 * weather.intensity;
        g -= 80 * weather.intensity;
        b -= 80 * weather.intensity;
    }

    // Clamp 0-255
    return {
        r: Math.max(0, Math.min(255, r)),
        g: Math.max(0, Math.min(255, g)),
        b: Math.max(0, Math.min(255, b))
    };
}

/**
 * Easing pre plynulé prechody
 */
function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/**
 * Efekt blesku pri búrke
 */
function flashLightning(ctx) {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5})`;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
