import React, { useEffect, useState } from 'react';
import { AiOutlineEdit } from "react-icons/ai";

import BlogTags from '../BlogTags';
import BlogTagAdmin from './BlogTagAdmin.js';
import inputTagStyle from "../../CSS/input-tag-style.module.css";
import editStyles from "../../CSS/edit-style.module.css";

import {storage} from "../../../firebase.js";
import {ref,uploadBytes, listAll, getDownloadURL, deleteObject} from "firebase/storage";
import {v4} from 'uuid';
import {FaFileImage} from "react-icons/fa";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import ClassicEditor from 'ckeditor5-custom-build/build/ckeditor'
import {CKEditor} from '@ckeditor/ckeditor5-react'
import '../../CSS/ckeditor.css';
import InformationDataService from '../../../Services/InformationDataService';

function BlogPostAdmin({itemIdx, instanceID, recordHeader, bodyPara, recordDate, recordTags, blogRecords, setBlogRecords}) {

  let [isEdit, setIsEdit] = useState(false);
  let [headerText, setHeaderText] = useState(recordHeader);
  let [paraText, setParaText] = useState(bodyPara);
  let [dateText, setDateText] = useState(recordDate);
  let [tagArr, setTagArr] = useState(recordTags);
  let [addTagText, setAddTagText] = useState("");


  let [oriHeaderText, setOriHeaderText] = useState(recordHeader);
  let [oriParaText, setOriParaText] = useState(bodyPara);
  let [oriDateText, setOriDateText] = useState(recordDate);
  let [oriTagArr, setOriTagArr] = useState(recordTags);
  let [oriAddTagText, setOriAddTagText] = useState("");

  function triggerEditMode(){
    setIsEdit(!isEdit);
  }

  function handleHeaderChange(e){
    setHeaderText(e.target.value);
  }

  function handleDateChange(e){
    setDateText(e.target.value);
  }

  function handleAddTagChange(e){
    setAddTagText(e.target.value);
  }

  let addToTagArr = (e) => {
    e.preventDefault();
    setTagArr(current => [...current, addTagText]);
    setAddTagText("");
  };

  //----------------------START: database stuff------------------------------------------------
  const updatePost = async () => {
    const updatedPost = {
      "_id": instanceID, 
      "header": headerText,
      "bodyPara": paraText,
      "date": dateText,
      "tags": tagArr
    }

    InformationDataService.updateBlogPost(updatedPost)
    .then(response => {
      // setSubmitted(true);
      console.log(response.data);
    })
    .catch(e=>{
      console.log(e);
    });
  }

  const deleteServerPost = async (id) => {

    InformationDataService.deleteBlogPost(id)
    .then(response => {
      // setSubmitted(true);
      setBlogRecords(blogRecords.filter((record) => record._id !== id));
      console.log(response.data);
    })
    .catch(e=>{
      console.log(e);
    });
  }


  //----------------------END: database stuff------------------------------------------------

  // button methods
  let onSavePost = (e) => {
    e.preventDefault();
    setIsEdit(!isEdit);

    setOriHeaderText(headerText);
    setOriParaText(paraText);
    setOriDateText(dateText);
    setOriTagArr(tagArr);

    updatePost(instanceID);
  };

  let onDeletePost = (e) => {
    e.preventDefault();
    if (window.confirm("Proceed to delete post?")) {
      deleteServerPost(instanceID);
    }
  };

  let onCancel = (e) => {
    e.preventDefault();
    setIsEdit(false);
    resetAllText();
  };

  function resetAllText(){
    setHeaderText(oriHeaderText);
    setParaText(oriParaText);
    setDateText(oriDateText);
    setTagArr(oriTagArr);
    setAddTagText("");
  }

  function handleAddNewTag(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        setTagArr(current => [...current, addTagText]);
        setAddTagText("");
    }
  }

  // return function here
  if(!isEdit){
    //return this view if its not editing
    return (
      <div className='blogPostAdminContainer'>
        <div className='headerContainer'>
          <h2 className='blogPostAdminHeader'>{headerText}</h2>
          <div className='headerBtns'>
            <button className='blogPostEditBtn' onClick={triggerEditMode}>
            <AiOutlineEdit style={{verticalAlign: 'middle'}}/>
            </button>
          </div>
        </div>

        <p className='blogPostAdminDate'>{dateText}</p>
        
        <p className='blogPostAdminPara ck-content' dangerouslySetInnerHTML={{__html: paraText}} />

        <div className='blogPostAdminBtmDiv'>
          <BlogTags recordTags = {tagArr}/>
        </div>
        
      </div>
    )
  }else{
    //return this view if it is currently editing
    return (
      <form className='blogPostEditContainer'>
        <h2 style={{margin: 0}}>Edit Post</h2>
        <div className={editStyles.editInputBoxWrapper}>
            <input className={editStyles.editInputBox} type="text" id="editInnerHeader" name="editInnerHeader" value={headerText} onChange={handleHeaderChange} placeholder="Title"></input>
        </div> 
        
        <div className={editStyles.editInputBoxWrapper}>
            <input className={editStyles.editInputBox} type="text" id="editInnerDate" name="editInnerDate" value={dateText} onChange={handleDateChange} placeholder="Date"/>
        </div>
      
        <div className={inputTagStyle.inputTextAreaWrapper}>
            <BlogTagAdmin tagArr = {tagArr} setTagArr={setTagArr}/>
            <input className={inputTagStyle.inputTextArea} type="text" name="addInnerTags" placeholder='Add tag here' value={addTagText} onChange={handleAddTagChange} onKeyDown={handleAddNewTag}></input>
        </div>

        <div className={editStyles.editTextAreaBoxWrapper}>

            <CKEditor
            editor={ClassicEditor}
            data={paraText}
            onChange={(event, editor) => {
                const data = editor.getData()
                setParaText(data)
            }} />
        </div>

        <div className={`${editStyles.btnRow} btnRowCollectionSplitCol`}>
            <div className='btnCollectionStickLeft'>
              <button className={editStyles.editCancelBtn} type='submit' onClick={onCancel}>Cancel</button>
              <button className={editStyles.editSaveBtn} type='submit' onClick={onSavePost} >Save</button>
            </div>
            <div>
              <button className={editStyles.editDeleteBtn} type='submit' onClick={onDeletePost} >Delete</button>
            </div>
        </div>

  </form>
    )
  }
  
  

}

export default BlogPostAdmin
