import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchPosts } from '../utils/service';
import { Post } from '../types/Post';

export const PostsList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const observer = useRef<IntersectionObserver>();

  const loadMorePosts = useCallback(async () => {
    setLoading(true);

    const newPosts = await fetchPosts({ page, limit: 10 });

    setPosts(prevPosts => [...prevPosts, ...newPosts]);

    setLoading(false);
  }, [page]);

  const lastPostElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          setPage(prevPage => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading]
  );

  useEffect(() => {
    void loadMorePosts();
  }, [loadMorePosts]);

  return (
    <div>
      <h1>Your Feed</h1>
      <ul>
        {posts?.map((post, index) => (
          <li
            key={post.id}
            ref={posts.length === index + 1 ? lastPostElementRef : null}
          >
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
      {loading && <p>Loading...</p>}
    </div>
  );
};
