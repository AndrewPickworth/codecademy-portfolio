// ===================================================================
// DO NOT MODIFY THE CODE BELOW - Call or reference them in your code as needed
// ===================================================================

// Takes in a number and updates the readonly display input
function updateDisplay(value) {
  const display = document.getElementById("display");
  display.value = value;
}

// Gets the value from the readonly display input
// Returns a number
// Doesn't need to be used but can help you verify
// the current value on the display
function getDisplay() {
  const display = document.getElementById("display");
  //parseFloat changes the string into a number we can use
  return display.value;
}

//Set up display to show zero when starting
//updateDisplay(0);

console.log("Initial value of display: ", getDisplay());

// ===================================================================
// DO NOT MODIFY THE CODE Above - Call or reference them in your code as needed
// ===================================================================

/**
 * Main input handler called from HTML buttons
 * This function receives ALL button clicks and routes them to the appropriate handler
 * @param {string} input - The input value from button clicks
 *
 * HINT: This function should:
 * 1. Check if input is a number (0-9) and handle number input
 * 2. Check if input is an operator (+, -, *, /) and handle operator input
 * 3. Check if input is a decimal point (.) and handle decimal input( )
 * 4. Check if input is equals (=) and execute the operation
 * 5. Check if input is clear (C) and reset the calculator
 * 6. Don't forget to call updateDisplay() at the end to refresh the screen!
 */
let firstNumber = "";
let secondNumber = "";
let currentOperator = "";
let result = "";

const Status = Object.freeze({
  FIRST_INPUT: "First Input",
  SECOND_INPUT: "Second Input",
  OPERATOR: "Operator",
  RESULT: "Result",
});

let currentStatus = Status.FIRST_INPUT;

function handleInput(input) {
  console.log(`Button clicked: ${input}`);
  // Your code here
  // Use if statements to check what type of input was received
  // Then call the appropriate helper function
  // you may need to use parseFloat

  if(!isNaN(input) && input >= 0 && input <= 9) {
    playCowSounds();
    handleNumber(input);
  } else if (["+", "-", "*", "/"].includes(input)) {
    playCowSounds();
    handleOperator(input);
  } else if (input === ".") {
    playCowSounds();
    handleDecimal();
  } else if (input === "=") {
    playCowBell();
    executeOperation();
  } else if (input === "CE") {
    clearEntry();
  }
  else if (input === "C") {
    resetCalculator();
  }
  constructDisplayValue();

  // Don't forget to call updateDisplay() at the end!
}



// TODO: Create your arithmetic operation functions here
// You will need: add, subtract, multiply, and divide functions
// Each should take two parameters (first, second) and return the result
// Don't forget to add console.log statements for debugging!
// Remember: division should check for division by zero and return "Error"

const add = (a,b) => parseFloat(a) + parseFloat(b);
const subtract = (a,b) => parseFloat(a) - parseFloat(b);
const multiply = (a,b) => parseFloat(a) * parseFloat(b);
const divide = (a,b) => {
  if (parseFloat(b) === 0) {
    return "Error";
  }
  return parseFloat(a) / parseFloat(b);
};


/**
 * Handles number input (0-9)
 * @param {string} number - The number that was clicked
 */
function handleNumber(number) {
  // Your code here
  // This function should update the displayValue
  // Consider: Are we starting fresh? Continuing a number?
  if (currentStatus === Status.RESULT) {
    firstNumber = "";
    secondNumber = "";
    currentOperator = "";
    result = "";
    currentStatus = Status.FIRST_INPUT;
  }
  if (currentStatus === Status.FIRST_INPUT) {
    firstNumber += number;
  } else if (currentStatus === Status.OPERATOR || currentStatus === Status.SECOND_INPUT) {
    secondNumber += number;
    currentStatus = Status.SECOND_INPUT;
  }
}

/**
 * Handles decimal point input
 */
function handleDecimal() {
  // Your code here
  // Make sure you don't add multiple decimal points to one number
  if (currentStatus === Status.FIRST_INPUT) {
    if (firstNumber === "") firstNumber = "0";
    if (!firstNumber.includes(".")) {
      firstNumber += ".";
    }
  } else if (currentStatus === Status.OPERATOR || currentStatus === Status.SECOND_INPUT) {
    if (secondNumber === "") secondNumber = "0";
    if (!secondNumber.includes(".")) {
      secondNumber += ".";
    }
  }
}

/**
 * Handles operator input (+, -, *, /)
 * @param {string} nextOperator - The operator that was clicked
 */
function handleOperator(nextOperator) {
  // Your code here
  // Store the first number and operator
  // Prepare for the second number input

  if (firstNumber.slice(-1) === ".") firstNumber += "0";
  if (secondNumber.slice(-1) === ".") secondNumber += "0";
  if (firstNumber === "") return;
  if (currentStatus === Status.SECOND_INPUT) return;

  if (currentStatus === Status.RESULT) {
    firstNumber = String(result);
    secondNumber = "";
    currentOperator = "";
    result = "";
  }

  currentOperator = nextOperator;
  currentStatus = Status.OPERATOR;
}

/**
 * Executes the calculation when = is pressed
 */
function executeOperation() {
  // Your code here
  // Use if/else statements to call the right operation function
  // Handle the result and any errors
  if (firstNumber !== "" && secondNumber !== "" && currentOperator !== "") {
    let a = firstNumber;
    if (result !== "") {
      a = result;
    }
    switch (currentOperator) {
      case "+":
        result = add(a, secondNumber);
        break;
      case "-":
        result = subtract(a, secondNumber);
        break;
      case "*":
        result = multiply(a, secondNumber);
        break;
      case "/":
        result = divide(a, secondNumber);
        break;
    }
  }
  currentStatus = Status.RESULT;
}

function clearEntry() {
  if (result !== "") {
    firstNumber = String(result - secondNumber)
    result = "";
    currentStatus = Status.SECOND_INPUT;
  } else if (currentStatus === Status.FIRST_INPUT) {
    firstNumber = firstNumber.slice(0, -1);
  } else if (currentStatus === Status.SECOND_INPUT) {
    secondNumber = secondNumber.slice(0, -1);
    if (secondNumber === "") {
      currentStatus = Status.OPERATOR;
    }
  } else if (currentStatus === Status.OPERATOR) {
    currentOperator = "";
    currentStatus = Status.FIRST_INPUT;
  }
}

function constructDisplayValue() {
  if (result !== "") {
    updateDisplay(result);
  } else {
    updateDisplay(String(firstNumber) + String(currentOperator) + String(secondNumber));
  }
}

/**
 * Resets the calculator (C button)
 */
function resetCalculator() {
  // Your code here
  // Reset all state variables and display
  firstNumber = "";
  secondNumber = "";
  currentOperator = "";
  currentStatus = Status.FIRST_INPUT;
  result = "";
}

let cowSoundIndex = 0;

function playCowSounds() {
  let index = cowSoundIndex % 5 + 1;
  cowSoundIndex++;
  const audio = new Audio(`Cow${index}.mp3`);
  audio.play();
}

function playCowBell() {
  const audio = new Audio("CowBell.mp3");
  audio.play();
}