const express = require("express");

// Checks if input contains two consecutive special characters
function isConsecSplChar(input) {
  const pattern = /[^A-Za-z0-9\s][^A-Za-z0-9\s]/;

  return pattern.test(input);
}

// Validates if string length is within given range
function isValidString(input, minLength, maxLength) {
  if (input.trim().length < minLength || input.trim().length > maxLength) {
    return false;
  }
  return true;
}

// Returns true if the input is empty or not a string
isEmptyString = (input) => {
  if (typeof input !== "string") return true; // Non-strings are considered "empty"
  return input.trim() === ""; // Check for empty string after trimming
};

// Enforces strong password pattern (min 8 chars, upper, lower, digit, special char)
function isStrongPassword(input) {
  const pattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return pattern.test(input);
}

// Checks if input is a valid integer (positive or negative)
function isInteger(input) {
  const pattern = /^-?\d+$/;
  return pattern.test(input);
}

// Compares two password fields for match
function doPasswordsMatch(input1, input2) {
  return input1 === input2;
}

// Validates if a given date is today or in the future
function isValidDate(inputDate) {
  const currentDate = new Date().toISOString().split("T")[0];

  return inputDate >= currentDate;
}

// Export all utility functions
module.exports = {
  isConsecSplChar,
  isValidString,
  isEmptyString,
  isStrongPassword,
  isInteger,
  doPasswordsMatch,
  isValidDate,
};
