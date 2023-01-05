import React, { useState, useEffect, Component } from 'react';
import BookCover from '../../../assets/book-cover_of-the-florids.png';
import InformationDataService from '../../../Services/InformationDataService';
// import './BookAdmin.css';
import BookAdminHeader from './BookAdminHeader';
import BookAdminInner from './BookAdminInner';

function BookAdmin() {

    let [bookAll,setBookAll] = useState("");

    useEffect(() => {

        getPosts();

    },[bookAll])



    //----------------------database stuff------------------------------------------------
    const getPosts = async() =>{
        InformationDataService.getBookPost()
        .then(response => {
          console.log(response.data[0]);
          setBookAll(response.data.slice(0).reverse());
          // setBlogRecords(response.data);
        })
        .catch(e => {
            console.log(e)
        });
    }



    //return here
    return (
        
        <div className='bookAdminOuter'>
            
            <BookAdminHeader bookAll = {bookAll} setBookAll = {setBookAll}/>
            {bookAll && bookAll.map((bookProp) => <BookAdminInner key={bookProp._id} book = {bookProp} setBookAll = {setBookAll}/>)}

        </div>
    )
    // onClick={()=> setTriggerAddPost(true)}



}

export default BookAdmin
