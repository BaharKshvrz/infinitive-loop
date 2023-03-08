import React, { useCallback, useRef, useState } from 'react'
import usePosts from '../hooks/usePosts';
import Post from './Post';

const Posts = () => {
  const [pageNum, setPageNum] = useState(1);
    const {
        isLoading,
        results,
        isError,
        error,
        hasNextPage
    } = usePosts(pageNum);

    /* make an infinitive scroll */
    const intObserver = useRef();
    const lastPostRef = useCallback(post => {
        if (isLoading) return
        if (intObserver.current) intObserver.current.disconnect();
        intObserver.current = new IntersectionObserver(posts => {
            if (posts[0].isIntersecting && hasNextPage) {
                setPageNum(prev => prev + 1);
            }
        });

        if (post) intObserver.current.observe(post);
    }, [isLoading, hasNextPage]);
   /* end of making an infinitive scroll */

    if (isError) return <p className='center'>Error: {error.message}</p>
    const content = results.map((post, i) => {
        if (results.length === i + 1) {
            return <Post key={post.id} ref={lastPostRef} post={post} />
        } 
        return <Post key={post.id} post={post} />
    })

  return (
    <>
          <h1 id="top">&infin; Infinite Query &amp; Scroller</h1>
          {content}
          {isLoading && <p className='center'>Loading More Posts...</p>}
          <p className='center'><a href='#top'>Back to Top</a></p>
    </>
  )
}

export default Posts
