# Pathfinding Visualiser

Interactive visualiser for graph search algorithms, built from scratch in
TypeScript on HTML Canvas — no framework, no libraries.

**[Live demo →](https://pathfinding-visualiser-one.vercel.app)**

![Demo](docs/demo.gif)

## What it does

Draw walls and weighted terrain onto a grid, pick an algorithm, and watch it
search. Nodes are coloured as they're visited, and the final path is traced
once the target is reached.

## Algorithms

| Algorithm | Weighted | Shortest path |
|---|---|---|
| Breadth-First Search | No | Yes (unweighted) |
| Depth-First Search | No | No |
| Dijkstra | Yes | Yes |

## Features

- Click-and-drag wall drawing
- Click-to-place start and target cells, with toggle-to-clear and enforced uniqueness
- Weighted terrain with a selectable cost, applied by click or drag
- Adjustable animation speed
- Reset clears the grid and all weights

## Stack

TypeScript, HTML Canvas, deployed on Vercel.

## Running locally

```bash
git clone https://github.com/AriCohen1/pathfinding-visualiser.git
cd pathfinding-visualiser
npm install
npm run dev
```

## Notes on the implementation

The grid is a 2D array of mutable cell objects, each holding its coordinates,
a state enum, a movement weight and a tentative distance. Algorithms mutate
cell state directly, and the renderer draws whatever it finds — so there's no
separate visualisation model to keep in sync with the search.

Animation is driven by generators rather than a precomputed replay. Each
algorithm is a `function*` that yields at the points where the grid has
visibly changed — a cell being visited, entering the frontier, or being
marked as part of the final path. The controller drives it with
`gen.next()`, renders, and schedules the next step with `setTimeout` at the
current speed setting. This means the algorithms are written as ordinary
straight-line code with no callbacks or state machines, and pausing between
steps is just a suspended generator rather than a recorded list of events
being played back.

BFS and DFS share a structure and differ only in how they take from the
container — `shift()` for a queue, `pop()` for a stack — with `Visited` state
doubling as the closed set. Dijkstra keeps a separate distance map and
selects the minimum by linear scan over the frontier array, which is O(V) per
extraction and so O(V²) overall; a binary heap would bring that to
O(E log V), and is the obvious next change. Movement is four-directional,
and edge cost is the weight of the cell being entered.