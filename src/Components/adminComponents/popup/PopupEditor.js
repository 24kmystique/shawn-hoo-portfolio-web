import React from 'react';
import { AiOutlinePlus, AiOutlineMinusCircle } from "react-icons/ai";

import popupStyle from "../popup/PopupEditor.module.css";
import buttonStyle from "../../CSS/button-style.module.css";

function PopupEditor(props) {

    function handleHeaderChange(e){
        props.onTitleChange(e.target.value);
    }

    function handleContentChange1(e, idx) {
        props.onContentChange1(e.target.value, idx);
    }

    function handleContentChange2(e, idx) {
        props.onContentChange2(e.target.value, idx);
    }

    function handleDeleteItem(idx){
        // setPubArr((current)=>current.filter((content)=> content.id !== idx));
        props.onDeleteItem(idx);
    }

    function handleAddItem(){
        props.onAddItem();
    }

    function handleResetCat(){
        props.onCancel();
    }

    function handleSave(){
        props.onSave();
    }

    function handleDeleteCat(){
        props.onDeleteCat();
    }

    return (
        <div className={popupStyle.popupWrapper}>
            <div className={popupStyle.popupWrapperItems}>

                <input className={popupStyle.popupHeaderLarge} type="text" id="editPubCat" name="editPubCat" value={props.title} onChange={handleHeaderChange} placeholder="Title" />

                <div className={popupStyle.popupAddItemButtonWrapper} onClick={handleAddItem}>
                    <span>Add an item... </span>
                    <AiOutlinePlus />
                </div>

                <div className={popupStyle.popupMediumHeaderWrapper}>
                    <span>Description</span>
                    <span>Link</span>
                </div>

                <div className={popupStyle.popupContentWrapper}>
                    {props.content.map( (publication, mapIdx) => (
                        <div className={popupStyle.popupContentGridWrapper} key={mapIdx}>
                            <input className={popupStyle.popupContentInputBox} type="text" value={publication[0]} onChange={(e) => handleContentChange1(e, mapIdx)} placeholder="Add description" />
                            <input className={popupStyle.popupContentInputBox} type="text" value={publication[1]} onChange={(e) => handleContentChange2(e, mapIdx)} placeholder="Add source" />
                            <AiOutlineMinusCircle className={popupStyle.deleteIconSmall} onClick={()=>handleDeleteItem(mapIdx)}/>
                        </div>
                    ))}
                </div>


                <div className={popupStyle.popupBtnRowCollectionSplitCol}>
                    <div>
                        <button className={buttonStyle.deleteBtn} onClick={handleDeleteCat}>Delete Category</button>
                    </div>
                    <div className={popupStyle.popupBtnCollectionStickRight}>
                        <button className={buttonStyle.cancelBtn} onClick={handleResetCat}>Cancel</button>
                        <button className={buttonStyle.saveBtn} onClick={handleSave}>Save</button>
                    </div>
                </div>
                
            </div>
        </div>

    )
}

export default PopupEditor;