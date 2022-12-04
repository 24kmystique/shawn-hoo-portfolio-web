import React, { useState, useEffect } from 'react'
//component for blogtags to be used in a singular blogpost

function BlogTagAdmin({recordTags}) {
  let renderContainer = recordTags.map((tag,index) => <div className={`blogTag ${index%2===0? "darkTagAdmin": "lightTagAdmin"}`} key = {index}>{tag}</div>)
 
  return (
    <div className='blogTagContainer'>
      {renderContainer}
    </div>
  )
}

export default BlogTagAdmin
