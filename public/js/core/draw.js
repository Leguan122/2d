let canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
export function redraw(){
    clear()

}

function clear() {
    ctx.clearRect(0,0, canvas.width, canvas.height);
}

function drawBg () {
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, canvas.width, canvas.width);
}