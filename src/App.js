import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

import './App.css';
import About from './Components/About.js';
import BookPage from './Components/BookPage.js';
import BlogPage from './Components/blog/BlogPage.js';
import ContactPage from './Components/contact/ContactPage.js';
import HomePage from './Components/HomePage.js';
import PublicationsPage from './Components/PublicationsPage';
import BlogPageAdmin from './Components/blog/blogAdmin/BlogPageAdmin.js';
import AboutAdmin from "./Components/adminComponents/about_Admin_folder/AboutAdmin";
import ContactAdmin from "./Components/adminComponents/contact_Admin_folder/ContactAdmin";
import PublicationsPageAdmin from "./Components/adminComponents/publications_Admin_folder/PublicationsPageAdmin";

import BookAdmin from "./Components/adminComponents/book_Admin_folder/BookAdmin";
import MediumNavMenu from "./Components/navMenu/mediumNavMenu";
import SmallNavMenu from "./Components/navMenu/smallNavMenu";
import MediumNavMenuAdmin from "./Components/adminComponents/navMenu_Admin_folder/MediumNavMenuAdmin";
import SmallNavMenuAdmin from "./Components/adminComponents/navMenu_Admin_folder/SmallNavMenuAdmin";
import LoginPage from "./Components/adminComponents/LoginPage";


import CreateDynamicBlog from './Components/blog/CreateDynamicBlog.js';
import InformationDataService from "./Services/InformationDataService";

function App() {
  const { isLoading, isAuthenticated } = useAuth0();
  let [bookAll,setBookAll] = useState("");
  let [bookTitle,setBookTitle] = useState("");
  let [blogPosts, setblogPosts] = useState("");

  const windowSize = useWindowSize();
  const viewWidth = windowSize.width;

  const [navClicked, setNavClicked] = useState(false)

  const navVariant = {
    hidden: {
      x:-600,
      opacity: 0,
      transition: { ease: "easeOut", duration: 0.8 }
    },
    visible: {
      x:0,
      opacity: 1,
      transition: { ease: "easeIn", duration: 0.8 }
    }
  }

  useEffect(() => {

    getBookPost();
    getBlogPost();

  },[])

  //----------------------database stuff------------------------------------------------
  const getBookPost = async() =>{
    InformationDataService.getBookPost()
    .then(response => {
      setBookAll(response.data);
      setBookTitle(response.data[0].title.toLowerCase());
        console.log(response.data[0]._id);
    })
    .catch(e => {
        console.log(e)
    });
}
const getBlogPost = async() =>{
  InformationDataService.getBlogPost()
  .then(response => {
    setblogPosts(response.data);
      console.log(response.data[0]._id);
  })
  .catch(e => {
      console.log(e)
  });
}


  if (isLoading) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', height: '100vh'}}>
          <span style={{fontFamily: 'Inter', fontWeight: 'bold'}}>loading...</span>
      </div>
    );
  }

  if (isAuthenticated && window.location.pathname.includes("admin")) {
    return (
      <BrowserRouter>
        {(viewWidth > 480) ? 
          <MediumNavMenuAdmin bookLength={bookAll.length} bookTitle={bookTitle} /> : 
          <SmallNavMenuAdmin bookLength={bookAll.length} bookTitle={bookTitle} /> 
        }
        <div className="App">
          <Routes>
            <Route path='/admin' element={<HomePage />} />
            <Route path='/admin/about' element={<AboutAdmin />} />
            <Route path='/admin/books' element={<BookAdmin />} />
            <Route path='/admin/publications' element={<PublicationsPageAdmin />} />
            <Route path='/admin/blog' element={<BlogPageAdmin />} />
            <Route path='/admin/contact' element={<ContactAdmin />} />
          </Routes>
        </div>
      </BrowserRouter>
    )
  }
  else {
    return (
      <BrowserRouter>
        {(viewWidth > 480) ? 
          <MediumNavMenu bookLength={bookAll.length} bookTitle={bookTitle} /> : 
          <SmallNavMenu bookLength={bookAll.length} bookTitle={bookTitle} /> 
        }
        <div className="App">
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/about' element={<About />} />
            <Route path='/books' element={<BookPage />} />
            <Route path='/blog' element={<BlogPage />} />
            {

            blogPosts && blogPosts.map((blogpost) => {
              console.log(`/blog${blogpost.id}`)
              return (
                <Route key={blogpost._id} path={`/blog${blogpost._id}`} element={<CreateDynamicBlog content={blogpost}/>} />
              )
            })}
            <Route path='/contact' element={<ContactPage />} />
            <Route path='/publications' element={<PublicationsPage />} />
            <Route path='/login' element={<LoginPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }


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
    };

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
