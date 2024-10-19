import { GridType, TileType } from "../../../utils/types";
import { Queue } from "../../../utils/Queue"; // Assuming you have a Queue implementation
import { getUntraversedNeighbors } from "../../../utils/getUntraversedNeighbors";

export const bidirectionalSearch = async (
    grid: GridType,
    startTile: TileType,
    endTile: TileType,
    setIsDisabled: (disabled: boolean) => void
) => {
    const forwardQueue = new Queue<TileType>();
    const backwardQueue = new Queue<TileType>();
    const visitedFromStart = new Set<string>();
    const visitedFromEnd = new Set<string>();
    const path: TileType[] = [];

    forwardQueue.enqueue(startTile);
    backwardQueue.enqueue(endTile);
    visitedFromStart.add(`${startTile.row},${startTile.col}`);
    visitedFromEnd.add(`${endTile.row},${endTile.col}`);

    while (!forwardQueue.isEmpty() && !backwardQueue.isEmpty()) {
        // Expand from the start
        const currentFromStart = forwardQueue.dequeue();
    
        if (currentFromStart) {  // Ensure currentFromStart is not undefined
            const neighborsFromStart = getUntraversedNeighbors(grid, currentFromStart);
    
            for (const neighbor of neighborsFromStart) {
                if (!visitedFromStart.has(`${neighbor.row},${neighbor.col}`)) {
                    visitedFromStart.add(`${neighbor.row},${neighbor.col}`);
                    forwardQueue.enqueue(neighbor);
    
                    // Check for intersection with the backward search
                    if (visitedFromEnd.has(`${neighbor.row},${neighbor.col}`)) {
                        // Intersection found, construct path
                        await reconstructPath(grid, startTile, neighbor, endTile, path);
                        setIsDisabled(false);
                        return path;
                    }
                }
            }
        }
    
        // Expand from the end
        const currentFromEnd = backwardQueue.dequeue();
    
        if (currentFromEnd) {  // Ensure currentFromEnd is not undefined
            const neighborsFromEnd = getUntraversedNeighbors(grid, currentFromEnd);
    
            for (const neighbor of neighborsFromEnd) {
                if (!visitedFromEnd.has(`${neighbor.row},${neighbor.col}`)) {
                    visitedFromEnd.add(`${neighbor.row},${neighbor.col}`);
                    backwardQueue.enqueue(neighbor);
    
                    // Check for intersection with the forward search
                    if (visitedFromStart.has(`${neighbor.row},${neighbor.col}`)) {
                        // Intersection found, construct path
                        await reconstructPath(grid, endTile, neighbor, startTile, path);
                        setIsDisabled(false);
                        return path;
                    }
                }
            }
        }
    }

    setIsDisabled(false); // Re-enable UI
    return []; // No path found
};

// Helper function to reconstruct the path
const reconstructPath = async (
    _grid: GridType,
    startTile: TileType,
    meetingTile: TileType,
    endTile: TileType,
    path: TileType[]
) => {
    // Trace back from meetingTile to startTile and endTile using parent pointers or other tracking method
    let currentTile = meetingTile;

    while (currentTile !== startTile) {
        path.push(currentTile);
        if (currentTile.parent) {
            currentTile = currentTile.parent; // Assuming you store a reference to the parent in each tile
        } else {
            break; // Handle the case where parent is null
        }
    }

    path.push(startTile); // Finally, add the start tile to the path

    // Now trace from meetingTile to endTile (if needed)
    currentTile = meetingTile;

    while (currentTile !== endTile) {
        path.push(currentTile);
        if (currentTile.parent) {
            currentTile = currentTile.parent; // Adjust as needed
        } else {
            break; // Handle the case where parent is null
        }
    }

    path.push(endTile); // Finally, add the end tile to the path
};
