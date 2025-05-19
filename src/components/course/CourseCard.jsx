import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">
          <Link to={`/courses/${course._id}`} className="hover:text-primary">
            {course.nameCourse}
          </Link>
        </h3>
        <div className="flex justify-between items-center mt-4">
          <span className={`px-2 py-1 text-xs rounded-full ${
            course.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {course.estado ? 'Activo' : 'Inactivo'}
          </span>
          <div className="space-x-2">
            <Link
              to={`/courses/edit/${course._id}`}
              className="text-sm text-primary hover:underline"
            >
              Editar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;