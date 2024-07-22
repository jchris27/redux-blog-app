import { useSelector, useDispatch } from "react-redux";
import { selectPostIds, getPostsStatus, getPostsError } from "./postSlice";
import PostsExcerpts from "./PostsExcerpts";

const PostsList = () => {
    const dispatch = useDispatch()
    // get all posts state
    // const posts = useSelector(selectAllPosts)
    const orderedPostIds = useSelector(selectPostIds)
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
        // const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
        content = orderedPostIds.map(post => <PostsExcerpts postId={post} key={post} />)

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