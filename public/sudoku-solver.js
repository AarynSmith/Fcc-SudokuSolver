// import { puzzlesAndSolutions } from './puzzle-strings.js';

const textArea = document.getElementById('text-input');
const errorDiv = document.getElementById('error-msg');

const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
const colLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

const RowToIdx = new Map([
  ['A', 0], ['B', 9], ['C', 18],
  ['D', 27], ['E', 36], ['F', 45],
  ['G', 54], ['H', 63], ['I', 72]
]);

const isValidNum = (c) => {
  const n = Number(c)
  if (n >= 1 && n <= 9) return true;
  return false;
};

document.addEventListener('DOMContentLoaded', () => {
  // Load a simple puzzle into the text area
  textArea.value = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
  updateGrid();

});

textArea.addEventListener('change', () => updateGrid());
document.getElementById('clear-button').addEventListener('click', () => {clear()});
document.getElementById('solve-button').addEventListener('click', () => {showSolution(solve())});
const elem = document.getElementsByClassName('sudoku-input');
for (let i = 0; i < elem.length; i++) {
  elem[i].addEventListener('change', (e) => setArea(e.target));
}

function clear() {
  textArea.value = '';
  rowLabels.forEach(r => {
    colLabels.forEach(c => document.getElementById(r + c).value = '');
  });
}

function clearError() {
  errorDiv.innerHTML = '';
}

function setGrid() {
  const puzzleArray = textArea.value.split('');
  rowLabels.forEach(r => {
    colLabels.forEach(c => {
      const cur = puzzleArray.shift();
      if (cur !== '.') {
        if (isValidNum(cur)) document.getElementById(r + c).value = cur
      } else document.getElementById(r + c).value = '';
    })
  })
}

function readGrid() {
  let s = '';
  rowLabels.forEach(r => {
    colLabels.forEach(c => {
      s += document.getElementById(r + c).value || '.';
    });
  });
  return s;
}

function setArea(t) {
  clearError();
  const text = t.value;
  const loc = t.id.split('');
  const idx = (RowToIdx.get(loc[0]) + Number(loc[1])) - 1;
  const puzzleArray = (textArea.value.length === 81 ? textArea.value : readGrid()).split('');
  if (isValidNum(text)) puzzleArray[idx] = t.value;
  else if (text === '') puzzleArray[idx] = '.';
  textArea.value = puzzleArray.join('');
}

function updateGrid() {
  const puzzleString = textArea.value || '.'.repeat(81);
  clearError();
  if (puzzleString.length !== 81) {
    errorDiv.innerHTML = 'Error: Expected puzzle to be 81 characters long.';
    return;
  }
  for (const c of puzzleString) if (c !== '.' && !isValidNum(c)) {
    errorDiv.innerHTML = 'Error: Invalid Puzzle String';
    return;
  }
  setGrid();
}

function checkSolution(puzzle) {
  puzzle = getPuzzleArr(puzzle);
  for (let i = 0; i < 9; i++) {
    if (!checkArea(ArrRow(puzzle, i))) return false;
    if (!checkArea(ArrCol(puzzle, i))) return false;
    if (!checkArea(ArrSec(puzzle, i))) return false;
  }
  return true;
}

const getPuzzleArr = (s) => {
  if (typeof s === 'object') return s;
  s = s || textArea.value;
  const ar = s.split('');
  const p = [];
  while (ar.length > 0) p.push(ar.splice(0, 9));
  return p;
}
// const getPuzzleStr = (a) => a.reduce((a, v) => a + v.join(''), '')

const ArrRow = (a, i) => a[i];
const ArrCol = (a, i) => a.map(v => v[i]);
const ArrSec = (a, i) => {
  const r = Math.floor(i / 3) * 3;
  const c = (i % 3) * 3;
  return [
    a[r][c], a[r][c + 1], a[r][c + 2],
    a[r + 1][c], a[r + 1][c + 1], a[r + 1][c + 2],
    a[r + 2][c], a[r + 2][c + 1], a[r + 2][c + 2],
  ]
}

const checkArea = (area) => [...area].map(Number).sort()
  .reduce((a, v, i) => a && v - 1 === i, true);

function solve(puzzle) {
  puzzle = getPuzzleArr(puzzle);
  while (!checkSolution(puzzle)) {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const s = (Math.floor(r / 3) * 3) + Math.floor(c / 3);
        if (puzzle[r][c] === '.') {
          const poss = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          ArrRow(puzzle, r).filter(v => v !== '.').forEach(v => poss.delete(Number(v)))
          ArrCol(puzzle, c).filter(v => v !== '.').forEach(v => poss.delete(Number(v)))
          ArrSec(puzzle, s).filter(v => v !== '.').forEach(v => poss.delete(Number(v)))
          if (poss.size === 1) puzzle[r][c] = [...poss].pop();
        }
      }
    }
  }
  return puzzle.reduce((a, v) => a + v.join(''), '');
}

function showSolution(t) {
  document.getElementById('text-input').value = t;
  updateGrid();
}

/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {
    isValidNum,
    updateGrid,
    checkSolution,
    solve,
  }
} catch (e) {}
