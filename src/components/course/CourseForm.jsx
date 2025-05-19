import React, { useState } from 'react';

const CourseForm = ({ initialData = {}, onSubmit, isEditing = false }) => {
  const [formData, setFormData] = useState({
    nameCourse: initialData.nameCourse || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nameCourse" className="block text-sm font-medium text-gray-700">
          Nombre del Curso
        </label>
        <input
          type="text"
          id="nameCourse"
          name="nameCourse"
          value={formData.nameCourse}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          maxLength="25"
          required
        />
        <p className="mt-1 text-sm text-gray-500">Máximo 25 caracteres</p>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
      >
        {isEditing ? 'Actualizar Curso' : 'Crear Curso'}
      </button>
    </form>
  );
};

export default CourseForm;