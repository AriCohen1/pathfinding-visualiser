import { grid } from "./grid";
import { getAdjacentCells } from "./grid";
import { CellState, type Cell } from "./types"

export function* runBFS() {
    clearSearch();
    // START POSITION
    let startCell: Cell | null = null;
    let endCell: Cell | null = null;

    searchStart:
    for (const row of grid)
        for (const cell of row)
            if (cell.state == CellState.Start) {
                startCell = cell;
                break searchStart;
            }
    if (startCell == null) {
        console.log("No start Pos");
        return;
    };
    console.log("Start Pos: " + startCell.col + ", " + startCell.row);

    let queue: Cell[] = [];
    queue.push(startCell);

    // MAIN LOOP
    const cameFrom = new Map<Cell, Cell>();
    while (queue.length != 0 && endCell == null) {
        const currentCell = queue.shift()!;

        for (const cell of getAdjacentCells(currentCell)) {
            if (cell.state == CellState.End) {
                cameFrom.set(cell, currentCell)
                endCell = cell; //Yay!!!
                break;
            }
            if (cell.state == CellState.Wall ||
                cell.state == CellState.Visited ||
                cell.state == CellState.Start)
                continue;

            yield cell.state = CellState.Visited;
            queue.push(cell);
            cameFrom.set(cell, currentCell);

        }
    }

    // BACKTRACK
    if (endCell == null) console.log("No end position");
    else {
        let current = cameFrom.get(endCell)!;   // start one step back from the end
        while (current !== startCell) {
            yield current.state = CellState.Path;
            current = cameFrom.get(current)!;
        }
    }
}


export function* runDFS() {
    clearSearch();
    // START POSITION
    let startCell: Cell | null = null;
    let endCell: Cell | null = null;

    searchStart:
    for (const row of grid)
        for (const cell of row)
            if (cell.state == CellState.Start) {
                startCell = cell;
                break searchStart;
            } 
    if (startCell == null) {
        console.log("No start Pos");
        return;
    };
    console.log("Start Pos: " + startCell.col + ", " + startCell.row);

    let queue: Cell[] = [];
    queue.push(startCell);

    // MAIN LOOP
    const cameFrom = new Map<Cell, Cell>();
    while (queue.length != 0 && endCell == null) {
        const currentCell = queue.pop()!;

        for (const cell of getAdjacentCells(currentCell)) {
            if (cell.state == CellState.End) {
                cameFrom.set(cell, currentCell)
                endCell = cell; //Yay!!!
                break;
            }
            if (cell.state == CellState.Wall ||
                cell.state == CellState.Visited ||
                cell.state == CellState.Start)
                continue;

            yield cell.state = CellState.Visited;
            queue.push(cell);
            cameFrom.set(cell, currentCell);

        }
    }

    // BACKTRACK
    if (endCell == null) console.log("No end position");
    else {
        let current = cameFrom.get(endCell)!;   // start one step back from the end
        while (current !== startCell) {
            yield current.state = CellState.Path;
            current = cameFrom.get(current)!;
        }
    }
}


export function* runDijkstra() {
    clearSearch();
    // START POSITION
    let startCell: Cell | null = null;
    let endCell: Cell | null = null;

    searchStart:
    for (const row of grid)
        for (const cell of row)
            if (cell.state == CellState.Start) {
                startCell = cell;
                break searchStart;
            }
    if (startCell == null) {
        console.log("No start Pos");
        return;
    };
    console.log("Start Pos: " + startCell.col + ", " + startCell.row);

    let frontier: Cell[] = [];
    frontier.push(startCell);

    const cameFrom = new Map<Cell, Cell>();

    const distances = new Map<Cell, number>();
    distances.set(startCell, 0);


    // MAIN LOOP
    while (frontier.length != 0) {
        const currentCell = getSmallest(frontier, distances);
        frontier.splice(frontier.indexOf(currentCell), 1);

        // Check whether current cell is the end
        if (currentCell.state == CellState.End) {
            endCell = currentCell; //Yay!!!
            break;
        }

        if (currentCell.state !== CellState.Start) {
            currentCell.state = CellState.Visited;
        }
        yield;


        for (const neighbour of getAdjacentCells(currentCell)) {
            if (neighbour.state == CellState.Wall) continue;

            const newDist = distances.get(currentCell)! + neighbour.weight;
            if (newDist < (distances.get(neighbour) ?? Infinity)) {
                neighbour.dist = newDist;
                distances.set(neighbour, newDist);
                cameFrom.set(neighbour, currentCell);
                if (!frontier.includes(neighbour)) {
                    frontier.push(neighbour);
                    if (neighbour.state !== CellState.Start && neighbour.state !== CellState.End) {
                        neighbour.state = CellState.Frontier;
                        yield;
                    }
                }
            }
        }

    }



    // BACKTRACK
    if (endCell == null) console.log("No end position");
    else {
        let current = cameFrom.get(endCell)!;   // start one step back from the end
        while (current !== startCell) {
            yield current.state = CellState.Path;
            current = cameFrom.get(current)!;
        }
    }
}

function clearSearch() {
    for (const row of grid) {
        for (const cell of row) {
            if (cell.state === CellState.Visited || cell.state === CellState.Path || cell.state === CellState.Frontier) {
                cell.state = CellState.Empty;
            }
            cell.dist = Infinity;
        }
    }
}

function getSmallest(frontier: Cell[], dist: Map<Cell, number>): Cell {
    let smallest = frontier[0];
    for (const cell of frontier) {
        if (dist.get(cell)! < dist.get(smallest)!) {
            smallest = cell;
        }
    }
    return smallest;
}