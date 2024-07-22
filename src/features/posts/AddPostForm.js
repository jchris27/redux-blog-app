import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { postAdded } from "./postSlice"
import { selectAllUsers } from "../users/usersSlice"
import { addNewPost } from "./postSlice"
import { useNavigate } from "react-router-dom"

const AddPostForm = () => {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [userId, setUserId] = useState("")
    const [addRequestStatus, setAddRequestStatus] = useState('idle')
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const users = useSelector(selectAllUsers)

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
        setUserId(e.target.value)
    }

    // check if all forms are true
    const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle'

    const onSavePostClicked = () => {
        if (canSave) {
            try {
                setAddRequestStatus('pending')
                dispatch(addNewPost({ title, body: content, userId })).unwrap()

                setTitle("")
                setContent("")
                setUserId("")
                navigate("/")
            } catch (err) {
                console.error('Failed to save the post', err)
            } finally {
                setAddRequestStatus('idle')
            }
        }
    }

    const renderContent = (
        <section>
            <h2>Add a New Post</h2>
            <form>
                <label htmlFor="postTitle">Title: </label>
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
            </form>
        </section>
    )

    return renderContent
}

export default AddPostForm