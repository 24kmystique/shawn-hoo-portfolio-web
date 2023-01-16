import React from 'react';
// import blogRecords from '../blogRecords.json'
import BlogPostAdmin from './BlogPostAdmin.js';
import './BlogAdmin.css';
import { useState, useEffect } from 'react';
import AddPostHeader from './AddPostHeader.js';
import InformationDataService from '../../../Services/InformationDataService.js';

function BlogPageAdmin() {
  let blogPostsAdmin;
  let [blogRecords,setBlogRecords] = useState([]);
  useEffect(() => {

    getPosts();

  },[blogRecords.length])

  // Fetch blogPosts from backend
  const getPosts = async() =>{
    InformationDataService.getBlogPost()
    .then(response => {
      setBlogRecords(response.data.slice(0).reverse());
    })
    .catch(e => {
        console.log(e)
    });
  }

  return (
    <div className='blogPageAdminOuter'>
      {/* {blogPostsAdmin} */}
      <AddPostHeader blogRecords = {blogRecords} setBlogRecords = {setBlogRecords}/>
      {blogRecords && blogRecords.map((post,index) => <BlogPostAdmin key={post._id} itemIdx = {index} instanceID = {post._id} recordHeader = {post.header} bodyPara = {post.bodyPara} recordDate = {post.date} recordTags = {post.tags} blogRecords = {blogRecords} setBlogRecords = {setBlogRecords}/>)}
    </div>
  )
}

export default BlogPageAdmin
