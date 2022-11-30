import React, { useState, useEffect } from 'react'
import BlogTags from './BlogTags'

//this defines a singular blog post that will be used on blogpage
function BlogPost({instanceID}) {

  // state to check if keep reading has been clicked
  const [isKeepReading, setIsKeepReading] = useState(false);
  const [isOverflow, setIsOverflow] = useState(false);

  function toggleKeepReading(e){
    setIsKeepReading(true);
    e.target.remove();
  }

  function checkOverflow(){
    const paraContainer = document.querySelectorAll('.blogPostContainer');
      if(paraContainer[instanceID].childNodes[2].classList.contains("blogPostPara")){
        const para = paraContainer[instanceID].childNodes[2];

        if(para.scrollHeight>para.clientHeight){
          //means it is currently overflowing
          setIsOverflow(true);
        }
        else if (para.scrollHeight==para.clientHeight){
          setIsOverflow(false);
        }
    }

  }

  useEffect(() => {
    checkOverflow();
  },[]);

  //checking for zoom event, function gotten online
  const zoomEvent = new Event('zoom')
  let currentRatio = window.devicePixelRatio

  function checkZooming() {
    if (currentRatio !== window.devicePixelRatio) {
      window.dispatchEvent(zoomEvent)
    }
  }

  window.addEventListener('resize', checkZooming)

  // usage
  window.addEventListener('zoom', () => {
    //every user zoom event check if box overflows
    checkOverflow();
    
  })

  

  return (
    <div className='blogPostContainer'>
      <h2 className='blogPostHeader'>Sealey Challenge 2022</h2>
      <BlogTags/>
      <p className={isKeepReading? 'blogPostParaKeepReading':'blogPostPara'}>Read a book of poems a day for the whole of August. Here’s my accompanying reading diary: not so much “reviews” as meditations on the words that float up to me as I close these books, or scribbles on the snatches of phrases that seem to arise out of a. CONTINUE. 
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
       </p>
      <div className='blogPostBtmDiv'>
        <text className='blogPostDate'>21 August 2022</text>
        {/* {this.checkVisability()} */}
        {isOverflow?<text className='blogPostKeepReading' onClick={toggleKeepReading}>Keep Reading</text>:''}
        {/* <div className='blogPostKeepReading' onClick={toggleKeepReading}>Keep Reading</div> */}
      </div>
      
    </div>
  )
}

export default BlogPost
