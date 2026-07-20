import { COLS, ROWS, CellState, type Cell } from "./types";

const grid: Cell[][] = [];
for (let row = 0; row < ROWS; row ++) {
    grid[row] = [];
    for (let col = 0; col < COLS; col++) {
        grid[row][col] = {col, row, state: CellState.Empty, weight: 1, dist: Infinity};
    }
}

export {grid};

export function paintCell(cell: Cell, currentTool: CellState) {
    // toggle: same tool again on same cell clears it
    cell.state = cell.state === currentTool ? CellState.Empty : currentTool;

    // enforce uniqueness for Start/End
    if (currentTool === CellState.Start || currentTool === CellState.End) {
        clearOthers(cell, currentTool);
    }
}

export function weightCell(cell: Cell, weight: number) {
    cell.weight = weight;
}

export function getAdjacentCells(cell: Cell): Cell[] {
    const cells: Cell[] = [];

    if (cell.row > 0) {
        const above: Cell = grid[cell.row - 1][cell.col];
        cells.push(above);
    }
    if (cell.row < ROWS - 1) {
        const below: Cell = grid[cell.row + 1][cell.col];
        cells.push(below);
}
    if (cell.col > 0) {
        const left: Cell = grid[cell.row][cell.col - 1];
        cells.push(left);
    }
    if (cell.col < COLS - 1) {
        const right: Cell = grid[cell.row][cell.col + 1];
        cells.push(right);
    }
    return cells;
}

function clearOthers(keep: Cell, state: CellState) {
    for (const row of grid)
        for (const cell of row)
            if (cell !== keep && cell.state === state) cell.state = CellState.Empty;
}