import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { IPost, IComment } from "../helpers/types";
import { BASE } from "../helpers/default";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { handleCommentUpload } from "../helpers/api";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  height: 700,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface IProps {
  open: boolean;
  post: IPost;
  onClose: () => void;
}

export function Preview({ open, onClose, post }: IProps) {
  const [text, setText] = useState<string>("");
  const [comments, setComments] = useState<IComment[]>(post.comments);

  useEffect(() => {
    setComments(post.comments);
  }, [post]);

  const handleComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const commentData = {
      text: text,
    };
    handleCommentUpload(commentData, post.id).then((response) => {
      const newComment = response.payload as IComment;

      setComments((prevComments) => [...prevComments, newComment]);
      setText("");
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {post.title}
        </Typography>
        <div className="contentStyle">
          <img
            src={BASE + post.picture}
            alt={post.title}
            className="imageStyle"
          />
          <div className="likesStyle">
            <Typography variant="subtitle1">
              <div style={{ display: "flex", alignItems: "center" }}>
                <strong style={{ marginRight: "8px" }}>
                  {post.likes.length} likes, {comments.length} comments
                </strong>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ marginRight: "8px" }}>likes:</p>
              </div>
            </Typography>
            {post.likes.length > 0 ? (
              <ul style={{ padding: 0, margin: 0, listStyleType: "none" }}>
                {post.likes.map((user, index) => (
                  <li key={index} className="likeItemStyle">
                    <img
                      src={BASE + user.picture}
                      alt={`${user.name} ${user.surname}`}
                      className="profilePicStyle"
                    />
                    <Link to={`/profile/${user.id}`}>
                      {user.name} {user.surname}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <Typography>No likes yet</Typography>
            )}
            <div className="commentsStyle">
              <Typography variant="subtitle1">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <p style={{ marginRight: "8px" }}>comments:</p>
                </div>
              </Typography>
              {comments.length > 0 ? (
                <ul style={{ padding: 0, margin: 0, listStyleType: "none" }}>
                  {comments.map((comment, index) => (
                    <li key={index} className="commentItemStyle">
                      <strong>{comment.user.name} says</strong>:
                      <br />
                      <p>{comment.content}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography>No comments yet</Typography>
              )}
            </div>
            <form onSubmit={handleComment} style={{ marginTop: "20px" }}>
              <input
                placeholder="What you think?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ padding: "8px", width: "100%" }}
              />
            </form>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
