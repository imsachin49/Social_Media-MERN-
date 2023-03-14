import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import { useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from '@mui/material/CircularProgress';

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  createdAt,
  location,
  picturePath,
  userPicturePath,
  likes,
  // comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const user= useSelector((state) => state.user);

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const [like, setLike] = useState(Object.keys(likes).length);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);

  const deleteAccess = (loggedInUserId === postUserId) || user.isAdmin;

  useEffect(() => {
    setIsLiked(likes[loggedInUserId]);
  }, [loggedInUserId, likes]);
  console.log(postId);

  const patchLike = async () => {
    try{
      const response = await fetch(`https://apni-duniya-social.vercel.app/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
        body: JSON.stringify({ userId: loggedInUserId }),
      });
        const updatedPost = await response.json();
        dispatch(setPost({ post: updatedPost }));
    } catch(err){
      console.log(err);
    }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };  

  const deletePost = async (id) => {
    try{
      setLoading(true);
      const response = await fetch(`https://apni-duniya-social.vercel.app/posts${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
        body: JSON.stringify({ userId: loggedInUserId }),
      });
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setLoading(false);  
      window.location.reload();
    } catch(err){
      console.log(err);
    }
  }  

  // const commentId=JSON.stringify(comments);
  // console.log(typeof(Comments))

  const fetchComments = async () => {
    try{
      const response = await fetch(`https://apni-duniya-social.vercel.app/comments/${postId}/comments`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({ userId: loggedInUserId }),
    }); 
      const cmt = await response.json();
      setComments(cmt);
    } catch(err){
      console.log(err);
    }
  }

  // console.log(comments)





  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={createdAt}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.5rem", marginTop: "0.75rem"}}
          src={picturePath ? picturePath : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfM0aJHdAY3DIDcz5FjsL3B2ZZjrSNzh-z6w&usqp=CAU"}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: 'red' }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{like}</Typography>
          </FlexBetween>

          {/* //comment adding soon */}

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            {/* <Typography>{comments.length}</Typography> */}
          </FlexBetween>

        </FlexBetween>

        {deleteAccess && 
          <IconButton onClick={()=>deletePost(`/${postId}`)}>
            {!loading ? <DeleteIcon /> : <CircularProgress />}
          </IconButton>
        }

      </FlexBetween>
      {/* {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment) => (
            <Box key={comment._id}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment}
              </Typography>
            </Box>
          ))}
          <Divider />
        </Box>
      )} */}
    </WidgetWrapper>
  );
};

export default PostWidget;
