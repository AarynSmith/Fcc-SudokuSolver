/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chai = require("chai");
const assert = chai.assert;

// const jsdom = require("jsdom");
// const {JSDOM} = jsdom;
let Solver;

const getCell = (id) => document.getElementById(id);

suite('Functional Tests', () => {
  suiteSetup(() => {
    // DOM already mocked -- load sudoku solver then run tests
    Solver = require('../public/sudoku-solver.js');
  });

  suite('Text area and sudoku grid update automatically', () => {
    // Entering a valid number in the text area populates 
    // the correct cell in the sudoku grid with that number
    test('Valid number in text area populates correct cell in grid', done => {
      const inp = document.getElementById('text-input');
      inp.value = '.5..........1...........3.......6...2................7..4.............8.....9....';
      inp.dispatchEvent(new window.Event('change'));
      assert.equal(getCell('A2').value, '5');
      assert.equal(getCell('B4').value, '1');
      assert.equal(getCell('C7').value, '3');
      assert.equal(getCell('D6').value, '6');
      assert.equal(getCell('E1').value, '2');
      assert.equal(getCell('F9').value, '7');
      assert.equal(getCell('G3').value, '4');
      assert.equal(getCell('H8').value, '8');
      assert.equal(getCell('I5').value, '9');
      done();
    });

    // Entering a valid number in the grid automatically updates
    // the puzzle string in the text area
    test('Valid number in grid updates the puzzle string in the text area', done => {
      const inp = document.getElementById('text-input');
      document.getElementById('clear-button').click();
      getCell('A3').value = '1';
      getCell('A3').dispatchEvent(new window.Event('change'));
      assert.equal(inp.value, '..1..............................................................................');
      done();
    });
  });

  suite('Clear and solve buttons', () => {
    // Pressing the "Clear" button clears the sudoku 
    // grid and the text area
    test('Function clearInput()', done => {
      document.getElementById('text-input').value = '1'.repeat(81);
      Solver.updateGrid();
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'].forEach(r => {
        [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(c => {
          assert.equal(document.getElementById(r + c).value, '1', 'Grid cells should be 1\'s');
        })
      })
      assert.equal(document.getElementById('text-input').value, '1'.repeat(81), 'Text area should be all ones');

      document.getElementById('clear-button').click();

      assert.equal(document.getElementById('text-input').value, '', 'Text area should be blank');
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'].forEach(r => {
        [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(c => {
          assert.equal(document.getElementById(r + c).value, '', 'Grid cells should be empty');
        })
      })
      done();
    });

    // Pressing the "Solve" button solves the puzzle and
    // fills in the grid with the solution
    test('Function showSolution(solve(input))', done => {
      document.getElementById('text-input').value = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      Solver.updateGrid();
      document.getElementById('solve-button').click();
      assert.isTrue(Solver.checkSolution());
      done();
    });
  });
});

