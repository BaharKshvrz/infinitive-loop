import React, { useCallback, useRef, useState } from 'react'
import useBookSearch from '../hooks/useBookSearch';

const Books = () => {
  const[query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPageNumber(1);
  }

  const {
    loading,
    error,
    books,
    hasMore
  } = useBookSearch(query, pageNumber);

  const observer = useRef ();
  const lastBookElementRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      console.log(entries);
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  return (
      <div className='books'>
        <input value={query} onChange={handleSearch} />
        <div className='pageNumber'>page: {pageNumber}</div>
        {books.map((book, index) => {
          if (books.length === index + 1) {
            return <div className='box' key={book} ref={lastBookElementRef}>{book}</div>
          } else {
            return <div className='box' key={book}>{book}</div>
          }
          
        })}
      <div className='loading'> { loading && 'Loading...' } </div>
      <div> {error && 'Error...'} </div>
      </div>
  )
}

export default Books
