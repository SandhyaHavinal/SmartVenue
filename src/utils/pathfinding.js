/**
 * A* (A-Star) Pathfinding Algorithm
 * Configured for an indoor contiguous 2D grid
 */

class Node {
  constructor(x, y, isObstacle=false) {
    this.x = x;
    this.y = y;
    this.isObstacle = isObstacle;
    
    this.g = 0; // Cost from start
    this.h = 0; // Heuristic cost to end
    this.f = 0; // Total cost (g + h)
    
    this.parent = null;
  }
}

// Manhattan distance heuristic
const heuristic = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

// Build abstract map grid (e.g., 14x14)
export const createVenueGrid = (cols = 14, rows = 14) => {
  let grid = [];
  for (let x = 0; x < cols; x++) {
    grid[x] = [];
    for (let y = 0; y < rows; y++) {
      grid[x][y] = new Node(x, y);
    }
  }

  // Define the main Field Obstacle in the center of the venue
  // Roughly matching absolute positioned CSS field top: 25%, left: 30%, w:40%, h:50%
  for(let x = 4; x <= 9; x++) {
    for(let y = 3; y <= 10; y++) {
      grid[x][y].isObstacle = true;
    }
  }

  return grid;
};

// Main A* Pathfinding Logic
export const findShortestPath = (grid, startCoord, endCoord) => {
  let openSet = [];
  let closedSet = [];

  const startNode = grid[startCoord.x][startCoord.y];
  const endNode = grid[endCoord.x][endCoord.y];
  
  openSet.push(startNode);

  while (openSet.length > 0) {
    // Determine lowest f score
    let lowestIndex = 0;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIndex].f) {
        lowestIndex = i;
      }
    }
    
    let current = openSet[lowestIndex];

    // Reached destination, trace back path
    if (current === endNode) {
      let path = [];
      let temp = current;
      while (temp.parent) {
        path.push({ x: temp.x, y: temp.y });
        temp = temp.parent;
      }
      path.push({ x: startNode.x, y: startNode.y }); // push start
      return path.reverse();
    }

    // Move current from open to closed
    openSet.splice(lowestIndex, 1);
    closedSet.push(current);

    // Get adjacent neighbors
    const neighbors = [];
    const dirs = [[0,-1], [1,0], [0,1], [-1,0]]; // Up, Right, Down, Left
    dirs.forEach(dir => {
      const nx = current.x + dir[0];
      const ny = current.y + dir[1];
      if(nx >= 0 && nx < grid.length && ny >= 0 && ny < grid[0].length) {
        neighbors.push(grid[nx][ny]);
      }
    });

    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];

      // Skip invalid neighbors
      if (closedSet.includes(neighbor) || neighbor.isObstacle) {
        continue;
      }

      // Cost of moving to neighbor is always 1 (flat grid)
      let tempG = current.g + 1;
      let newPath = false;

      if (openSet.includes(neighbor)) {
        if (tempG < neighbor.g) {
          neighbor.g = tempG;
          newPath = true;
        }
      } else {
        neighbor.g = tempG;
        openSet.push(neighbor);
        newPath = true;
      }

      if (newPath) {
        neighbor.h = heuristic(neighbor, endNode);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = current;
      }
    }
  }

  // No path found
  return [];
};
