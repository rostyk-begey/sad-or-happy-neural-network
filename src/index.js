import Network from './network';
import './style.css';

const canvas = document.querySelector('#paintField');
const clearBtn = document.querySelector('#clear');
const sadBtn = document.querySelector('#sad');
const happyBtn = document.querySelector('#happy');
const trainBtn = document.querySelector('#train');
const predictBtn = document.querySelector('#predict');
const ctx = canvas.getContext('2d');
const paintField = new Array(100);
const trainData = [];
const NN = new Network(100, 2);
let mouseDown = false;
let happyCount = 0;
let sadCount = 0;

NN.learningRate = 0.8;

const drawGrid = () => {
  ctx.strokeStyle = '#CCC'

  for (let i = 1; i < 10; i++) {
    ctx.moveTo(0, i * 40);
    ctx.lineTo(400, i * 40);
    ctx.moveTo(i * 40, 0);
    ctx.lineTo(i * 40, 400);
  }

  ctx.stroke();
}

const clearCanvas = () => {
  ctx.fillStyle = '#FFF';
  ctx.fillRect(0, 0, 400, 400);
  drawGrid();
}

const drawSquare = (row, column, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(column * 40 + 1, row * 40 + 1, 38, 38);
}

const draw = (event) => {
  const rowIndex = Math.floor(event.offsetY / 40);
  const columnIndex = Math.floor(event.offsetX / 40);
  const arrayIndex = rowIndex * 10 + columnIndex;
  paintField[arrayIndex] = 1;
  const color = paintField[arrayIndex] ? 'green' : 'white';
  drawSquare(rowIndex, columnIndex, color);
}

const clearField = () => {
  paintField.fill(false);
  clearCanvas(ctx)
}

const updateInterface = () => {
  happyBtn.innerText = `=) ${happyCount}`;
  sadBtn.innerText = `=( ${sadCount}`;
}

const storeResult = (value) => {
  trainData.push([[...paintField], value]);
  updateInterface()
}

document.addEventListener('mousedown', () => {
  mouseDown = true;
});

document.addEventListener('mouseup', () => {
  mouseDown = false;
});

canvas.addEventListener('mousemove', (e) => {
  if (!mouseDown) {
    return;
  }
  draw(e);
});

clearBtn.addEventListener('click', () => {
  clearField();
});

happyBtn.addEventListener('click', () => {
  happyCount += 1;
  storeResult([1, 0]);
  clearField();
});

sadBtn.addEventListener('click', () => {
  sadCount += 1;
  storeResult([0, 1]);
  clearField();
});

predictBtn.addEventListener('click', () => {
  NN.input = [...paintField];
  const [happiness, sadness] = NN.prediction;
  alert(`I think it's a ${happiness > sadness ? 'happy' : 'sad'} face!\nHappiness: ${Math.round(happiness * 100)}% Sadness: ${Math.round(sadness * 100)}%`);
});

trainBtn.addEventListener('click', () => {
  NN.train(trainData, 1000).then(() => {
    predictBtn.disabled = false;
    alert('Trained!');
  })
});

clearField();
updateInterface();
