import React from 'react'
import { useState, useEffect } from 'react';
import twitLogo from './contactImages/twitter_logo.jpg';
import indeedLogo from './contactImages/indeed_logo.jpg';
import msgLogo from './contactImages/msg_logo.jpg';
import InformationDataService from '../../Services/InformationDataService';

function ContactPageLeft() {
  let [contactContent,setContactContent] = useState("");

  useEffect(() => {
    // const getPosts = async() => {
    //   const postsFromServer = await fetchPosts();
    // setContactContent(postsFromServer[0].content);
    // }

    getPosts();

  },[])

//----------------------database stuff------------------------------------------------
  // const fetchPosts = async() => {
  //   const res = await fetch('http://localhost:5000/contact');
  //   const data = await res.json();
  //   return data;
  // }

  const getPosts = async() =>{
    InformationDataService.getContactPost()
    .then(response => {
        setContactContent(response.data[0].content.replace(/\\n/g,'\n'));
        console.log(response.data[0]._id);
    })
    .catch(e => {
        console.log(e)
    });
}

  return (
    <div className='contactPageLeft'>
        <div className='contactPageDesc'>
          <p>{contactContent}</p>
        </div>
        <div className='contactPageIcons'>
            <img className='twitlogo' src={twitLogo} alt="TwitterLogo" />
            <img className='indeedlogo' src={indeedLogo} alt="IndeedLogo" />
            <img className='msglogo' src={msgLogo} alt="MessagegLogo" />
        
        </div>
    </div>
  )
}

export default ContactPageLeft
