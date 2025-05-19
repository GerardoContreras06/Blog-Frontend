import React from 'react';
import CourseCard from './CourseCard';
import { Link } from 'react-router-dom';

const CourseList = ({ courses, onSearch }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Listado de Cursos</h2>
        <Link to="/courses/create" className="btn btn-primary">
          Crear Nuevo Curso
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar cursos por nombre..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No se encontraron cursos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;