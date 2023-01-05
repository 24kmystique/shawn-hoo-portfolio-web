import React from 'react'
import { useState, useRef } from 'react';
import _ from "lodash"; // Import the entire lodash library, deepcopy required for cancel function
import { AiOutlineEdit } from "react-icons/ai";

import PopupEditor from '../popup/PopupEditor';
import popupStyle from "../popup/PopupEditor.module.css";
import editStyles from "../../CSS/edit-style.module.css";

function PublicationsTypeAdmin({title, publications, instanceID, setArrAll}) {
  // console.log(publications[0].second);
  let [isEdit, setIsEdit] = useState(false);
  let [headerText, setHeaderText] = useState(title);
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
    let newId = pubArr[pubArr.length-1].id +1;
    let newItem = {"id": newId, "first": "", "second": ""};
    setPubArr(current => [...current,newItem]);
    updatePost(instanceID);
  }

  function handleDeleteItem(idx){
    setPubArr((current)=>current.filter((content)=> content.id !== idx));
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
    setArrAll(current => current.filter((item)=>item.id !==instanceID));
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
const fetchPost = async(instanceID) => {
  const res = await fetch(`http://localhost:5000/publications/${instanceID}`);
  const data = await res.json();

  return data;
}

const deleteServerPost = async (id) => {
  await fetch(`http://localhost:5000/publications/${id}`,{
    method: 'DELETE',
  });

  
}

const updatePost = async (instanceID) => {
  const postToUpdate = await fetchPost(instanceID);
  
  let newPost = [headerText,pubArr];

  const updatedPost = {
    ...postToUpdate, 
    "category": newPost

  }

  const res = await fetch(`http://localhost:5000/publications/${instanceID}`, {
    method:'PUT',
    headers:{
      'Content-type': 'application/json'
    },
    body: JSON.stringify(updatedPost)
  })

  const data = await res.json();
}

//----------------------database stuff------------------------------------------------


  //return here
  if(!isEdit){
    return (
        <div className={editStyles.editContentBorderWrapper} style={{marginTop: 20, marginBottom: 20}} onClick={onClickEditTextArea}>
          <div className={editStyles.editHeaderWrapper}>
            <h2 className={editStyles.editHeader}>{title}</h2>
              <button className={editStyles.editHeaderButton} onClick={triggerEdit}><AiOutlineEdit className={editStyles.editIconMediumSize}/></button>
          </div>

          {pubArr.map((publication) => (
              <div key={publication.id}>
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
