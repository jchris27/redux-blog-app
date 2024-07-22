import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from 'date-fns'
import axios from "axios";

// base url
const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts'

// Normalization and Optimization
const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState = postsAdapter.getInitialState({
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    count: 0
})

// async thunk
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    try {
        const response = await axios.get(POSTS_URL)
        return [...response.data]
    } catch (err) {
        return err.message
    }
})

export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost) => {
    try {
        const response = await axios.post(POSTS_URL, initialPost)
        return response.data
    } catch (err) {
        return err.message
    }
})

export const updatePost = createAsyncThunk('posts/updatePost', async (initialPost) => {
    const { id } = initialPost
    try {
        const response = await axios.put(`${POSTS_URL}/${id}`, initialPost)
        return response.data
    } catch (err) {
        // return err.message
        return initialPost // comment this, for testing fake api only
    }
})

export const deletePost = createAsyncThunk('post/deletePost', async (initialPost) => {
    const { id } = initialPost
    try {
        const response = await axios.delete(`${POSTS_URL}/${id}`)
        if (response?.status === 200) return initialPost
        return `${response?.status}: ${response?.statusText}`
    } catch (err) {
        return err.message
    }
})

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        reactionAdded(state, action) {
            // get the post id and reaction from the action payload
            const { postId, reaction } = action.payload
            // check the id from the post
            // const existingPost = state.postsArr.find(post => post.id === postId)
            const existingPost = state.entities[postId]
            // if id matches add a reaction
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        },
        // for testing only optimization and performance
        increaseCount(state, action) {
            state.count = state.count + 1
        }
    },
    // async thunk that happens outside the slice will handle using extraReducer
    extraReducers(builder) {
        // listen to promise action types - the first parameter in addCase
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                // Adding date and reactions
                let min = 1
                const loadedPosts = action.payload.map(post => {
                    post.date = sub(new Date(), { minutes: min++ }).toISOString()
                    post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post
                })
                // Add any fetched posts to the array
                // state.postsArr = state.postsArr.concat(loadedPosts)
                // make a copy of the array, and modify that copy instead of the original one to avoid duplicates in strict mode
                // state.postsArr = [...loadedPosts]
                postsAdapter.upsertMany(state, loadedPosts)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                action.payload.userId = Number(action.payload.userId)
                action.payload.date = new Date().toISOString()
                action.payload.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                }
                // state.postsArr.push(action.payload)
                postsAdapter.addOne(state, action.payload)
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                // if payload does not include an property
                if (!action.payload?.id) {
                    console.log('Update could not complete.', action.payload)
                }
                console.log(action.payload)
                // const { id } = action.payload
                action.payload.date = new Date().toISOString()
                // const posts = state.postsArr.filter(post => post.id !== id)
                // state.postsArr = [...posts, action.payload]
                postsAdapter.upsertOne(state, action.payload)
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log('Delete could not be completed.')
                    console.log(action.payload)
                    return
                }
                const { id } = action.payload
                // const posts = state.postsArr.filter(post => post.id !== id)
                // state.postsArr = [...posts]
                postsAdapter.removeOne(state, id)
            })
    }
})

//create a dynamic selector , if there will be a change in the state it would be better to handle the logic here instead of checking and refactoring every component

// export const selectAllPosts = (state) => state.posts.postsArr;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
export const getCount = (state) => state.posts.count;

// export const selectPostById = (state, postId) => state.posts.postsArr.find(post => post.id === postId)

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds
    // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => state.posts)

// memoize selectors
// createSelect accepts 1 or more functions
export const selectPostsByUser = createSelector([selectAllPosts, (state, userId) => userId], (posts, userId) => posts.filter(post => post.userId === userId))

export const { increaseCount, reactionAdded } = postSlice.actions

export default postSlice.reducer