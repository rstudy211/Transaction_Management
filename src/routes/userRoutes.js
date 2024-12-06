const express = require('express');
const userController = require('../controller/userController');
const router = express.Router();

// POST: Create New User
router.post('/create', userController.createUser);

// GET: Get a User
router.get('/:id',userController.getUser);

// GET: Get List of Users
router.get('/',userController.allUsers);


module.exports = router;

