import { grid } from "./grid";
import { CELL_SIZE, COLS, ROWS, CellColours, CellState } from "./types";

const canvas = document.getElementById("grid") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d")!;

export function render() {

    let maxDist = 0;
    for (const row of grid) {
        for (const Cell of row) {
            if (Cell.state === CellState.Visited && Cell.dist < Infinity) {
                maxDist = Math.max(maxDist, Cell.dist);
            }
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const row of grid) {
        for (const cell of row) {
            if (cell.state === CellState.Visited) ctx.fillStyle = visitedColour(cell.dist, maxDist);
            //else if (cell.state == CellState.Empty) ctx.fillStyle = weightColour(cell.weight);
            else ctx.fillStyle = CellColours[cell.state];

            ctx.fillRect(cell.col * CELL_SIZE, cell.row * CELL_SIZE, CELL_SIZE, CELL_SIZE);

            if (cell.state !== CellState.Wall && cell.weight > 1) {
                const cx = cell.col * CELL_SIZE + CELL_SIZE / 2;
                const cy = cell.row * CELL_SIZE + CELL_SIZE / 2;
                const size = 5 + (cell.weight - 1) * 1.8;

                ctx.fillStyle = weightSymbolColour(cell.weight);
                ctx.beginPath();
                ctx.moveTo(cx, cy - size);              // top vertex
                ctx.lineTo(cx - size, cy + size);       // bottom-left
                ctx.lineTo(cx + size, cy + size);       // bottom-right
                ctx.closePath();
                ctx.fill();

                ctx.strokeStyle = "rgba(0,0,0,0.3)";
                ctx.lineWidth = 1; ctx.stroke();
            }
        }
    }
    drawGridLines();
}


function weightSymbolColour(weight: number): string {
    const t = (weight - 1) / 4;   // 0 at weight 1, 1 at weight 5
    // green (34,197,94) -> yellow (234,179,8) -> red (239,68,68)
    let r, g, b;
    if (t < 0.5) {
        const u = t / 0.5;                       // first half: green -> yellow
        r = Math.round(34 + u * (234 - 34));
        g = Math.round(197 + u * (179 - 197));
        b = Math.round(94 + u * (8 - 94));
    } else {
        const u = (t - 0.5) / 0.5;               // second half: yellow -> red
        r = Math.round(234 + u * (239 - 234));
        g = Math.round(179 + u * (68 - 179));
        b = Math.round(8 + u * (68 - 8));
    }
    return `rgb(${r}, ${g}, ${b})`;
}

function drawGridLines() {
    ctx.strokeStyle = "#c8c8d4";

    // Draw vertical lines
    ctx.beginPath();
    for (let i = 0; i <= COLS; i++) {
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, CELL_SIZE * ROWS);
        ctx.stroke();
    }

    ctx.beginPath();
    // Draw horizontal lines
    for (let i = 0; i <= ROWS; i++) {
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(CELL_SIZE * COLS, i * CELL_SIZE);
        ctx.stroke();
    }
}

function visitedColour(dist: number, maxDist: number): string {
    const t = maxDist > 0 ? dist / maxDist : 0;   // 0 near start, 1 at farthest
    // interpolate between two colours
    // near start: light blue (165, 216, 255)
    // far:        deep indigo (49, 46, 129)
    const r = Math.round(165 + t * (49 - 165));
    const g = Math.round(216 + t * (46 - 216));
    const b = Math.round(255 + t * (129 - 255));
    return `rgb(${r}, ${g}, ${b})`;
}



export { canvas };