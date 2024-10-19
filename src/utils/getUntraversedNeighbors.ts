import { MAX_COLS, MAX_ROWS } from "./constants";
import { GridType, TileType } from "./types";

export const getUntraversedNeighbors = (grid: GridType, tile: TileType) => {
    const { row, col } = tile;
    const neighbors = [];

    // Horizontal and vertical neighbors
    if (row > 0) {
        neighbors.push(grid[row - 1][col]);
    }
    if (row < MAX_ROWS - 1) {
        neighbors.push(grid[row + 1][col]);
    }
    if (col > 0) {
        neighbors.push(grid[row][col - 1]);
    }
    if (col < MAX_COLS - 1) {
        neighbors.push(grid[row][col + 1]);
    }

    // Diagonal neighbors (used in JPS)
    if (row > 0 && col > 0) {
        neighbors.push(grid[row - 1][col - 1]);
    }
    if (row > 0 && col < MAX_COLS - 1) {
        neighbors.push(grid[row - 1][col + 1]);
    }
    if (row < MAX_ROWS - 1 && col > 0) {
        neighbors.push(grid[row + 1][col - 1]);
    }
    if (row < MAX_ROWS - 1 && col < MAX_COLS - 1) {
        neighbors.push(grid[row + 1][col + 1]);
    }

    return neighbors.filter((neighbor) => !neighbor.isTraversed); // Only return untraversed neighbors
};
