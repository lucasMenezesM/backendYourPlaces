import { checkSchema } from "express-validator";

//value for empty validation
const notEmpty = (errorMsg) => {
  const validation = {
    custom: {
      options: (value) => {
        const trimmedValue = value.trim();
        return trimmedValue !== "";
      },
      errorMessage: errorMsg,
    },
  };

  return validation;
};

// VALIDATION FOR CREATE A NEW PLACE
const createPlaceValidation = checkSchema({
  title: notEmpty("Title should not be empty"),
  description: notEmpty("Description should not be empty"),
  address: notEmpty("Address should not be empty"),
});

// VALIDATION FOR UPDATE A PLACE
const updatePlaceValidation = checkSchema({
  title: notEmpty("Title should not be empty"),
  description: notEmpty("Description should not be empty"),
});

// VALIDATION FOR SIGN UP A NEW USER
const signupValidation = checkSchema({
  name: notEmpty("Name should not be empty"),
  email: {
    // normalizeEmail: true,
    isEmail: {
      errorMessage: "invalid email",
    },
  },
  password: {
    isLength: {
      options: { min: 6 },
      errorMessage: "Password should have at least 6 characters",
    },
  },
});

export { createPlaceValidation, signupValidation, updatePlaceValidation };
