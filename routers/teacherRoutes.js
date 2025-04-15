const express = require('express');
const router = express.Router();
const {
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher
} = require('../controllers/teacherController');

// Routes for /api/teachers
router.route('/')
  .get(getTeachers)
  .post(createTeacher);

// Routes for /api/teachers/:id
router.route('/:id')
  .get(getTeacher)
  .put(updateTeacher)
  .delete(deleteTeacher);

module.exports = router;