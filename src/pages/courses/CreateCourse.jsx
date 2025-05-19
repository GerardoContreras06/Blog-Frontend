import React from 'react';
import CourseForm from '../../../components/course/CourseForm';
import { createCourse } from '../../../services/course.service';
import { useNavigate } from 'react-router-dom';

const CreateCourse = () => {
  const navigate = useNavigate();

  const handleSubmit = async (courseData) => {
    try {
      await createCourse(courseData);
      navigate('/courses');
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  return (
    <div className="main-content">
      <div className="content">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6">Crear Nuevo Curso</h1>
          <CourseForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;