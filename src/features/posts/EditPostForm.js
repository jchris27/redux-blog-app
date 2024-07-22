import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { deletePost, selectPostById, updatePost } from "./postSlice"
import { useParams, useNavigate } from "react-router-dom"
import { selectAllUsers } from "../users/usersSlice"

const EditPostForm = () => {
    const { postId } = useParams()
    const navigate = useNavigate()

    // select post by id
    const post = useSelector((state) => selectPostById(state, Number(postId)))
    const users = useSelector(selectAllUsers)

    const [title, setTitle] = useState(post?.title)
    const [content, setContent] = useState(post?.body)
    const [userId, setUserId] = useState(post?.userId)
    const [addRequestStatus, setAddRequestStatus] = useState('idle')
    const dispatch = useDispatch();

    if (!post) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        )
    }

    const renderOptions = users.map(user => (
        <option key={user.id} value={user.id}>
            {user.name}
        </option>
    ))

    const onTitleChange = (e) => {
        setTitle(e.target.value)
    }
    const onContentChanged = (e) => {
        setContent(e.target.value)
    }
    const onAuthorChanged = (e) => {
        setUserId(Number(e.target.value))
    }

    // check if all forms are true
    const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle'

    const onSavePostClicked = () => {
        if (canSave) {
            try {
                setAddRequestStatus('pending')
                //update the post
                dispatch(updatePost({ id: post.id, title, body: content, userId, reactions: post.reactions })).unwrap()

                setTitle("")
                setContent("")
                setUserId("")
                navigate(`/post/${postId}`)
            } catch (err) {
                console.error('Failed to save the post', err)
            } finally {
                setAddRequestStatus('idle')
            }
        }
    }

    const onDeletePostClicked = () => {
        try {
            setAddRequestStatus('pending')
            dispatch(deletePost({ id: post.id })).unwrap()

            setTitle("")
            setContent("")
            setUserId("")
            navigate(`/`)
        } catch (err) {
            console.error('Failed to delete the post', err)
        } finally {
            setAddRequestStatus('idle')
        }
    }

    const renderContent = (
        <section>
            <h2>Edit Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title: </label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChange}
                />
                <label htmlFor="postAuthor">Author: </label>
                <select id="postAuthor" value={userId} name="postAuthor" onChange={onAuthorChanged}>
                    <option value=""></option>
                    {renderOptions}
                </select>
                <label htmlFor="postContent">Content: </label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
                <button disabled={!canSave} onClick={onSavePostClicked} type="button">Save Post</button>
                <button className="deleteButton" type="button" onClick={onDeletePostClicked}>
                    Delete Post
                </button>
            </form>
        </section>
    )

    return renderContent
}

export default EditPostForm