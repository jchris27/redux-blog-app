import { useSelector } from "react-redux"
import { selectPostById } from "./postSlice"
import TimeAgo from "./TimeAgo"
import ReactionButton from "./ReactionButton"
import PostAuthor from "./PostAuthor"
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"

const SinglePostPage = () => {
    // retrieve postId
    //get the postId from the url parameter
    const { postId } = useParams()
    const post = useSelector((state) => selectPostById(state, Number(postId)))

    if (!post) {
        return (
            <p>No post found!</p>
        )
    }

    return (
        <article>
            <p>#{post.id}</p>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <p className="postCredit">
                <Link to={`/post/edit/${post.id}`} >Edit Post</Link>
                <PostAuthor userId={post.userId} />
                <TimeAgo timestamp={post.date} />
            </p>
            <ReactionButton post={post} />
        </article>
    )
}

export default SinglePostPage