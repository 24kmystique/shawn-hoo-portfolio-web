import React, { useState } from 'react';
import './BookAdmin.css';
import {storage} from "../../../firebase.js";
import {ref,uploadBytes, getDownloadURL, deleteObject} from "firebase/storage";
import {v4} from 'uuid';
import {FaFileImage} from "react-icons/fa";
import editStyles from "../../CSS/edit-style.module.css";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import buttonStyle from "../../CSS/button-style.module.css";
import InformationDataService from '../../../Services/InformationDataService';

function BookAdminInner({book, setBookAll}) {
    let [isEdit,setIsEdit] = useState(false);
    let [titleText,setTitleText] = useState(book.title.replace(/\\n/g,'\n'));
    let [editionText,setEditionText] = useState(book.edition.replace(/\\n/g,'\n'));
    let [awardsText,setAwardsText] = useState(book.awards.replace(/\\n/g,'\n'));
    let [descText,setDescText] = useState(book.description.replace(/\\n/g,'\n'));
    let [reviewsArr,setReviewsArr] = useState(book.reviews);
    let [interviewsArr,setInterviewsArr] = useState(book.interviews);

    //original values
    let [oriTitleText,setOriTitleText] = useState(book.title.replace(/\\n/g,'\n'));
    let [oriEditionText,setOriEditionText] = useState(book.edition.replace(/\\n/g,'\n'));
    let [oriAwardsText,setOriAwardsText] = useState(book.awards.replace(/\\n/g,'\n'));
    let [oriDescText,setOriDescText] = useState(book.description.replace(/\\n/g,'\n'));
    let [oriReviewsArr,setOriReviewsArr] = useState(book.reviews);
    let [oriInterviewsArr,setOriInterviewsArr] = useState(book.interviews);

    //firebase values
    let [imageUpload,setImageUpload] = useState(null);
    let [oriImageURL, setOriImageURL] = useState(book.imageUrl);
    let [imageURL, setImageURL] = useState(book.imageUrl);
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

    function saveButton(){
        updatePost(book._id);
        setOriImageURL(imageURL);
        setOriTitleText(titleText);
        setOriEditionText(editionText);
        setOriAwardsText(awardsText);
        setOriDescText(descText);
        setOriReviewsArr(reviewsArr);
        setOriInterviewsArr(interviewsArr);
        setIsEdit(false);
    }

    function cancelButton(){
        // updatePost(book.id);
        if(imageChanged){
            deleteFromFirebase(imageURL);
        }
        setImageChanged(false);
        setImageURL(oriImageURL);
        setTitleText(oriTitleText);
        setEditionText(oriEditionText);
        setAwardsText(oriAwardsText);
        setDescText(oriDescText);
        setReviewsArr(oriReviewsArr);
        setInterviewsArr(oriInterviewsArr);
        setIsEdit(false);
        
    }

    function deleteBookButton(){
        if(imageURL!=null){
            deleteFromFirebase(imageURL);
        }
        deleteServerPost(book._id);
        setBookAll(current => current.filter((innerItem)=> innerItem.id!==book._id));
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

//   const deleteServerPost = async (id) => {
//     await fetch(`http://localhost:5000/books/${id}`,{
//       method: 'DELETE',
//     });

//     // setBlogRecords(blogRecords.filter((record) => record.id !== id));
    
//   }
  const deleteServerPost = async (id) => {

    InformationDataService.deleteBookPost(id)
    .then(response => {
      // setSubmitted(true);
    //   setBlogRecords(blogRecords.filter((record) => record._id !== id));
      console.log(response.data);
    })
    .catch(e=>{
      console.log(e);
    });
  }

  const updatePost = async (id) => {
    const updatedPost = {
      "_id": id, 
      "title": titleText,
      "imageUrl": imageURL,
      "edition": editionText,
      "awards": awardsText,
      "description": descText,
      "reviews": reviewsArr,
      "interviews": interviewsArr
    }
    InformationDataService.updateBookPost(updatedPost)
    .then(response => {
      // setSubmitted(true);
      console.log(response.data);
    })
    .catch(e=>{
      console.log(e);
    });
  }


  //----------------------database stuff------------------------------------------------



    //return here 
    if(!isEdit){
        return (
            <div>
                <div className='book-page-cover-wrapper'>
                    <div className='book-page-cover-wrapper__left-col'>
                        {imageURL==null?<FaFileImage size={150} color={'darkgrey'} />:<img className='bookcover-img' src={imageURL} alt="bookcover" />}
                    </div>
                    <div className='book-page-cover-wrapper__right-col'>
                        <div className='headerContainer'>
                            <h1>{titleText}</h1>
                            <div className='headerBtns'>
                                <button className='bookEditBtn' onClick={triggerEdit}>
                                <AiOutlineEdit style={{verticalAlign: 'middle'}}/>
                                </button>
                            </div>
                        </div>
                        <p className='book-page-cover-wrapper__right-col-publisher'>{editionText}</p>
                        <p className='book-page-cover-wrapper__right-col-awards'>{awardsText}</p>
                        <p className='book-page-cover-wrapper__right-col-short-text'>{descText}</p>
                        <div>
                            <p style={{fontFamily: 'Inter'}}>Purchase a copy from:</p>
                            <button>EPIGRAM BOOKS</button>
                            <button style={{marginBottom: 0}}>DIODE EDITIONS</button>
                        </div>
                    </div>
                </div>
                <div className='book-page-body-wrapper'>
                    <h2 className='book-page-body-wrapper__h2-header'>Reviews</h2>
                    {reviewsArr.map((review) => 
                    <div key={review[0]}>
                        <p className='book-page-body-wrapper__text'><span>“</span><span>{review[1]}</span><span>” —</span><span className='book-page-body-wrapper__bold-text'>{review[2]}</span></p>
                    </div> 
                    )}
                    
                    <h2 className='book-page-body-wrapper__h2-header'>Interviews</h2>
                    {interviewsArr.map((interview) => 
                    <div key={interview[0]}>
                        <p className='book-page-body-wrapper__text'><span>“</span><span>{interview[1]}</span><span>” —</span><span className='book-page-body-wrapper__bold-text'>{interview[2]}</span></p>
                    </div> 
                    )}
                </div>
                
            </div>
          )
    }
        
    else{
        return (
            <div>
                <div className='main-body-top'>
                    <h2>Edit Book</h2>
                    <div className='body-col-left' style={{paddingBottom: 20}}>
                        {imageURL==null?<FaFileImage size={300} />:<img className='bookcover-small-img' src={imageURL} alt="bookcover" />}
                        <div className='col-left-btn-collection'>
                            <input className='fileInputBook' type="file" onChange={(event) => {setImageUpload(event.target.files[0])}}/>
                        </div>
                        <div style={{display: 'flex', width: 'fit-content'}}>
                            <button className={buttonStyle.saveBtn} onClick={uploadImage}>Upload</button>
                        </div>
                    </div>
                    <div className="body-col-right">
                        <div className={editStyles.editInputBoxWrapper} style={{marginBottom: 10}}>
                            <input type="text" id="editBookHeader" name="editBookHeader" className={`editBookTitle ${editStyles.editInputBox}`} value={titleText} onChange={handleTitleChange} style={{height: 'auto'}} placeholder='Add title'></input>
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
                    <div className='grid-3-column-wrapper' key={review[0]}>
                        <div className={editStyles.editTextAreaBoxWrapper}>
                            <textarea className={`editReviewDescription ${editStyles.editTextAreaBox}`} type="text" id="editReviewDescription" name="editReviewDescription" rows="5"  value={review[1]} onChange={(e)=>reviewsChange(e,review[0])} placeholder="Add review"/>
                        </div>
                        <span></span>
                        <div className={editStyles.editInputBoxWrapper}>
                            <input type="text" id="editReviewAuthor" name="editReviewAuthor" className={`editReviewAuthor ${editStyles.editInputBox}`} value={review[2]} onChange={(e)=>reviewsAuthorChange(e,review[0])} placeholder="Add author"></input>
                        </div>
                        <span></span>
                        <div className='iconWrapper'>
                            <AiOutlineDelete className='deleteMediumIcon' onClick={()=>deleteReview(review[0])}/>
                        </div>
                    </div>
                    )}
                    
                    <div className='headerWrapper' style={{marginBottom: 20}}>
                        <h2 className='h2-header'>Interviews</h2>
                        <div className='button-right-align'>
                            <button className={buttonStyle.addBtn} style={{width: 'fit-content'}} onClick={addNewInterview}>Add New Interview</button>
                        </div>
                    </div>

                    {interviewsArr.map((interview) => 
                    <div className='grid-3-column-wrapper' key={interview[0]}>
                        <div className={editStyles.editTextAreaBoxWrapper}>
                            <textarea className={`editReviewDescription ${editStyles.editTextAreaBox}`} type="text" id="editReviewDescription" name="editReviewDescription" rows="5" value={interview[1]} onChange={(e)=>interviewChange(e,interview[0])} placeholder="Add interview"/>
                        </div> 
                        <span></span>
                        <div className={editStyles.editInputBoxWrapper}>
                            <input type="text" id="editReviewAuthor" name="editReviewAuthor" className={`editReviewAuthor ${editStyles.editInputBox}`} value={interview[2]} onChange={(e)=>interviewAuthorChange(e,interview[0])} placeholder="Add author"></input>
                        </div> 
                        <span></span>
                        <div className='iconWrapper'>
                            <AiOutlineDelete className='deleteMediumIcon' onClick={()=>deleteInterview(interview[0])}/>
                        </div>
                        
                    </div> 
                    )}

                    <div className={`${editStyles.btnRow} btnRowCollectionSplitCol`}>
                        <div className='btnCollectionStickLeft'>
                            <button className={buttonStyle.cancelBtn} onClick={cancelButton}>Cancel</button>
                            <button className={buttonStyle.saveBtn} onClick={saveButton}>Save</button>
                        </div>
                        <div>
                            <button className={buttonStyle.deleteBtn} onClick={deleteBookButton}>Delete Book</button>
                        </div>
                    </div>

                </div>
            </div>
        )
    }

}

export default BookAdminInner
