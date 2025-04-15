const asyncHandler = require('express-async-handler');
const Teacher = require('../models/Teacher');

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Public
const getTeachers = asyncHandler(async (req, res) => {
  const teachers = await Teacher.find({});
  res.status(200).json(teachers);
});

// @desc    Get a single teacher
// @route   GET /api/teachers/:id
// @access  Public
const getTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  
  if (!teacher) {
    res.status(404);
    throw new Error('Teacher not found');
  }
  
  res.status(200).json(teacher);
});

// @desc    Create a teacher
// @route   POST /api/teachers
// @access  Public
const createTeacher = asyncHandler(async (req, res) => {
  const { teacherName, mobile, schoolName } = req.body;
  
  // Check if all required fields are provided
  if (!teacherName || !mobile || !schoolName) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }
  
  // Check if teacher with same mobile already exists
  const teacherExists = await Teacher.findOne({ mobile });
  
  if (teacherExists) {
    res.status(400);
    throw new Error('Teacher with this mobile number already exists');
  }
  
  // Create teacher
  const teacher = await Teacher.create({
    teacherName,
    mobile,
    schoolName
  });
  
  if (teacher) {
    res.status(201).json({
      _id: teacher._id,
      teacherName: teacher.teacherName,
      mobile: teacher.mobile,
      schoolName: teacher.schoolName
    });
  } else {
    res.status(400);
    throw new Error('Invalid teacher data');
  }
});

// @desc    Update a teacher
// @route   PUT /api/teachers/:id
// @access  Public
const updateTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  
  if (!teacher) {
    res.status(404);
    throw new Error('Teacher not found');
  }
  
  const updatedTeacher = await Teacher.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  res.status(200).json(updatedTeacher);
});

// @desc    Delete a teacher
// @route   DELETE /api/teachers/:id
// @access  Public
const deleteTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  
  if (!teacher) {
    res.status(404);
    throw new Error('Teacher not found');
  }
  
  await teacher.deleteOne();
  
  res.status(200).json({ id: req.params.id, message: 'Teacher removed' });
});

module.exports = {
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher
};