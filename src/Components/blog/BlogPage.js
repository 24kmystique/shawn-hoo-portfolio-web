import React from 'react'
import BlogPost from './BlogPost'
import './BlogPage.css';
import { useState, useEffect } from 'react';
import InformationDataService from '../../Services/InformationDataService';

// this is the main page for blog
function BlogPage() {

  let [blogRecords,setBlogRecords] = useState("");
  useEffect(() => {


    getPosts();
  },[])


  const getPosts = async() =>{
    InformationDataService.getBlogPost()
    .then(response => {
      console.log(response.data[0]._id);
      setBlogRecords(response.data);
    })
    .catch(e => {
        console.log(e)
    });
}

  let blogPosts = blogRecords && blogRecords.slice(0).reverse().map((post,index) => <BlogPost key={index} blogId={post._id} instanceID = {index} imageUrl = {post.imageUrl} recordHeader = {post.header} bodyPara = {post.bodyPara} recordDate = {post.date} recordTags = {post.tags} />)
  

  return (
    <div className='blogPageOuter'>
      {blogPosts}
      {/* <BlogPost key={0} instanceID = {0} recordHeader = {"SealyHeaderChallenge"} bodyPara = {"testing"} recordDate = {"2022"} recordTags = {["poetry","poetry2"]} /> */}
    </div>
    
  )
}

export default BlogPage
