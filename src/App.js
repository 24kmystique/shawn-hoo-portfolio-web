import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

import './App.css';
import About from './Components/About.js';
import Book from './Components/Book.js';
import BlogPage from './Components/blog/BlogPage.js';
import ContactPage from './Components/contact/ContactPage.js';
import HomePage from './Components/HomePage.js';
import PublicationsPage from './Components/PublicationsPage';
import BlogPageAdmin from './Components/blog/blogAdmin/BlogPageAdmin.js';
import AboutAdmin from "./Components/adminComponents/about_Admin_folder/AboutAdmin";
import ContactAdmin from "./Components/adminComponents/contact_Admin_folder/ContactAdmin";
import PublicationsPageAdmin from "./Components/adminComponents/publications_Admin_folder/PublicationsPageAdmin";
import ProtectedLayout from './Components/ProtectedLayout';

import { useState, useEffect } from 'react'
import { motion } from "framer-motion"
import BookAdmin from "./Components/adminComponents/book_Admin_folder/BookAdmin";

function App() {

  let [bookAll,setBookAll] = useState("");
  let [bookTitle,setBookTitle] = useState("");

  const windowSize = useWindowSize()
  const viewWidth = windowSize.width

  const [navClicked, setNavClicked] = useState(false)

  const navVariant = {
    hidden: {
      x:-1000,
      transition: { ease: "easeOut", duration: 0.8 }
    },
    visible: {
      x:0,
      transition: { ease: "easeIn", duration: 0.8 }
    }
  }

  useEffect(() => {
    const getPosts = async() => {
    const postsFromServer = await fetchPosts();
    setBookAll(postsFromServer);
    setBookTitle(postsFromServer[0].title.toLowerCase());
    
    }
    getPosts();

},[])
      //----------------------database stuff------------------------------------------------
      const fetchPosts = async() => {
        const res = await fetch('http://localhost:5000/books');
        const data = await res.json();
        return data;
    }

    // console.log(bookAll[0].title);

  return (
    <BrowserRouter>
      <div className="App">
        {(viewWidth > 480) ? (
          <nav className='nav-bar'>
          <div className='nav-logo'>
            <NavLink to='/' className="logo">shawn hoo</NavLink>
          </div>
          <ul className='nav-links'>
            <div className='nav-menu'>
              <li><NavLink to='/about' className={({isActive}) => isActive ? "active" : undefined}>about</NavLink></li>
              {/* <li><NavLink to='/of-the-florids' className={({isActive}) => isActive ? "active" : undefined}>{bookAll.length>1?"books":bookTitle}</NavLink></li> */}
              <li><NavLink to='/books' className={({isActive}) => isActive ? "active" : undefined}>{bookAll.length>1?"books":bookTitle}</NavLink></li>
              <li><NavLink to='/publications' className={({isActive}) => isActive ? "active" : undefined}>publications</NavLink></li>
              <li><NavLink to='/blog' className={({isActive}) => isActive ? "active" : undefined}>blog</NavLink></li>
              <li><NavLink to='/contact' className={({isActive}) => isActive ? "active" : undefined}>contact</NavLink></li>
            </div>
          </ul>
        </nav>
        ) : (
          <nav className='nav-bar-small'>
            <div className="nav-bar-main-small" onClick={() => {setNavClicked(!navClicked)}}>
              <NavLink to='/' className="nav-bar-small-logo">shawn hoo</NavLink>
            </div>

            <ul className='nav-links-small'>
              <motion.div 
              className='nav-menu-small'
              variants={navVariant}
              initial="hidden"
              animate={navClicked ? "visible" : "hidden"}
              >
                <li><NavLink to='/about' className={({isActive}) => isActive ? "active" : undefined}>about</NavLink></li>
                {/* <li><NavLink to='/of-the-florids' className={({isActive}) => isActive ? "active" : undefined}>of the florids</NavLink></li> */}
                {/* <li><NavLink to='/of-the-florids' className={({isActive}) => isActive ? "active" : undefined}>{bookAll.length>1?"books":bookTitle}</NavLink></li> */}
                <li><NavLink to='/books' className={({isActive}) => isActive ? "active" : undefined}>{bookAll.length>1?"books":bookTitle}</NavLink></li>
                <li><NavLink to='/publications' className={({isActive}) => isActive ? "active" : undefined}>publications</NavLink></li>
                <li><NavLink to='/blog' className={({isActive}) => isActive ? "active" : undefined}>blog</NavLink></li>
                <li><NavLink to='/contact' className={({isActive}) => isActive ? "active" : undefined}>contact</NavLink></li>
              </motion.div>
            </ul>
          </nav>
        )}
        
        
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/about' element={<About />} />
          {/* <Route path='/of-the-florids' element={<Book />} /> */}
          <Route path='/books' element={<Book />} />
          <Route path='/blog' element={<BlogPage />} />
          <Route path='/contact' element={<ContactPage />} />
          <Route path='/publications' element={<PublicationsPage />} />
          
          <Route path='/admin' element={<ProtectedLayout />} >
            <Route path='about' element={<AboutAdmin />} />
            <Route path='publications' element={<PublicationsPageAdmin />} />
            <Route path='blog' element={<BlogPageAdmin />} />
            <Route path='contact' element={<ContactAdmin />} />
            {/* <Route path='of-the-florids' element={<BookAdmin />} /> */}
            <Route path='books' element={<BookAdmin />} />
          </Route>

        </Routes>
      </div>
    </BrowserRouter>

  );
}

// Hook
function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

export default App;
