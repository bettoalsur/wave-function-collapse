let nm = 12;
let n,m,w;

let dimx = window.innerWidth;
let dimy = window.innerHeight;

if (dimx > dimy) {
  m = nm;
  w = Math.trunc(dimy/m);
  dimy = m*w;
  n = Math.trunc(dimx/w);
  dimx = n*w;
} else {
  n = nm;
  w = Math.trunc(dimx/n);
  dimx = w*n;
  m = Math.trunc(dimy/w);
  dimy = m*w;
}

let img = [];
function preload() {
  img[0] = loadImage('BLANK.jpg');
  img[1] = loadImage('UP.jpg');
  img[2] = loadImage('RIGHT.jpg');
  img[3] = loadImage('DOWN.jpg');
  img[4] = loadImage('LEFT.jpg');
  img[5] = loadImage('CURVE1.jpg');
  img[6] = loadImage('CURVE2.jpg');
  img[7] = loadImage('CURVE3.jpg');
  img[8] = loadImage('CURVE4.jpg');
  img[9] = loadImage('ALL.jpg');
}

let grid;

function setup() {
  createCanvas(dimx, dimy);
  console.log("STARTED!");
  grid = [];
  for (let j = 0; j < m ; j++) {
    for (let i = 0 ; i < n ; i ++) {
      grid.push(new Cell(i,j));
    }
  }
  random(grid).collapse();
}


function draw() {
  background(255);
  grid.forEach(cell => cell.show());
  
  let able = grid.filter(cell => !cell.collapsed);
  if (able.length > 0) {
    let chosen = able.sort((a,b)=>a.options.length-b.options.length)[0];
    chosen.collapse();
  } else {
    noLoop();
    console.log("FINISHED!");
  }
}


class Cell {
  constructor(i,j) {
    this.i = i;
    this.j = j;
    this.collapsed = false;
    this.options = [
      {index: 0, borders: [0,0,0,0] },
      {index: 1, borders: [1,1,0,1] },
      {index: 2, borders: [1,1,1,0] },
      {index: 3, borders: [0,1,1,1] },
      {index: 4, borders: [1,0,1,1] },
      {index: 5, borders: [1,1,0,0] },
      {index: 6, borders: [0,1,1,0] },
      {index: 7, borders: [0,0,1,1] },
      {index: 8, borders: [1,0,0,1] },
      {index: 9, borders: [1,1,1,1] }
    ];
  }
  
  updateNeighboors() {
    // arriba
    if (this.j > 0) {
      let cell = grid[(this.j-1)*n+this.i];
      if (!cell.collapsed) {
        cell.options = cell.options.filter(option => {
          return option.borders[2] == this.options[0].borders[0];
        });
        if (cell.options.length == 0) {
          setup();
          return;
        }
      }
    }
    // derecha
    if (this.i < n-1) {
      let cell = grid[(this.j)*n+this.i+1];
      if (!cell.collapsed) {
        cell.options = cell.options.filter(option => {
          return option.borders[3] == this.options[0].borders[1];
        });
        if (cell.options.length == 0) {
          setup();
          return;
        }
      }
    }
    // abajo
    if (this.j < m-1) {
      let cell = grid[(this.j+1)*n+this.i];
      if (!cell.collapsed) {
        cell.options = cell.options.filter(option => {
          return option.borders[0] == this.options[0].borders[2];
        });
        if (cell.options.length == 0) {
          setup();
          return;
        }
      }
    }
    // izquierda
    if (this.i > 0) {
      let cell = grid[(this.j)*n+this.i-1];
      if (!cell.collapsed) {
        cell.options = cell.options.filter(option => {
          return option.borders[1] == this.options[0].borders[3];
        });
        if (cell.options.length == 0) {
          setup();
          return;
        }
      }
    }
  }
  
  collapse() {
    this.collapsed = true;
    this.options = [random(this.options)];
    this.updateNeighboors();
  }
  
  show() {
    if (this.collapsed) {
      image(img[this.options[0].index],this.i*w,this.j*w,w,w);
    } else {
      noFill();
      stroke(10);
      strokeWeight(1);
      textAlign(CENTER,CENTER);
      text(this.options.length,this.i*w+w/2,this.j*w+w/2);
      rect(this.i*w,this.j*w,w,w);
    }
  }
}