export default function() {
  let x0 = 0;
  let y0 = 0;
  let x1 = 960;
  let y1 = 500;
  let tx = (x0 + x1) / 2;
  let ty = (y0 + y1) / 2;
  let tileSize = 256;
  let scale = 256;
  let zoomDelta = 0;
  let clampX = true;
  let clampY = true;

  function tile() {
    const z = Math.log2(scale / tileSize);
    const z0 = Math.round(Math.max(z + zoomDelta, 0));
    const k = Math.pow(2, z - z0) * tileSize;
    const x = tx - scale / 2;
    const y = ty - scale / 2;
    const xmin = Math.max(clampX ? 0 : -Infinity, Math.floor((x0 - x) / k));
    const xmax = Math.min(clampX ? 1 << z0 : Infinity, Math.ceil((x1 - x) / k));
    const ymin = Math.max(clampY ? 0 : -Infinity, Math.floor((y0 - y) / k));
    const ymax = Math.min(clampY ? 1 << z0 : Infinity, Math.ceil((y1 - y) / k));
    const tiles = [];
    for (let y = ymin; y < ymax; ++y) {
      for (let x = xmin; x < xmax; ++x) {
        tiles.push([x, y, z0]);
      }
    }
    tiles.translate = [x / k, y / k];
    tiles.scale = k;
    return tiles;
  }

  tile.size = function(_) {
    return arguments.length ? (x0 = y0 = 0, x1 = +_[0], y1 = +_[1], tile) : [x1 - x0, y1 - y0];
  };

  tile.extent = function(_) {
    return arguments.length ? (x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1], tile) : [[x0, y0], [x1, y1]];
  };

  tile.scale = function(_) {
    return arguments.length ? (scale = +_, tile) : scale;
  };

  tile.translate = function(_) {
    return arguments.length ? (tx = +_[0], ty = +_[1], tile) : [tx, ty];
  };

  tile.zoomDelta = function(_) {
    return arguments.length ? (zoomDelta = +_, tile) : zoomDelta;
  };

  tile.tileSize = function(_) {
    return arguments.length ? (tileSize = +_, tile) : tileSize;
  };

  tile.clamp = function(_) {
    return arguments.length ? (clampX = clampY = !!_, tile) : clampX && clampY;
  };

  tile.clampX = function(_) {
    return arguments.length ? (clampX = !!_, tile) : clampX;
  };

  tile.clampY = function(_) {
    return arguments.length ? (clampY = !!_, tile) : clampY;
  };

  return tile;
}
