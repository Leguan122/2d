export function drawHUD(hudCtx) {
    // Skontroluj, či máme window.time
    if (!window.time || Object.keys(window.time).length === 0) {
        // window.time ešte nie je k dispozícii
        console.warn("⚠️ window.time je prázdny alebo nedefinovaný, HUD sa nekreslí.");
        return;
    }

    const time = window.time;

    // Vypočítaj hodiny a minúty z dayProgress
    const totalMinutes = time.dayProgress * 24 * 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);

    // Vyčisti HUD plátno
    hudCtx.clearRect(0, 0, hudCtx.canvas.width, hudCtx.canvas.height);

    // Horný panel
    hudCtx.fillStyle = "rgba(0, 0, 0, 0.5)";
    hudCtx.fillRect(0, 0, hudCtx.canvas.width, 50);

    hudCtx.fillStyle = "white";
    hudCtx.font = "24px Arial";

    // 🕑 Čas
    hudCtx.fillText(
        `Time: ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`,
        20, 35
    );

    // 📆 Deň a sezóna
    hudCtx.fillText(`Day: ${time.day}`, 250, 35);
    hudCtx.fillText(`Season: ${time.season}`, 400, 35);

    // 🌤️ Počasie
    hudCtx.fillText(`Weather: ${time.weather.type}`, 650, 35);

    // Ikonka počasia
    const weatherColor = time.weather.type === "sunny" ? "yellow" :
        time.weather.type === "cloudy" ? "gray" :
            time.weather.type === "rain" ? "blue" :
                time.weather.type === "storm" ? "purple" : "white";

    hudCtx.fillStyle = weatherColor;
    hudCtx.beginPath();
    hudCtx.arc(hudCtx.canvas.width - 40, 25, 15, 0, Math.PI * 2);
    hudCtx.fill();
}
