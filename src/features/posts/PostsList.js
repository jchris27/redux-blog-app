import { useSelector, useDispatch } from "react-redux";
import { selectAllPosts, getPostsStatus, getPostsError } from "./postSlice";
import PostsExcerpts from "./PostsExcerpts";
import { nanoid } from "@reduxjs/toolkit";

const PostsList = () => {
    const dispatch = useDispatch()
    // get all posts state
    const posts = useSelector(selectAllPosts)
    const postsStatus = useSelector(getPostsStatus)
    const postsError = useSelector(getPostsError)

    let content;
    if (postsStatus === 'loading') {
        // good place to put a loading spinner component here
        content = <p>"Loading..."</p>
    } else if (postsStatus === 'succeeded') {
        // sort the order
        // create a shallow copy using slice()
        // return -1 or +1 or 0 based on if 1 > the other,
        // it converts it date string using localeCompate function
        const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
        content = orderedPosts.map(post => <PostsExcerpts post={post} key={`${post.id} + ${nanoid()}`} />)

    } else if (postsStatus === 'failed') {
        content = <p>{postsError}</p>
    }

    return (
        <section>
            {content}
        </section>
    )
}

export default PostsList