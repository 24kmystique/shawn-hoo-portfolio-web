import React, { useState } from 'react'
import BlogTagAdmin from './BlogTagAdmin.js'
import {storage} from "../../../firebase.js";
import {ref,uploadBytes, getDownloadURL, deleteObject} from "firebase/storage";
import {v4} from 'uuid';
import {FaFileImage} from "react-icons/fa";
import inputTagStyle from "../../CSS/input-tag-style.module.css";
import editStyles from "../../CSS/edit-style.module.css";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import ClassicEditor from 'ckeditor5-custom-build/build/ckeditor'
import {CKEditor} from '@ckeditor/ckeditor5-react'
import InformationDataService from '../../../Services/InformationDataService.js';

function AddPostHeader({blogRecords, setBlogRecords}) {

    // text editor
    const [text, setText] = useState("")


    let [triggerAddPost, setTriggerAddPost] = useState(false);

    let [headerText, setHeaderText] = useState("");
    let [paraText, setParaText] = useState("");
    let [dateText, setDateText] = useState("");
    let [tagArr, setTagArr] = useState([]);
    let [addTagText, setAddTagText] = useState("");

    //firebase values
    let [imageUpload,setImageUpload] = useState(null);
    let [imageURL, setImageURL] = useState(null);
    let [imageChanged, setImageChanged] = useState(false);


    //----------------------firebase stuff------------------------------------------------
    const uploadImage = (e) => {
        e.preventDefault();
        // console.log("hello");
        if(imageUpload==null)return;
        //if not null have to first remove old image
        if(imageURL!=null){
            deleteFromFirebase(imageURL);
        }

        //add new image
        let imageRef = ref(storage,`blogImages/${imageUpload.name+v4()}`);

        uploadBytes(imageRef,imageUpload).then(()=>{
            getDownloadURL(imageRef).then((innerUrl)=>{
                console.log(innerUrl);
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

    function handleHeaderChange(e){
        setHeaderText(e.target.value);
    }
    
    function handleBodyParaChange(e){
    setParaText(e.target.value);
    }

    function handleDateChange(e){
    setDateText(e.target.value);
    }

    let handleAddTagChange = (e) => {
        setAddTagText(e.target.value);
    }

    function resetAllText(){
        setHeaderText("");
        setImageURL(null);
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
                "imageUrl":imageURL,
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
        if(imageURL!=null && imageChanged === false){
            deleteFromFirebase(imageURL);
        }
        setImageChanged(false);
        setTriggerAddPost(false);
        resetAllText();
        
      };


    const addPostFunction = async (post) => {
        // const newPost = {
        //   "_id": instanceID, 
        //   "header": headerText,
        //   "imageUrl":imageURL,
        //   "bodyPara": paraText,
        //   "date": dateText,
        //   "tags": tagArr
        // }
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

                {/* <div className='editImage'>
                    {imageURL==null?<FaFileImage size={300} />:<img className='bookcover-img' src={imageURL} />}
                    <div className='col-left-btn-collection'>
                        <input className='fileInputBook' type="file" onChange={(event) => {setImageUpload(event.target.files[0])}}/>
                        <button className='internalButtonLeft' onClick={(e)=>uploadImage(e)}>Upload</button>
                    </div>
                </div> */}
                
                <div className={editStyles.editInputBoxWrapper}>
                    <input className={editStyles.editInputBox} type="text" id="editInnerDate" name="editInnerDate" value={dateText} onChange={handleDateChange} placeholder="Date"/>
                </div>

                <div className={inputTagStyle.inputTextAreaWrapper}>
                    <BlogTagAdmin tagArr = {tagArr} setTagArr={setTagArr}/>
                    <input className={inputTagStyle.inputTextArea} type="text" name="addInnerTags" placeholder='Add tag here' value={addTagText} onChange={handleAddTagChange} onKeyDown={handleAddNewTag}></input>
                </div>

                <div className={editStyles.editTextAreaBoxWrapper}>
                    {/* <textarea className={editStyles.editTextAreaBox} type="text" id="editInnerPara" name="editInnerPara" rows="10" cols="50" value={paraText} onChange={handleBodyParaChange} placeholder="Write post description here..."/> */}
                    <CKEditor
                    editor={ClassicEditor}
                    data={text}
                    onChange={(event, editor) => {
                        const data = editor.getData()
                        setText(data)
                        setParaText(data)
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
