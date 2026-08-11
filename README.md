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

- Click-and-drag wall drawing, draggable start and target nodes
- Weighted terrain with configurable cost
- Adjustable animation speed

## Stack

TypeScript, HTML Canvas, deployed on Vercel.

## Running locally

```bash
git clone https://github.com/AriCohen1/pathfinding-visualiser.git
cd pathfinding-visualiser
npm install
npm run dev
```