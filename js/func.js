const newNode = (x, y, type) => {
  return {
    x,
    y,
    type,
    visited: false,
    parent: null,
    g: 1,
    h: 1,
    f: 1,
  };
};

const initMap = (source, target) => {
  const map = [];
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      let n;
      if (x === source.x && y === source.y) {
        n = newNode(x, y, SOURCE);
      } else if (x === target.x && y === target.y) {
        n = newNode(x, y, TARGET);
      } else {
        n = newNode(x, y, EMPTY);
      }
      row.push(n);
    }
    map.push(row);
  }

  for (let i = 0; i < 13; i++) {
    map[0 + i][15].type = WALL;
  }

  return map;
};

const fillMap = (ctx, map) => {
  ctx.beginPath();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      ctx.fillStyle = colorMap[map[y][x].type];
      ctx.fillRect(x * size, y * size, size, size);
    }
  }
  ctx.fill();
};

const drawLineMap = (ctx) => {
  ctx.beginPath();
  ctx.strokeStyle = "#FFF";
  for (let y = 0; y < height; y++) {
    ctx.moveTo(0, y * size);
    ctx.lineTo(width * size, y * size);
  }
  for (let x = 0; x < width; x++) {
    ctx.moveTo(x * size, 0);
    ctx.lineTo(x * size, height * size);
  }
  ctx.stroke();
};

const euclidean = (s, e) => {
  let x = s.x - e.x;
  let y = s.y - e.y;
  x *= x;
  y *= y;
  return Math.sqrt(x + y);
};

const getMinNode = (openList) => {
  let min = openList[0];
  for (let i = 1; i < openList.length; i++) {
    if (min.f > openList[i].f) {
      min = openList[i];
    }
  }
  return min;
};

const lineOfSight = (map, s, e) => {
  const x = Math.abs(s.x - e.x);
  const y = Math.abs(s.y - e.y);
  const step = Math.max(x, y);

  const sx = Math.min(s.x, e.x);
  const sy = Math.min(s.y, e.y);
  const stepX = x / step;
  const stepY = y / step;

  for (let i = 0; i < step; i++) {
    const fcy = Math.floor(sy + i * stepY);
    const fcx = Math.floor(sx + i * stepX);
    const ccy = Math.ceil(sy + i * stepY);
    const ccx = Math.ceil(sx + i * stepX);

    if (map[fcy][fcx].type !== EMPTY) {
      return false;
    }

    if (map[ccy][ccx].type !== EMPTY) {
      return false;
    }
  }

  return true;
};

const shortestPath = (map, source, target) => {
  let openList = [];
  const dirX = [0, 0, 1, -1];
  const dirY = [-1, 1, 0, 0];

  const start = map[source.y][source.x];
  start.visited = true;
  start.visited.g = 1;
  start.h = euclidean(source, target);
  start.f = start.g + start.h;
  openList.push(start);
  while (openList.length > 0) {
    const curr = getMinNode(openList);
    openList = openList.filter((e) => e != curr);

    if (curr.visited && curr != start) continue;

    curr.visited = true;

    if (curr.x === target.x && curr.y === target.y) {
      break;
    }

    for (let i = 0; i < dirX.length; i++) {
      const nextX = curr.x + dirX[i];
      const nextY = curr.y + dirY[i];

      if (nextX < 0 || nextX >= width || nextY < 0 || nextY >= height) continue;

      const nextNode = map[nextY][nextX];

      if (nextNode.visited) continue;
      if (nextNode.type === WALL) continue;

      nextNode.g += curr.g;
      nextNode.h = euclidean(nextNode, target);
      nextNode.f = nextNode.g + nextNode.h;

      if (nextNode.parent === null || nextNode.parent.f > curr.f) {
        nextNode.parent = curr;
      }

      if (curr.parent !== null && lineOfSight(map, nextNode, curr.parent)) {
        nextNode.parent = curr.parent;
      }
      openList.push(nextNode);
    }
  }

  const path = [];
  let curr = map[target.y][target.x];
  while (curr != null) {
    path.push(curr);
    curr = curr.parent;
  }

  return path;
};

const getCenterPoint = (pos) => {
  return pos * size + size / 2;
};

const drawPath = (ctx, path) => {
  ctx.beginPath();
  ctx.strokeStyle = colorMap[PATH];
  ctx.lineWidth = 5;
  ctx.moveTo(getCenterPoint(path[0].x), getCenterPoint(path[0].y));
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(getCenterPoint(path[i].x), getCenterPoint(path[i].y));
  }
  ctx.stroke();
};
