import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { useMutation } from "@apollo/react-hooks";
import { CommentInput, CommentForm, UserAvatar } from "./CreateComment.styles";
import {
  CREATE_COMMENT,
  GET_POSTS,
  GET_URL_POSTS,
  GET_NEWSFEED
} from "../../utils/queries";

const CreateComment = ({ user, postId, urlProfile, onNewsfeed }) => {
  const [body, setBody] = useState("");
  const { username } = useParams();

  // you need to be able to comment on this guy's post ( implement getUrlposts and getPosts )
  const [createComment] = useMutation(CREATE_COMMENT, {
    variables: {
      body,
      postId
    },
    update: (proxy, result) => {
      if (!urlProfile && !onNewsfeed) {
        const data = proxy.readQuery({
          query: GET_POSTS
        });

        const getPosts = data.getPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [...post.comments, result.data.createComment]
            };
          }
          return post;
        });

        proxy.writeQuery({
          query: GET_POSTS,
          data: { getPosts }
        });
      }
      if (urlProfile && !onNewsfeed) {
        const data = proxy.readQuery({
          query: GET_URL_POSTS,
          variables: {
            username
          }
        });

        const getUrlPosts = data.getUrlPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [...post.comments, result.data.createComment]
            };
          }
          return post;
        });
        proxy.writeQuery({
          query: GET_URL_POSTS,
          data: { getUrlPosts },
          variables: {
            username
          }
        });
      }
      if (!urlProfile && onNewsfeed) {
        const data = proxy.readQuery({
          query: GET_NEWSFEED
        });

        const getNewsfeed = data.getNewsfeed.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [...post.comments, result.data.createComment]
            };
          }
          return post;
        });

        proxy.writeQuery({
          query: GET_NEWSFEED,
          data: { getNewsfeed }
        });
      }
    }
  });

  const onSubmit = e => {
    e.preventDefault();
    createComment();
    setBody("");
  };

  return (
    <>
      <CommentForm onSubmit={onSubmit}>
        <UserAvatar src={user.avatarImage} />
        <CommentInput
          name="content"
          placeholder="Write in a comment.."
          onChange={e => setBody(e.target.value)}
          value={body}
        />
      </CommentForm>
    </>
  );
};

export default CreateComment;

CreateComment.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    avatarImage: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
    birthday: PropTypes.string,
    gender: PropTypes.string,
    coverImage: PropTypes.string
  }),
  postId: PropTypes.string,
  urlProfile: PropTypes.bool,
  onNewsfeed: PropTypes.bool
};

CreateComment.defaultProps = {
  user: null,
  postId: null,
  urlProfile: null,
  onNewsfeed: null
};
