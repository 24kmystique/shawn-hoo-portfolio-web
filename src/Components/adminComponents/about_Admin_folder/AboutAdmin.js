import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { AiOutlineEdit } from "react-icons/ai";
import './AboutAdmin.css';
import editStyles from "../../CSS/edit-style.module.css";
import InformationDataService from '../../../Services/InformationDataService';

function AboutAdmin() {
  let [aboutPost,setAboutPost] = useState("");
  let [oriAboutContent,setOriAboutContent] = useState("");
  let [aboutContent,setAboutContent] = useState("");
  let [isEdit,setIsEdit] = useState(false);
  let timer = useRef();
  
  useEffect(() => {
      getAbout();
  
    },[])

  //----------------------mongoDB stuff------------------------------------------------
    const getAbout = async() =>{
        InformationDataService.getAboutPost()
        .then(response => {
            setAboutPost(response.data[0]);
            setOriAboutContent(response.data[0].content);
            setAboutContent(response.data[0].content);
            console.log(response.data[0]._id);
        })
        .catch(e => {
            console.log(e)
        });
    }

    const updatePost = async () => {
      const updatedPost = {
        "_id": aboutPost._id, 
        "content": aboutContent
      }

      InformationDataService.updateAboutPost(updatedPost)
      .then(response => {
        // setSubmitted(true);
        console.log(response.data);
      })
      .catch(e=>{
        console.log(e);
      });
    }
  



  function triggerEdit(){
    setIsEdit(!isEdit);
  }
  function saveEdit(){
    updatePost();
    setOriAboutContent(aboutContent);
    setIsEdit(!isEdit);
  }
  function cancelEdit(){
    setAboutContent(oriAboutContent);
    setIsEdit(!isEdit);
  }

  function handleBodyParaChange(e){
    setAboutContent(e.target.value);
  }

  function onDoubleClick() {
    triggerEdit();
  }

  function onClickEditTextArea(e) {
    clearTimeout(timer.current);

    if (e.detail === 2) {
        onDoubleClick();
    }
  }

  
  if(!isEdit){
    return (
      <div className="about-wrapper-admin">
        <div className={editStyles.editHeaderWrapper}>
          <h2 className={editStyles.editHeader}>Description</h2>
          <button className={editStyles.editHeaderButton} onClick={triggerEdit}><AiOutlineEdit className={editStyles.editIconMediumSize}/></button>
        </div>

        <div className={editStyles.editContentBorderWrapper} onClick={onClickEditTextArea}>
          <p className='about-content-admin'>{aboutContent}</p>
        </div>
      </div>
    )
  }
  else{
    return(
      <div className="about-wrapper-admin">
        <div className={editStyles.editHeaderWrapper}>
          <h2 className={editStyles.editHeader}>Edit Description</h2>
          <AiOutlineEdit className={editStyles.editIconMediumSize}/>
        </div>
        <div>
          <textarea className={editStyles.editDescBox} type="text" id="editAdminAbout" name="editAdminAbout" rows="10" value={aboutContent} onChange={handleBodyParaChange}/>
        </div>
        <div className={editStyles.btnRow}>
          <button className={editStyles.editCancelBtn} onClick={cancelEdit}>Cancel</button>
          <button className={editStyles.editSaveBtn} onClick={saveEdit}>Save</button>
        </div>
      </div>
    )
  }

}

export default AboutAdmin
