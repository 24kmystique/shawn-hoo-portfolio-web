import React from 'react'
import { useState, useRef } from 'react';
import _ from "lodash"; // Import the entire lodash library, deepcopy required for cancel function
import { AiOutlineEdit } from "react-icons/ai";

import PopupEditor from '../popup/PopupEditor';
import popupStyle from "../popup/PopupEditor.module.css";
import editStyles from "../../CSS/edit-style.module.css";
import InformationDataService from '../../../Services/InformationDataService';

function PublicationsTypeAdmin({title, publications, instanceID, setArrAll}) {
  // console.log(publications[0].second);
  let [isEdit, setIsEdit] = useState(false);
  let [headerText, setHeaderText] = useState(_.cloneDeep(title));
  let [oriPubArr, setOriPubArr] = useState(_.cloneDeep(publications));
  let [pubArr, setPubArr] = useState(_.cloneDeep(publications));
  let timer = useRef();

  function triggerEdit(){
    setIsEdit(true);
  }

  //----------------handle input change---------------------

  function handleHeaderChange(title) {
    setHeaderText(title);
  }

  function handleContentChange1(newVal, idx){
    setPubArr(pubArr.map((item, innerIdx)=>{
      if(innerIdx === idx){
        item[0] = newVal;
        return item;
      }
      return item;
      
    }))
  }
  
  function handleContentChange2(newVal, idx){
    setPubArr(pubArr.map((item, innerIdx)=>{
      if(innerIdx === idx){
        item[1] = newVal;
        return item;
      }
      return item;
      
    }))
  }

  function handleAddItem(){
    // let newId = pubArr[pubArr.length-1].id +1;
    let newPost = ["",""];
    // let newItem = {"id": newId, "first": "", "second": ""};
    setPubArr(current => [...current,newPost]);
    updatePost(instanceID);
  }

  function handleDeleteItem(idx){
    setPubArr((current)=>current.filter((content,innerIdx)=> innerIdx !== idx));
  }

  function handleSave(){
    updatePost(instanceID);
    setOriPubArr(_.cloneDeep(pubArr));
    setIsEdit(false);
  }

  function handleResetCat(){
    setPubArr(_.cloneDeep(oriPubArr));
    setIsEdit(false);
  }

  function handleDeleteCat(){
    deleteServerPost(instanceID);
    setArrAll(current => current.filter((item)=>item._id !==instanceID));
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

//----------------------------------------------

//----------------------database stuff------------------------------------------------


const deleteServerPost = async (id) => {

  InformationDataService.deletePublicationPost(id)
  .then(response => {
    // setSubmitted(true);
    // setBlogRecords(blogRecords.filter((record) => record._id !== id));
    console.log(response.data);
  })
  .catch(e=>{
    console.log(e);
  });
}


const updatePost = async (instanceID) => {
  let newPost = [headerText,pubArr];
  const updatedPost = {
    "_id": instanceID, 
    "category": newPost
  }

  InformationDataService.updatePublicationPost(updatedPost)
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
        <div className={editStyles.editContentBorderWrapper} style={{marginTop: 20, marginBottom: 20}} onClick={onClickEditTextArea}>
          <div className={editStyles.editHeaderWrapper}>
            <h2 className={editStyles.editHeader}>{headerText}</h2>
              <button className={editStyles.editHeaderButton} onClick={triggerEdit}><AiOutlineEdit className={editStyles.editIconMediumSize}/></button>
          </div>

          {pubArr.map((publication) => (
              <div key={publication._id}>
                  {/* possibly has to change this to an a tag */}
                  <p style={{margin: 0}}>{publication[0]}. <i>{publication[1]}</i>. </p>
              </div>
          ))}
        </div>
      )
  }
  else{
    return(
        <div>
            <div className={popupStyle.popupOverlay}></div>
            <PopupEditor 
              title={headerText} onTitleChange={handleHeaderChange}
              content={pubArr} onContentChange1={handleContentChange1} onContentChange2={handleContentChange2}
              onAddItem={handleAddItem}
              onDeleteItem={handleDeleteItem}
              onCancel={handleResetCat}
              onSave={handleSave}
              onDeleteCat={handleDeleteCat}
            />
        </div>
    )
  }

}

export default PublicationsTypeAdmin
