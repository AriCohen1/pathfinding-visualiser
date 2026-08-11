import { CellState, type Cell, COLS, ROWS, CELL_SIZE } from "./types";
import { grid, paintCell, weightCell } from "./grid";
import { render, canvas } from "./render";
import * as Algorithms from "./algorithms";



// ---- Controller ----

let currentTool: CellState = CellState.Wall;
let weightMode = false;
let simulationSpeed: number;
let isDrawing = false;

function onGridClick(event: MouseEvent) {
  const cell = getCell(event);
  if (!cell) return;



  if (weightMode) {
    const weightSelector = document.getElementById("weightSelector") as HTMLSelectElement;
    const selectedWeight = weightSelector.value;
    weightCell(cell, Number(selectedWeight));
  }
  else paintCell(cell, currentTool);
  render();

}

function getCell(event: MouseEvent): Cell | null {
  const col = Math.floor(event.offsetX / CELL_SIZE);
  const row = Math.floor(event.offsetY / CELL_SIZE);
  if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return null;
  return grid[row][col];
}

function setTool(tool: CellState) {
  currentTool = tool;

  if (weightMode) {
    weightMode = false;

    const weightModeButton = document.getElementById("weightModeButton") as HTMLElement;
    const weightSelector = document.getElementById("weightSelector") as HTMLSelectElement;

    weightSelector.style.display = "none";
    weightModeButton.classList.remove("active");
  }
}

const algorithms: Record<string, () => Generator> = {
  bfs: Algorithms.runBFS,
  dfs: Algorithms.runDFS,
  dijkstra: Algorithms.runDijkstra
};

function runAlgorithm() {
  const algorithmSelect = document.getElementById("algorithmSelect") as HTMLSelectElement;
  const choice = algorithmSelect.value;
  const gen = algorithms[choice]()


  function step() {
    const result = gen.next();
    render();
    if (!result.done) {
      setTimeout(step, simulationSpeed);
    }
  }
  step();
}

function reset() {
  currentTool = CellState.Wall;

  for (const row of grid) {
    for (const cell of row) {
      cell.state = CellState.Empty;
      cell.weight = 1;
    }
  }
  render();
}


function mouseDown() {
  isDrawing = true;
}

function mouseMove(event: MouseEvent) {
  if (!isDrawing) return;

  const cell = getCell(event);
  if (!cell) return;

  if (weightMode) {
    const weightSelector = document.getElementById("weightSelector") as HTMLSelectElement;
    weightCell(cell, Number(weightSelector.value));
  }
  else if (currentTool == CellState.Wall) {
    cell.state = CellState.Wall;
  }

  render();
}

function mouseUp() {
  isDrawing = false;
}



// ---- Init ----

function bindControls() {

  const startButton = document.getElementById("startButton") as HTMLButtonElement;
  const endButton = document.getElementById("endButton") as HTMLButtonElement;
  const wallButton = document.getElementById("wallButton") as HTMLButtonElement;


  startButton.addEventListener("click", () => {
    setTool(CellState.Start);
    startButton.classList.add("active");
    endButton.classList.remove("active");
    wallButton.classList.remove("active");
  })
  endButton.addEventListener("click", () => {
    setTool(CellState.End);
    startButton.classList.remove("active");
    endButton.classList.add("active");
    wallButton.classList.remove("active");
  });
  wallButton.addEventListener("click", () => {
    setTool(CellState.Wall);
    startButton.classList.remove("active");
    endButton.classList.remove("active");
    wallButton.classList.add("active");
  });


  const weightModeButton = document.getElementById("weightModeButton") as HTMLElement;
  const weightSelector = document.getElementById("weightSelector") as HTMLSelectElement;


  weightModeButton.addEventListener("click", () => {
    weightMode = !weightMode;
    weightSelector.style.display = weightMode ? "inline-block" : "none";
    weightModeButton.classList.toggle("active", weightMode);
  });


  (document.getElementById("RunButton") as HTMLButtonElement)
    .addEventListener("click", () => runAlgorithm());
  (document.getElementById("resetButton") as HTMLButtonElement)
    .addEventListener("click", () => reset());

  const speedSlider = (document.getElementById("speedSlider") as HTMLInputElement);
  speedSlider.min = "10";
  speedSlider.max = "200";
  speedSlider.value = "100";
  simulationSpeed = Number(speedSlider.value);

  speedSlider.addEventListener("input", () => {
    simulationSpeed = 200.0001 - Number(speedSlider.value);
  });





  canvas.width = CELL_SIZE * COLS;
  canvas.height = CELL_SIZE * ROWS;

  canvas.addEventListener("click", onGridClick);
  canvas.addEventListener("mousedown", mouseDown);
  canvas.addEventListener("mousemove", mouseMove);
  canvas.addEventListener("mouseup", mouseUp);
}


bindControls();
render();