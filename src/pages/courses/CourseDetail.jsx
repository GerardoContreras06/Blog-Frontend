import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCoursesByName } from '../../../services/course.service';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { courses } = await getCoursesByName('');
        const foundCourse = courses.find(c => c._id === id);
        setCourse(foundCourse);
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };

    fetchCourse();
  }, [id]);

  if (!course) return <div>Cargando...</div>;

  return (
    <div className="main-content">
      <div className="content">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold">{course.nameCourse}</h1>
              <div className="flex items-center mt-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  course.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {course.estado ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;