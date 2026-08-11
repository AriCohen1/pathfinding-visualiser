// ---- Constants & types ----
export const CELL_SIZE = 45;
export const COLS = 30;
export const ROWS = 20;


export const enum CellState { Empty, Wall, Start, End, Visited, Path, Frontier}

export const CellColours: Record<CellState, string> = {
  [CellState.Empty]:   "#ffffff",   // (overridden by weightColour for terrain)
  [CellState.Wall]:    "#3a3a4a",   // dark slate — clearly the "impassable" extreme
  [CellState.Start]:   "#22c55e",   // vivid green
  [CellState.End]:     "#ef4444",   // vivid red
  [CellState.Frontier]:"#a5d8ff",   // pale blue — discovered, not yet expanded
  [CellState.Visited]: "#4a7fd0",   // deeper blue — expanded/settled
  [CellState.Path]:    "#f59e0b",   // amber/gold — the final route
};

export type Cell = { col: number; row: number; state: CellState, weight: number, dist: number };



