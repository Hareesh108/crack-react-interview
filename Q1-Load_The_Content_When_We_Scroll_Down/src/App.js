// src/App.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const App = () => {
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef();

  const loadComments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://jsonplaceholder.typicode.com/comments?_page=${page}&_limit=100`);
      setComments((prevComments) => [...prevComments, ...res.data]);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadComments();
  }, [page]);

  const lastCommentElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  return (
    <div>
      <h1>Comments</h1>
      <ul>
        {comments.map((comment, index) => {
          if (index === comments.length - 1) {
            return (
              <li ref={lastCommentElementRef} key={comment.id}>
                <strong>{comment.name}</strong>: {comment.body}
              </li>
            );
          } else {
            return (
              <li key={comment.id}>
                <strong>{comment.name}</strong>: {comment.body}
              </li>
            );
          }
        })}
      </ul>
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default App;
