import { Post } from '../types/Post';

export const fetchPosts = async ({
  page,
  limit
}: {
  page: number;
  limit: number;
}) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`
  );

  const data = (await response.json()) as Post[];

  return data;
};
