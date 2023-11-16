import { createContext, useContext, useState } from "react";
import { faker } from "@faker-js/faker";

// Helper function
function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

// 1) Create a new Context (for posts)
const PostContext = createContext();

// Creating PostProvider component that will wrap the components that will need the access to the Context API
function PostProvider({ children }) {
  // Creating state values
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  // Handler functions
  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }

  return (
    // 2) Provide value to child components
    <PostContext.Provider
      value={{
        posts: searchedPosts,
        onAddPost: handleAddPost,
        onClearPosts: handleClearPosts,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

// Custom hook for getting the state from Context API
function usePosts() {
  // Getting the state from the context
  const context = useContext(PostContext);

  // Guard clause
  if (context === undefined)
    throw new Error("PostContext was used outside of its scope");

  // Returning the context
  return context;
}

export { PostProvider, usePosts };
