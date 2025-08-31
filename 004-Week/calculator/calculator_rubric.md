# JavaScript Calculator Project - Assessment Rubric

### **Must Have (Required for Passing):**

**Implementation Requirements**

- [ ] Implement handleInput() function to route all button clicks (C, =, numbers, operators)
- [ ] Create four arithmetic functions: add(), subtract(), multiply(), divide()
- [ ] Implement handleNumber() to process number input (0-9) with state management
- [ ] Implement handleOperator() to store operator (+, -, \*, /) and prepare for second number
- [ ] Implement executeOperation() using if/else statements to call correct arithmetic function
- [ ] Implement resetCalculator() to clear all state variables with "C" button
- [ ] Use state variables: firstOperand, operator, shouldResetDisplay
- [ ] Use the functions: setDisplay()
- [ ] Handle one operation at a time
- [ ] Keep functions to a maximum of 50 lines of code.

**Logs and Debugging:**

- [ ] Use console.log for successful operations
- [ ] Use at least one console.error
- [ ] Use at least one console.warn

### Functional Requirements

- No JavaScript errors in browser console
- Calculator performs one operation at a time
- Can successfully add, multiply, subtract, and divide
- Clear button resets calculator state
- Display shows current number or result
- Addition works
- Subtraction works
- Multiplication works
- Division works

### **Could Have (Bonus Points):**

- Implement handleDecimal() for decimal point input
- CE button functionality (Clear Entry)
- Add floating point calculations
- Prevention of multiple decimal points
- Using equals will repeat the calculation again
  (10 - 1 = 9, hitting equals again returns 8, hitting equals again returns 7)
