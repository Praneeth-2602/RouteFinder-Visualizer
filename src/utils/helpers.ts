import { MAX_COLS, MAX_ROWS } from "./constants";
import { GridType, TileType } from "./types";

const createRow = (row: number, startTile: TileType, endTile: TileType) => {
    const currentRow = [];
    for (let col = 0; col < MAX_COLS; col++) {
        currentRow.push({
            row,
            col,
            isEnd: row === endTile.row && col === endTile.col,
            isWall: false,
            isPath: false,
            distance: Infinity,
            isStart: row === startTile.row && col === startTile.col,
            isTraversed: false, // used in Prim's algorithm
            parent: null,
        });
    }
    return currentRow;
};

export const createGrid = (startTile: TileType, endTile: TileType) => {
    const grid: GridType = [];
    for (let row = 0; row < MAX_ROWS; row++) {
        grid.push(createRow(row, startTile, endTile));
    }
    return grid;
};

export const checkIfStartOrEnd = (row: number, col: number) => {
    return (
        (row === 1 && col === 1) || (row === MAX_ROWS - 2 && col === MAX_COLS - 2)
    );
};

export const createNewGrid = (grid: GridType, row: number, col: number) => {
    const newGrid = grid.slice();
    const newTile = {
        ...newGrid[row][col],
        isWall: !newGrid[row][col].isWall,
    };

    newGrid[row][col] = newTile;
    return newGrid;
};

export const isEqual = (a: TileType, b: TileType) => {
    return a.row === b.row && a.col === b.col;
};

export const isRowColEqual = (row: number, col: number, tile: TileType) => {
    return row === tile.row && col === tile.col;
};

export const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getRandInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
};

/**
 * Checks if a tile is already in the stack (used for DFS).
 */
export const checkStack = (tile: TileType, stack: TileType[]) => {
    for (let i = 0; i < stack.length; i++) {
        if (isEqual(stack[i], tile)) return true;
    }
    return false;
};

/**
 * Removes a tile from the queue (used for BFS or A-star).
 */
export const dropFromQueue = (tile: TileType, queue: TileType[]) => {
    for (let i = 0; i < queue.length; i++) {
        if (isEqual(tile, queue[i])) {
            queue.splice(i, 1);
            break;
        }
    }
};

/**
 * Manhattan distance heuristic used by JPS and A-star.
 */
export const manhattanDistance = (tileA: TileType, tileB: TileType) => {
    return Math.abs(tileA.row + tileA.col - tileB.row - tileB.col);
};

/**
 * Returns the direction vector for JPS given two tiles.
 */
export const getDirection = (from: TileType, to: TileType) => {
    return {
        rowDir: to.row - from.row,
        colDir: to.col - from.col,
    };
};

// Helper function to get the neighbors of a cell (in four directions)
export function getNeighbors(grid: GridType, row: number, col: number) {
    const neighbors = [];
    if (isInBounds(row - 2, col)) neighbors.push(grid[row - 2][col]); // Top
    if (isInBounds(row + 2, col)) neighbors.push(grid[row + 2][col]); // Bottom
    if (isInBounds(row, col - 2)) neighbors.push(grid[row][col - 2]); // Left
    if (isInBounds(row, col + 2)) neighbors.push(grid[row][col + 2]); // Right
    return neighbors;
}

// Helper function to get the directions of a cell (in four directions)
export function getDirections(from: TileType, to: TileType) {
    if (from.row === to.row) return 1; // Horizontal
    else return 0; // Vertical
}

// Helper function to check if a cell is within bounds
export function isInBounds(row: number, col: number) {
    return row >= 0 && row < MAX_ROWS && col >= 0 && col < MAX_COLS;
}

export const getAdjacentTiles = (grid: GridType, row: number, col: number) => {
    const adjacent = [];
    const directions = [
        { r: -1, c: 0 }, // Up
        { r: 1, c: 0 },  // Down
        { r: 0, c: -1 }, // Left
        { r: 0, c: 1 }   // Right
    ];

    for (const { r, c } of directions) {
        const newRow = row + r;
        const newCol = col + c;

        if (newRow >= 0 && newRow < MAX_ROWS && newCol >= 0 && newCol < MAX_COLS) {
            adjacent.push(grid[newRow][newCol]);
        }
    }

    return adjacent;
};