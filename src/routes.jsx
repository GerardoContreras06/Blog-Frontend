import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Article from './pages/Article';
import Courses from './pages/courses/Courses';
import CreateCourse from './pages/courses/CreateCourse';
import EditCourse from './pages/courses/EditCourse';
import CourseDetail from './pages/courses/CourseDetail';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'article/:id', element: <Article /> },
      { path: 'courses', element: <Courses /> },
      { path: 'courses/create', element: <CreateCourse /> },
      { path: 'courses/edit/:id', element: <EditCourse /> },
      { path: 'courses/:id', element: <CourseDetail /> },
    ],
  },
]);

export default router;