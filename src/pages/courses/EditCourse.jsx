import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CourseForm from '../../../components/course/CourseForm';
import { getCoursesByName, updateCourse } from '../../../services/course.service';

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { courses } = await getCoursesByName('');
        const course = courses.find(c => c._id === id);
        if (course) {
          setInitialData(course);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };

    fetchCourse();
  }, [id]);

  const handleSubmit = async (courseData) => {
    try {
      await updateCourse(id, courseData);
      navigate('/courses');
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  return (
    <div className="main-content">
      <div className="content">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6">Editar Curso</h1>
          {initialData._id && (
            <CourseForm 
              initialData={initialData} 
              onSubmit={handleSubmit} 
              isEditing={true} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditCourse;