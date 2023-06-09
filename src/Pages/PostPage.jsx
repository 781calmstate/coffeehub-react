import React, { useEffect, useState } from 'react';
import PostService from '../API/PostService';
import PostFilter from '../components/PostFilter';
import PostForm from '../components/PostForm';
import PostList from '../components/PostList';
import { useFetching } from '../hooks/useFetching';
import { usePosts } from '../hooks/usePosts';
import MyButton from '../UI/button/MyButton';
import Loader from '../UI/loader/Loader';
import MyModal from '../UI/MyModal/MyModal';
import Pagination from '../UI/pagination/Pagination';
import { getPageCount } from '../utils/pages';

function PostPage() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState({ sort: '', query: '' });
  const [modal, setModal] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);
  const [fetchPosts, isPostLoading, postError] = useFetching(async () => {
    const response = await PostService.getAll(limit, page);
    setPosts(response.data);
    const totalCount = response.headers['x-total-count'];
    setTotalPages(getPageCount(totalCount, limit));
  });

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const createPost = (newPost) => {
    setPosts([...posts, newPost]);
    setModal(false);
  };

  const removePost = (post) => {
    setPosts(posts.filter((p) => p.id !== post.id));
  };

  const changePage = (page) => {
    setPage(page);
  };

  return (
    <div style={{ marginTop: '120px' }} className="App">
      <MyButton style={{ marginTop: 30 }} onClick={() => setModal(true)}>
        Create user
      </MyButton>
      <MyModal visible={modal} setVisible={setModal}>
        <PostForm create={createPost} />
      </MyModal>
      <hr style={{ margin: '15px 0' }} />
      <PostFilter filter={filter} setFilter={setFilter} />
      {postError && <h1>Error ${postError}</h1>}
      {isPostLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50' }}>
          <Loader />
        </div>
      ) : (
        <PostList remove={removePost} posts={sortedAndSearchedPosts} title="COFFEE POSTS :)" />
      )}
      <Pagination totalPages={totalPages} page={page} changePage={changePage} />
    </div>
  );
}

export default PostPage;
