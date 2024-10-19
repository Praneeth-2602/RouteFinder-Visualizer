import { getUntraversedNeighbors } from "../../../utils/getUntraversedNeighbors";
import { dropFromQueue, isEqual, manhattanDistance } from "../../../utils/helpers";
import { initFunctionCost, initHeuristicCost } from "../../../utils/heuristics";
import { GridType, TileType } from "../../../utils/types";

export const jps = (
    grid: GridType,
    startTile: TileType,
    endTile: TileType
) => {
    const traversedTiles = []; // Store traversed tiles
    const heuristicCost = initHeuristicCost(grid, endTile); // Heuristic cost (Manhattan for JPS)
    const base = grid[startTile.row][startTile.col]; // Get the start tile
    base.distance = 0;
    base.isTraversed = true; // Mark start as traversed

    const openList = [base]; // Open list to store nodes to explore
    const functionCost = initFunctionCost(); // Initialize function cost array

    functionCost[base.row][base.col] =
        base.distance + heuristicCost[base.row][base.col]; // Start tile cost

    while (openList.length > 0) {
        openList.sort((a, b) => functionCost[a.row][a.col] - functionCost[b.row][b.col]); // Sort based on cost
        const currentTile = openList.shift(); // Get node with smallest function cost

        if (currentTile) {
            if (currentTile.isWall) continue; // Skip walls
            if (currentTile.distance === Infinity) break; // Stop if unreachable
            traversedTiles.push(currentTile); // Track traversed tiles

            if (isEqual(currentTile, endTile)) break; // If goal reached

            const neighbors = getUntraversedNeighbors(grid, currentTile); // Get valid neighbors

            for (let i = 0; i < neighbors.length; i += 1) {
                const jumpPoint = jump(neighbors[i], currentTile, grid, endTile);
                if (jumpPoint && jumpPoint.distance < Infinity) {
                    const distanceToNeighbor = currentTile.distance + manhattanDistance(currentTile, jumpPoint); // Update cost
                    if (distanceToNeighbor < jumpPoint.distance) {
                        dropFromQueue(jumpPoint, openList); // Remove from queue if already there
                        jumpPoint.distance = distanceToNeighbor;
                        functionCost[jumpPoint.row][jumpPoint.col] = jumpPoint.distance + heuristicCost[jumpPoint.row][jumpPoint.col]; // Update function cost
                        jumpPoint.parent = currentTile; // Set parent for path reconstruction
                        openList.push(jumpPoint); // Push the jump point to open list
                    }
                }
            }
        }
    }

    const path = []; // Reconstruct path from end to start
    let current = grid[endTile.row][endTile.col];
    while (current !== null) {
        current.isPath = true;
        path.unshift(current);
        current = current.parent!;
    }

    return { traversedTiles, path };
};

/**
 * Jump function to explore jump points along straight lines.
 * Returns a jump point if a significant node is found.
 */
const jump = (
    neighbor: TileType,
    currentTile: TileType,
    grid: GridType,
    endTile: TileType
): TileType | null => {
    // Base cases for recursion:
    if (!neighbor || neighbor.isWall) return null;
    if (isEqual(neighbor, endTile)) return neighbor; // Reached goal

    // Horizontal or vertical jump points
    if (neighbor.row !== currentTile.row || neighbor.col !== currentTile.col) {
        // Forced neighbors check (e.g., obstacles that force direction change)
        if (hasForcedNeighbor(neighbor, currentTile, grid)) return neighbor; // Jump point found
    }

    // Recursive jumping in the same direction
    const nextNeighbor = getNextNeighbor(neighbor, currentTile, grid);
    if (nextNeighbor) {
        return jump(nextNeighbor, currentTile, grid, endTile);
    }
    return null;
};

/**
 * Utility function to check for forced neighbors indicating a jump point.
 */
const hasForcedNeighbor = (
    neighbor: TileType,
    currentTile: TileType,
    grid: GridType
): boolean => {
    const rowDiff = neighbor.row - currentTile.row;
    const colDiff = neighbor.col - currentTile.col;

    // Moving horizontally (left or right)
    if (colDiff !== 0) {

        // Check for forced neighbors on vertical sides
        if (
            (grid[neighbor.row - 1] && grid[neighbor.row - 1][neighbor.col].isWall &&
                !grid[neighbor.row - 1][currentTile.col].isWall) ||
            (grid[neighbor.row + 1] && grid[neighbor.row + 1][neighbor.col].isWall &&
                !grid[neighbor.row + 1][currentTile.col].isWall)
        ) {
            return true; // Forced neighbor found
        }
    }

    // Moving vertically (up or down)
    if (rowDiff !== 0) {

        // Check for forced neighbors on horizontal sides
        if (
            (grid[neighbor.row][neighbor.col - 1] && grid[neighbor.row][neighbor.col - 1].isWall &&
                !grid[currentTile.row][neighbor.col - 1].isWall) ||
            (grid[neighbor.row][neighbor.col + 1] && grid[neighbor.row][neighbor.col + 1].isWall &&
                !grid[currentTile.row][neighbor.col + 1].isWall)
        ) {
            return true; // Forced neighbor found
        }
    }

    return false; // No forced neighbor
};


/**
 * Get next neighbor based on current direction.
 */
const getNextNeighbor = (
    neighbor: TileType,
    currentTile: TileType,
    grid: GridType
): TileType | null => {
    const rowDiff = neighbor.row - currentTile.row;
    const colDiff = neighbor.col - currentTile.col;

    // Horizontal movement (left or right)
    if (colDiff !== 0) {
        const nextCol = neighbor.col + Math.sign(colDiff); // Move in the same horizontal direction
        if (grid[neighbor.row] && grid[neighbor.row][nextCol]) {
            return grid[neighbor.row][nextCol]; // Return next horizontal neighbor
        }
    }

    // Vertical movement (up or down)
    if (rowDiff !== 0) {
        const nextRow = neighbor.row + Math.sign(rowDiff); // Move in the same vertical direction
        if (grid[nextRow] && grid[nextRow][neighbor.col]) {
            return grid[nextRow][neighbor.col]; // Return next vertical neighbor
        }
    }

    // Diagonal movement
    if (rowDiff !== 0 && colDiff !== 0) {
        const nextRow = neighbor.row + Math.sign(rowDiff); // Move diagonally
        const nextCol = neighbor.col + Math.sign(colDiff); // Move diagonally
        if (grid[nextRow] && grid[nextRow][nextCol]) {
            return grid[nextRow][nextCol]; // Return next diagonal neighbor
        }
    }

    return null; // No valid next neighbor
};
