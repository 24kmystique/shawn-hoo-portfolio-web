import React from 'react'
import { useState, useEffect } from 'react';
import PublicationType from './PublicationType'
import './CSS/PublicationsPage.css';
import InformationDataService from '../Services/InformationDataService';

const PublicationsPage = () => {
  // have 1 overall map
  // on mount, split map into 3 diff arrays by category index
  // render 3 different maps into 3 divs for 3 columns
  let [arr1,setArr1] = useState([]);
  let [arr2,setArr2] = useState([]);
  let [arr3,setArr3] = useState([]);

  useEffect(() => {
    // const getPosts = async() => {
    //   const postsFromServer = await fetchPosts();
    //   setArr1(postsFromServer.filter((cat,idx) => idx%3===0));
    //   setArr2(postsFromServer.filter((cat,idx) => idx%3===1));
    //   setArr3(postsFromServer.filter((cat,idx) => idx%3===2));
      
      
    // }
    getPosts();
    

  },[])

//----------------------database stuff------------------------------------------------
  // const fetchPosts = async() => {
  //   const res = await fetch('http://localhost:5000/publications');
  //   const data = await res.json();
  //   return data;
  // }
  const getPosts = async() =>{
    InformationDataService.getPublicationPost()
    .then(response => {
      console.log(response.data.filter((cat,idx) => idx%3===0)[0].category[1][0]);
      setArr1(response.data.filter((cat,idx) => idx%3===0));
      setArr2(response.data.filter((cat,idx) => idx%3===1));
      setArr3(response.data.filter((cat,idx) => idx%3===2));

    })
    .catch(e => {
        console.log(e)
    });
}

  return (
    <div className="containerStyle">
        <div className="columnContainerStyle">
          {arr1 && arr1.map((cat) => <PublicationType key = {cat.id} title={cat.category[0]} publications={cat.category[1]}/>)}
        </div>

        <div className="columnContainerStyle">
          {arr2 && arr2.map((cat) => <PublicationType key = {cat.id} title={cat.category[0]} publications={cat.category[1]}/>)}
        </div>

        <div className="columnContainerStyle">
          {arr3 && arr3.map((cat) => <PublicationType key = {cat.id} title={cat.category[0]} publications={cat.category[1]}/>)}
        </div>

    </div>
  )
}

const containerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  marginTop: 64,
  paddingTop: 20,
}

const columnContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
}


export default PublicationsPage