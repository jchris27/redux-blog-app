import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButton from "./ReactionButton";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectPostById } from "./postSlice";

const PostsExcerpts = ({ postId }) => {
    const post = useSelector(state => selectPostById(state, postId))
    return (
        <article>
            <p>#{post.id}</p>
            <h2>{post.title}</h2>
            <p className="excerpt">{post.body.substring(0, 75)}...</p>
            <p className="postCredit">
                <Link to={`post/${post.id}`}>View Post </Link>
                <PostAuthor userId={post.userId} />
                <TimeAgo timestamp={post.date} />
            </p>
            <ReactionButton post={post} />
        </article>
    )
}

export default PostsExcerpts