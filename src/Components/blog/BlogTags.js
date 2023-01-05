import React, { useState, useEffect } from 'react'
import './BlogPage.css';
//component for blogtags to be used in a singular blogpost

function BlogTags({recordTags}) {
  // console.log(recordTags);
  let renderContainer = recordTags.map((tag,index) => <div className={`blogTag ${index%2===0? "darkTag": "lightTag"}`} key = {index}>{tag}</div>)

  return (
    <div className='blogTagContainer'>
      {renderContainer}
    </div>
  )
}

export default BlogTags
