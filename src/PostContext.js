import { createContext, useContext, useState } from "react";
import { faker } from "@faker-js/faker";

// Create Random Posts Function
function createRandomPost() {
    return {
        title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
        body: faker.hacker.phrase(),
    };
}

// Context
const PostContext = createContext()

// Component
function PostProvider({children}) {
    const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost()));
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

    function handleAddPost(post) {
        setPosts((posts) => [post, ...posts]);
    }

    function handleClearPosts() {
        setPosts([]);
    }

    return (
        <PostContext.Provider value={{
            posts: searchedPosts,
            onAddPost: handleAddPost,
            onClearPosts: handleClearPosts,
            searchQuery,
            setSearchQuery
        }}>
            {children}
        </PostContext.Provider>
    )
}

// Custom Hook
function usePosts() {
    const context = useContext(PostContext)

    // error message if context is used outside of PostProvider
    if(context === undefined) {
        throw new Error('PostContext was used outside of PostProvider')
    }

    return context
}

export {PostProvider, usePosts}