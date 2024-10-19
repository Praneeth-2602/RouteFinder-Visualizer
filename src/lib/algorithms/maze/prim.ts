import { MAX_COLS, MAX_ROWS } from "../../../utils/constants";
import { createWall } from "../../../utils/createWalls";
import { destroyWall } from "../../../utils/destroyWall";
import { getRandInt, sleep, getAdjacentTiles } from "../../../utils/helpers";
import { GridType, SpeedType, TileType } from "../../../utils/types";

export const primsAlgorithm = async (
    grid: GridType,
    startTile: TileType,
    endTile: TileType,
    setIsDisabled: (disabled: boolean) => void,
    speed: SpeedType
) => {
    createWall(startTile, endTile, speed); // Make initial wall setup
    await sleep(MAX_ROWS * MAX_COLS); // Wait for the wall setup to complete

    const walls = []; // Walls to process
    const visited = new Set(); // Keep track of visited nodes

    // Start from the initial tile
    visited.add(`${startTile.row},${startTile.col}`);
    walls.push(...getAdjacentTiles(grid, startTile.row, startTile.col));

    while (walls.length > 0) {
        // Select a random wall from the walls list
        const randomWallIndex = getRandInt(0, walls.length);
        const wallTile: TileType = walls.splice(randomWallIndex, 1)[0];

        const adjacentVisitedTiles = getAdjacentTiles(grid, wallTile.row, wallTile.col).filter(tile => visited.has(`${tile.row},${tile.col}`));

        if (adjacentVisitedTiles.length === 1) {
            // If there is exactly one visited tile adjacent to the wall
            await destroyWall(grid, wallTile.row, wallTile.col, getRandInt(0, 2), speed);
            visited.add(`${wallTile.row},${wallTile.col}`);

            // Add adjacent walls to the walls list
            for (const adjacentTile of getAdjacentTiles(grid, wallTile.row, wallTile.col)) {
                if (!visited.has(`${adjacentTile.row},${adjacentTile.col}`)) {
                    walls.push(adjacentTile);
                }
            }
        }
    }
    
    setIsDisabled(false); // Re-enable the UI
};
