'use strict';

const chai = require('chai');
const assert = chai.assert;
const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const sample = require('../public/puzzle-strings');

let Solver;

suite('Unit Tests', () => {
  suiteSetup(() => {
    // Mock the DOM for testing and load Solver
    return JSDOM.fromFile('./views/index.html')
      .then((dom) => {
        global.window = dom.window;
        global.document = dom.window.document;

        Solver = require('../public/sudoku-solver.js');
      });
  });

  // Only the digits 1-9 are accepted
  // as valid input for the puzzle grid
  suite('Function isValidChar()', () => {
    test('Valid "1-9" characters', (done) => {
      const input = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
      input.forEach(c => assert.isTrue(Solver.isValidNum(c)));
      done();
    });

    // Invalid characters or numbers are not accepted 
    // as valid input for the puzzle grid
    test('Invalid characters (anything other than "1-9") are not accepted', (done) => {
      const input = ['!', 'a', '/', '+', '-', '0', '10', 0, '.'];
      input.forEach(c => assert.isNotTrue(Solver.isValidNum(c)));
      done();
    });
  });

  suite('Function updateGrid()', () => {
    test('Parses a valid puzzle string into an object', done => {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

      document.getElementById('text-input').value = input;
      Solver.updateGrid();

      let idx = 0;
      const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
      const colLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
      rowLabels.forEach(r => {
        colLabels.forEach(c => {
          assert.equal(document.getElementById(r + c).value ? document.getElementById(r + c).value : '.', input[idx]);
          idx++
        });
      });
      done();
    });

    // Puzzles that are not 81 numbers/periods long show the message 
    // "Error: Expected puzzle to be 81 characters long." in the
    // `div` with the id "error-msg"
    test('Shows an error for puzzles that are not 81 numbers long', done => {
      const shortStr = '83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const longStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6...';
      const errorMsg = 'Error: Expected puzzle to be 81 characters long.';
      const errorDiv = document.getElementById('error-msg');

      document.getElementById('text-input').value = shortStr;
      Solver.updateGrid();
      assert.equal(errorDiv.innerHTML, errorMsg);

      document.getElementById('text-input').value = longStr;
      Solver.updateGrid();
      assert.equal(errorDiv.innerHTML, errorMsg);
      done();
    });
  });

  suite('Function checkSolution()', () => {
    // Valid complete puzzles pass
    test('Valid puzzles pass', done => {
      const input = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
      document.getElementById('text-input').value = input;
      Solver.updateGrid();
      assert.isTrue(Solver.checkSolution());
      done();
    });

    // Invalid complete puzzles fail
    test('Invalid puzzles fail', done => {
      const badRow = '779235418851496372432178956174569283395842761628713549283657194516924837947381625';
      const badCol = '769235418751496382432178956174569283395842761628713549283657194516924837947381625';
      const badRegion = '123456789234567891345678912456789123567891234678912345789123456891234567912345678';
      document.getElementById('text-input').value = badRow;
      Solver.updateGrid();
      assert.isFalse(Solver.checkSolution(), "Rows should all be unique");
      document.getElementById('text-input').value = badCol;
      Solver.updateGrid();
      assert.isFalse(Solver.checkSolution(), 'Columns should be unique');
      document.getElementById('text-input').value = badRegion;
      Solver.updateGrid();
      assert.isFalse(Solver.checkSolution(), 'Regions should be unique');
      done();
    });
  });


  suite('Function solve()', () => {
    // Returns the expected solution for a valid, incomplete puzzle
    test('Returns the expected solution for an incomplete puzzle', done => {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      assert.isTrue(Solver.checkSolution(Solver.solve(input)));
      done();
    });

    test('Test provided puzzle strings', done => {
      sample.puzzlesAndSolutions.forEach(([start, solved]) =>
        assert.equal(Solver.solve(start), solved));
      done();
    })
  });
});