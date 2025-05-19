import React, { useEffect, useState } from 'react';
import { getCoursesByName } from '../../services/course.service';
import CourseList from '../../components/course/CourseList';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { courses } = await getCoursesByName(searchTerm);
        setCourses(courses);
      } catch (error) {
        console.error('Error loading courses:', error);
      }
    };

    fetchCourses();
  }, [searchTerm]);

  return (
    <div className="main-content">
      <div className="content">
        <CourseList 
          courses={courses} 
          onSearch={(term) => setSearchTerm(term)} 
        />
      </div>
    </div>
  );
};

export default Courses;