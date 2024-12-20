const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
  }),
});

// 1. The clothing item body when an item is created
// The item name is a required string of between 2 and 30 characters.
// An image URL is a required string in a URL format.

// 2.The user info body when a user is created
// The user name is a string of between 2 and 30 characters.
// The user avatar is a required string in a URL format.
// Email is a required string in a valid email format.
// Password is a required string.

// 3. Authentication when a user logs in
// Email is a required string in a valid email format.
// Password is a required string.

//  4. User and clothing item IDs when they are accessed
// IDs must be a hexadecimal value length of 24 characters.
