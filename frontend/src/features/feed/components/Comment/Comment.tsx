import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../../../components/Input/Input";
import {
  IUser,
  useAuthentication,
} from "../../../authentication/contexts/AuthenticationContextProvider"; 
import { TimeAgo } from "../TimeAgo/TimeAgo";
import classes from "./Comment.module.scss";
const BASE_URL = import.meta.env.VITE_USER_PROFILE_BASE_URL;

export interface IComment {
  id: number;
  content: string;
  author: IUser;
  creationDate: string;
  updatedDate?: string;
}

interface ICommentProps {
  comment: IComment;
  deleteComment: (commentId: number) => Promise<void>;
  editComment: (commentId: number, content: string) => Promise<void>;
  onReport?: () => Promise<void>; 
}

export function Comment({ comment, deleteComment, editComment, onReport }: ICommentProps) {
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);
  const [editing, setEditing] = useState(false);
  const [commentContent, setCommentContent] = useState(comment.content);
  const [showMenuReport, setShowMenuReport] = useState(false);
  const { user } = useAuthentication();
  const handleReport = async () => {
  if (onReport) {
    await onReport();
  }
};

return (
  <div key={comment.id} className={classes.root}>
    {!editing ? (
      <>
        <div className={classes.header}>
          <button
            onClick={() => {
              navigate(`/profile/${comment.author.id}`);
            }}
            className={classes.author}
          >
            <img
              className={classes.avatar}
              src={`${BASE_URL}${comment.author.profilePicture} ` || "/avatar.svg"}
              alt="Image"
            />
            <div>
              <div className={classes.name}>
                {comment.author.firstName + " " + comment.author.lastName}
              </div>
              <div className={classes.title}>
                {comment.author.position + " at " + comment.author.company}
              </div>
              <TimeAgo date={comment.creationDate} edited={!!comment.updatedDate} />
            </div>
          </button>

          {comment.author.id === user?.id && (
            <button
              className={`${classes.action} ${showActions ? classes.active : ""}`}
              onClick={() => setShowActions(!showActions)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512">
                <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
              </svg>
            </button>
          )}

          {comment.author.id !== user?.id && (
            <div className={classes.menuWrapper}>
              <button
                className={`${classes.toggle} ${showMenuReport ? classes.active : ""}`}
                onClick={() => setShowMenuReport(!showMenuReport)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512">
                  <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                </svg>
              </button>

              {showMenuReport && (
                <div className={classes.reportButton}>
                  <button onClick={handleReport} className={classes.report}>
                    Report Comment
                  </button>
                </div>
              )}
            </div>
          )}

          {showActions && (
            <div className={classes.actions}>
              <button onClick={() => setEditing(true)}>Edit</button>
              <button onClick={() => deleteComment(comment.id)}>Delete</button>
            </div>
          )}
        </div>

        <div className={classes.content}>{comment.content}</div>
      </>
    ) : (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await editComment(comment.id, commentContent);
          setEditing(false);
          setShowActions(false);
        }}
      >
        <Input
          type="text"
          value={commentContent}
          onChange={(e) => {
            setCommentContent(e.target.value);
          }}
          placeholder="Edit your comment"
        />
      </form>
    )}
  </div>
);
}

export default Comment;
