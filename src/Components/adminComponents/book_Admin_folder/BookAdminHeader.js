import React, { useState } from 'react';
import './BookAdmin.css';
import {storage} from "../../../firebase.js";
import {ref,uploadBytes, getDownloadURL, deleteObject} from "firebase/storage";
import {v4} from 'uuid';
import {FaFileImage} from "react-icons/fa";
import editStyles from "../../CSS/edit-style.module.css";
import buttonStyle from "../../CSS/button-style.module.css";
import InformationDataService from '../../../Services/InformationDataService';

function BookAdminHeader({bookAll, setBookAll}) {
    let [isEdit,setIsEdit] = useState(false);
    let [titleText,setTitleText] = useState("");
    let [editionText,setEditionText] = useState("");
    let [awardsText,setAwardsText] = useState("");
    let [descText,setDescText] = useState("");
    let [reviewsArr,setReviewsArr] = useState([]);
    let [interviewsArr,setInterviewsArr] = useState([]);

    //firebase values
    let [imageUpload,setImageUpload] = useState(null);
    let [imageURL, setImageURL] = useState(null);
    let [imageChanged, setImageChanged] = useState(false);

    //----------------------firebase stuff------------------------------------------------
    const uploadImage = () => {
        if(imageUpload==null)return;
        //if not null have to first remove old image
        if(imageURL!=null){
            deleteFromFirebase(imageURL);
        }

        //add new image
        let imageRef = ref(storage,`bookImages/${imageUpload.name+v4()}`);

        uploadBytes(imageRef,imageUpload).then(()=>{
            getDownloadURL(imageRef).then((innerUrl)=>{
                setImageURL(innerUrl);
            });
            alert("Image Successfully Uploaded!");
            setImageChanged(true);
        });

    };

    const deleteFromFirebase = (url) => {
        //1.
        let pictureRef = ref(storage,imageURL);
       //2.
        deleteObject(pictureRef)
          .then(() => {
            //3.
            // setImages(allImages.filter((image) => image !== url));
            // alert("Picture is deleted successfully!");
          })
          .catch((err) => {
            console.log(err);
          });
      };
    

    function triggerEdit(){
        setIsEdit(true);
    }

    //collect text onChange methods

    function handleTitleChange(e){
        setTitleText(e.target.value);
    }

    function handleEditionChange(e){
        setEditionText(e.target.value);
    }

    function handleAwardsChange(e){
        setAwardsText(e.target.value);
    }

    function handleDescChange(e){
        setDescText(e.target.value);
    }

    function reviewsChange(e,idx){
        setReviewsArr(current => current.map((innerReview)=>{
            if(innerReview[0] === idx){
                return [idx,e.target.value,innerReview[2]];
            }
            return innerReview;
        }))
    }

    function reviewsAuthorChange(e,idx){
        setReviewsArr(current => current.map((innerReview)=>{
            if(innerReview[0] === idx){
                return [idx,innerReview[1],e.target.value];
            }
            return innerReview;
        }))
    }

    function interviewChange(e,idx){
        setInterviewsArr(current => current.map((innerInterview)=>{
            if(innerInterview[0] === idx){
                return [idx,e.target.value,innerInterview[2]];
            }
            return innerInterview;
        }))
    }

    function interviewAuthorChange(e,idx){
        setInterviewsArr(current => current.map((innerInterview)=>{
            if(innerInterview[0] === idx){
                return [idx,innerInterview[1],e.target.value];
            }
            return innerInterview;
        }))
    }

    function resetAll(){
        setTitleText("");
        setEditionText("");
        setAwardsText("");
        setDescText("");
        setReviewsArr([]);
        setInterviewsArr([]);
    }

    function addNewBook(){
        // let newID = bookAll[0].id+1;
        // console.log(newID);
        let newBook = {
            // "id": newID,
            "imageUrl": imageURL,
            "title": titleText,
            "edition": editionText,
            "awards": awardsText,
            "description": descText,
            "reviews": reviewsArr,
            "interviews": interviewsArr
            };

        addPostFunction(newBook);
        resetAll();
        setBookAll(current => [newBook,...current]);
        
    }

    function saveButton(){
        // updatePost(book.id);
        addNewBook();
        setIsEdit(false);
    }

    function cancelButton(){
        // updatePost(book.id);
        if(imageChanged){
            deleteFromFirebase(imageURL);
        }
        setImageChanged(false);
        setImageURL(null);
        setTitleText("");
        setEditionText("");
        setAwardsText("");
        setDescText("");
        setReviewsArr([]);
        setInterviewsArr([]);
        setIsEdit(false);
        
    }

    function addNewReview(){
        let newID = reviewsArr[reviewsArr.length-1][0]+1;
        let newReview = [newID,"Review Text","Writer Name"];
        setReviewsArr(current => [...current,newReview]);
        
    }

    function deleteReview(idx){
        setReviewsArr(current => current.filter((innerItem) => innerItem[0]!==idx));
        
    }

    function addNewInterview(){
        let newID = reviewsArr[reviewsArr.length-1][0]+1;
        let newInterview = [newID,"Interview Text","Writer Name"];
        setInterviewsArr(current => [...current,newInterview]);
        
    }

    function deleteInterview(idx){
        setInterviewsArr(current => current.filter((innerItem) => innerItem[0]!==idx));
        
    }

      //----------------------database stuff------------------------------------------------
  const fetchPost = async(instanceID) => {
    const res = await fetch(`http://localhost:5000/books/${instanceID}`);
    const data = await res.json();

    return data;
  }

  const deleteServerPost = async (id) => {
    await fetch(`http://localhost:5000/books/${id}`,{
      method: 'DELETE',
    });

    // setBlogRecords(blogRecords.filter((record) => record.id !== id));
    
  }

//   const updatePost = async (instanceID) => {
//     const postToUpdate = await fetchPost(instanceID);
//     const updatedPost = {
//       ...postToUpdate, 
//       "title": titleText,
//       "imageUrl": imageURL,
//       "edition": editionText,
//       "awards": awardsText,
//       "description": descText,
//       "reviews": reviewsArr,
//       "interviews": interviewsArr
//     }

//     const res = await fetch(`http://localhost:5000/books/${instanceID}`, {
//       method:'PUT',
//       headers:{
//         'Content-type': 'application/json'
//       },
//       body: JSON.stringify(updatedPost)
//     })

//     const data = await res.json();
//   }

//   const addPostFunction = async (post) => {
//     const res = await fetch('http://localhost:5000/books', {
//         method: 'POST',
//         headers: {
//             'Content-type': 'application/json',
//         },
//         body: JSON.stringify(post),
//     })

//     const data = await res.json();
// }

const addPostFunction = async (post) => {

    InformationDataService.createBookPost(post)
    .then(response => {
      // setSubmitted(true);
        //   console.log(response.data.insertedId);
    })
    .catch(e=>{
      console.log(e);
    });
  }

  //----------------------database stuff------------------------------------------------



    //return here 
    if(!isEdit){
        return (
            <div className='addNewBook' onClick={triggerEdit}>
              {/* <div className='circle plus'></div> */}
              Add a new book
            </div>
          )
    }
        
    else{
        return (
            <div>
                <div className='main-body-top' style={{marginTop: 0, paddingTop: 20}}>
                    <h2>Add a New Book</h2>
                    <div className='body-col-left' style={{paddingBottom: 20}}>
                        {imageURL==null?<FaFileImage size={150} color={'darkgrey'} />:<img className='bookcover-small-img' src={imageURL} alt="bookcover" />}
                        <div className='col-left-btn-collection'>
                            <input className='fileInputBook' type="file" onChange={(event) => {setImageUpload(event.target.files[0])}}/>
                        </div>
                        <div style={{display: 'flex', width: 'fit-content'}}>
                            <button className={buttonStyle.saveBtn} onClick={uploadImage}>Upload</button>
                        </div>
                    </div>
                    <div className='body-col-right'>
                        <div className={editStyles.editInputBoxWrapper} style={{marginBottom: 10}}>
                            <input type="text" id="editBookHeader" name="editBookHeader" className={`editBookTitle ${editStyles.editInputBox}`} value={titleText} onChange={handleTitleChange} style={{height: 'auto'}} placeholder='Title'></input>
                        </div>
                        <div className={editStyles.editInputBoxWrapper} style={{marginBottom: 10}}>
                            <input type="text" id="editBookEdition" name="editBookEdition" className={`main-text publisher editPara ${editStyles.editInputBox}`} value={editionText} onChange={handleEditionChange} placeholder='Add book edition'></input>
                        </div>

                        <div className={editStyles.editTextAreaBoxWrapper} style={{marginBottom: 10}}>
                            <textarea className={`main-text awards editPara ${editStyles.editTextAreaBox}`} type="text" id="editBookAwards" name="editBookAwards" rows="3" cols="75" value={awardsText} onChange={handleAwardsChange} placeholder='Add awards'/>
                        </div>
                        
                        <div className={editStyles.editTextAreaBoxWrapper} style={{marginBottom: 10}}>
                            <textarea className={`main-text short-text editPara ${editStyles.editTextAreaBox}`} type="text" id="editBookDescription" name="editBookDescription" rows="8" cols="75" value={descText} onChange={handleDescChange} placeholder='Add short description of the book'/>
                        </div>
                        
                        <div>
                            <p style={{fontFamily: 'Inter'}}>Purchase a copy from:</p>
                            <button style={{opacity: 0.5, cursor: 'default'}}>EPIGRAM BOOKS</button>
                            <button style={{marginBottom: 0, opacity: 0.5, cursor: 'default'}}>DIODE EDITIONS</button>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='headerWrapper' style={{marginBottom: 20}}>
                        <h2 className='h2-header'>Reviews</h2>
                        <div className='button-right-align'>
                            <button className={buttonStyle.addBtn} style={{width: 'fit-content'}} onClick={addNewReview}>Add New Review</button>
                        </div>
                    </div>

                    {reviewsArr.map((review) => 
                    <div key={review[0]}>
                        <p className='text'>
                            <span>“</span>
                            <textarea className='editReviewDescription' type="text" id="editReviewDescription" name="editReviewDescription" rows="5" cols="100" value={review[1]} onChange={(e)=>reviewsChange(e,review[0])}/>
                            <span>” —</span>
                            <input type="text" id="editReviewAuthor" name="editReviewAuthor" className='editReviewAuthor' value={review[2]} onChange={(e)=>reviewsAuthorChange(e,review[0])}></input>
                        </p>
                        <button className='internalButton' onClick={()=>deleteReview(review[0])}>Delete this review</button>
                        
                    </div> 
                    )}
                    
                    <div className='headerWrapper' style={{marginBottom: 20}}>
                        <h2 className='h2-header'>Interviews</h2>
                        <div className='button-right-align'>
                            <button className={buttonStyle.addBtn} style={{width: 'fit-content'}} onClick={addNewInterview}>Add New Interview</button>
                        </div>
                    </div>

                    {interviewsArr.map((interview) => 
                    <div key={interview[0]}>
                        <p className='text'>
                            <span>“</span>
                            <textarea className='editReviewDescription' type="text" id="editReviewDescription" name="editReviewDescription" rows="5" cols="100" value={interview[1]} onChange={(e)=>interviewChange(e,interview[0])}/>
                            <span>” —</span>
                            <input type="text" id="editReviewAuthor" name="editReviewAuthor" className='editReviewAuthor' value={interview[2]} onChange={(e)=>interviewAuthorChange(e,interview[0])}></input>
                        </p>
                        <button className='internalButton' onClick={()=>deleteInterview(interview[0])}>Delete this interview</button>
                        
                    </div> 
                    )}

                    <div className={`${editStyles.btnRow} btnRowCollectionSplitCol`}>
                        <div className='btnCollectionStickLeft'>
                            <button className={buttonStyle.cancelBtn} onClick={cancelButton}>Cancel</button>
                            <button className={buttonStyle.saveBtn} onClick={saveButton}>Publish</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default BookAdminHeader
