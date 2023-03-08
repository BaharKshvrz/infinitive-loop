import React, { useCallback, useRef } from 'react'
import Post from './Post';
import { useInfiniteQuery } from 'react-query';
import { getPostsPage } from '../api/axios';

const PostsReactQuery = () => {
    const {
        fetchNextPage,        //fucntion
        hasNextPage,          //boolean
        isFetchingNextPage,   //boolaan
        data,
        error,
        status
    } = useInfiniteQuery('/posts',
          ({ pageParam = 1 }) => getPostsPage(pageParam),
          {
             getNextPageParam: (lastPage, allPages) => {
               return lastPage.length ? allPages.length + 1 : undefined
             }
          }
    );

    /* make an infinitive scroll */
    const intObserver = useRef();
    const lastPostRef = useCallback(post => {
        if (isFetchingNextPage) return
        if (intObserver.current) intObserver.current.disconnect();
        intObserver.current = new IntersectionObserver(posts => {
            if (posts[0].isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        });

        if (post) intObserver.current.observe(post);
    }, [isFetchingNextPage, fetchNextPage, hasNextPage]);
   /* end of making an infinitive scroll */

    if (status === 'error') return <p className='center'>Error: {error.message}</p>
    
  const content = data?.pages.map((pg) => {
    return pg.map((post, i) => {
      if (pg.length === i + 1) {
        return <Post key={post.id} ref={lastPostRef} post={post} />
       } 
       return <Post key={post.id} post={post} />
      })
    })

  return (
    <>
          <h1 id="top">&infin; Infinite Query &amp; Scroller</h1>
          {content}
          {isFetchingNextPage && <p className='center'>Loading More Posts...</p>}
          <p className='center'><a href='#top'>Back to Top</a></p>
    </>
  )
}

export default PostsReactQuery
