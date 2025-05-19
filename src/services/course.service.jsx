import axios from 'axios';

const API_URL = 'http://localhost:3000/LearningBlog/v1/courses';

export const getCoursesByName = async (name) => {
  try {
    const response = await axios.get(`${API_URL}/Name`, {
      params: { name }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const createCourse = async (courseData) => {
  try {
    const response = await axios.post(API_URL, courseData);
    return response.data;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const updateCourse = async (id, courseData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, courseData);
    return response.data;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

export const deleteCourse = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};