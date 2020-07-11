function main() {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = width * size;
  canvas.height = height * size;

  const source = { x: 0, y: 0 };
  const target = { x: 25, y: 15 };

  const map = initMap(source, target);
  fillMap(ctx, map);
  drawLineMap(ctx);
  const path = shortestPath(map, source, target);
  drawPath(ctx, path);
}

main();
