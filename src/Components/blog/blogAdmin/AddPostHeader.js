import React, { useState } from 'react';
import BlogTagAdmin from './BlogTagAdmin.js';
import {storage} from "../../../firebase.js";
import {ref,uploadBytes, getDownloadURL, deleteObject} from "firebase/storage";
import {v4} from 'uuid';
import {FaFileImage} from "react-icons/fa";
import inputTagStyle from "../../CSS/input-tag-style.module.css";
import editStyles from "../../CSS/edit-style.module.css";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ClassicEditor from 'ckeditor5-custom-build/build/ckeditor';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import InformationDataService from '../../../Services/InformationDataService.js';

function AddPostHeader({blogRecords, setBlogRecords}) {

    let [triggerAddPost, setTriggerAddPost] = useState(false);

    let [headerText, setHeaderText] = useState("");
    let [paraText, setParaText] = useState("");
    let [dateText, setDateText] = useState("");
    let [tagArr, setTagArr] = useState([]);
    let [addTagText, setAddTagText] = useState("");

    function handleHeaderChange(e){
        setHeaderText(e.target.value);
    }

    function handleDateChange(e){
    setDateText(e.target.value);
    }

    let handleAddTagChange = (e) => {
        setAddTagText(e.target.value);
    }

    function resetAllText(){
        setHeaderText("");
        setParaText("");
        setDateText("");
        setTagArr([]);
        setAddTagText("");
    }

    let addToTagArr = (e) => {
        e.preventDefault();
        setTagArr(current => [...current, addTagText]);
        setAddTagText("");
    };

    let onAddPost = (e) => {
        e.preventDefault();
        if (window.confirm("Proceed to add post?")) {
            //since arr is reversed, highest index will be the first one
            // let newestID = blogRecords[0].id+1;
            let newRecord = {
                // "id": newestID,
                "header": headerText,
                "tags": tagArr,
                "bodyPara": paraText,
                "date": dateText
            }
            setBlogRecords(current => [newRecord,...current]);
            addPostFunction(newRecord);
            setTriggerAddPost(false);
            resetAllText();
        }
      };

      let onCancel = (e) => {
        e.preventDefault();
        setTriggerAddPost(false);
        resetAllText();
        
      };


    const addPostFunction = async (post) => {
        InformationDataService.createBlogPost(post)
        .then(response => {
          // setSubmitted(true);
          console.log(response.data.insertedId);
        })
        .catch(e=>{
          console.log(e);
        });
      }

    function handleAddNewTag(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            setTagArr(current => [...current, addTagText]);
            setAddTagText("");
        }
    }

    // return here
    if(!triggerAddPost){
        return (
            <div className='addNewPostHeader' onClick={()=> setTriggerAddPost(true)}>
              Create a new post
            </div>
          )
    }else{
        return (
            <form className='blogPostEditContainer'>
                <h2>Create Post</h2>
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
                        const data = editor.getData();
                        setParaText(data);
                    }} />
                </div>

                <div className={editStyles.btnRow}>
                    <button className={editStyles.editCancelBtn} type='submit' onClick={onCancel}>Cancel</button>
                    <button className={editStyles.editSaveBtn} type='submit' onClick={onAddPost} >Publish</button>
                </div>
            
            </form>
          )
    }

}

export default AddPostHeader
