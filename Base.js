// Importing necessary libraries and modules
const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const Tweakpane = require('tweakpane');
const audioContext = new AudioContext();

// Canvas settings
const settings = {
  animate: true,
  dimensions: [1080, 1080]
};

// Parameters for controlling the sketch
const params = {
  cols: 10,
  rows: 10,
  ScaleMin: 1,
  ScaleMax: 30,
  freq: 0.001,
  amp: 0.2,
  frame: 0,
  animate: true,
  lineCap: 'butt',
  primary: '#f05',
  secondary: 'rgb(0, 255, 214)',
};

// Main sketch function
const sketch = () => {
  return ({ context, width, height, frame }) => {
    // Set the background color
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    // Extracted common variables
    const cols = params.cols;
    const rows = params.rows;
    const numCells = cols * rows;
    const gridw = width * 0.95;
    const gridh = height * 0.95;
    const cellw = gridw / cols;
    const cellh = gridh / rows;
    const margx = (width - gridw) * 0.5;
    const margy = (height - gridh) * 0.5;

    // Loop through each cell in the grid
    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cellw;
      const y = row * cellh;
      const w = cellw * 0.8;
      const h = cellh * 0.8;
      const f = params.animate ? frame : params.frame;
      const n = random.noise3D(x, y, f * 10, params.freq);
      const angle = n * Math.PI * params.amp;
      const scale = math.mapRange(n, -1, 1, params.ScaleMin, params.ScaleMax);

      // Drawing lines with varying parameters
      context.save();
      context.translate(x, y);
      context.translate(margx, margy);
      context.translate(cellw * 0.5, cellh * 0.5);
      context.rotate(angle);
      context.lineWidth = scale;
      context.lineCap = params.lineCap;

      context.beginPath();
      context.moveTo(w * -0.5, 0);
      context.lineTo(w * 0.5, 0);
      context.strokeStyle = params.primary;
      context.stroke();
      context.restore();
    }
  };
};

// Function to create the Tweakpane UI
const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  // 'LOOK' folder
  folder = pane.addFolder({ title: 'LOOK' });
  folder.addInput(params, 'lineCap', { options: { butt: 'butt', round: 'round', square: 'square' } });
  folder.addInput(params, 'cols', { min: 2, max: 50, step: 1 });
  folder.addInput(params, 'rows', { min: 2, max: 50, step: 1 });
  folder.addInput(params, 'ScaleMin', { min: 1, max: 100 });
  folder.addInput(params, 'ScaleMax', { min: 1, max: 100 });

  // 'FORCE' folder
  folder = pane.addFolder({ title: 'FORCE' });
  folder.addInput(params, 'freq', { min: -0.01, max: 0.01 });
  folder.addInput(params, 'amp', { min: 0, max: 1 });
  folder.addInput(params, 'animate');
  folder.addInput(params, 'frame', { min: 0, max: 999 });

  // 'BEAUTY' folder
  folder = pane.addFolder({ title: 'BEAUTY' });
  folder.addInput(params, 'primary');
};

// Call the functions to set up the UI and start the sketch
createPane();
canvasSketch(sketch, settings);
