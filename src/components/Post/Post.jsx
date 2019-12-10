import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { Popover } from "antd";
import {
  PostContainer,
  PostHeader,
  PostCard,
  ProfileWrapper,
  NameWrapper,
  ProfileName,
  ProfileAvatar,
  PostCreation,
  PostContent,
  PostFooter,
  LikesWrapper,
  LikesDisplay,
  LikesLogo,
  PopButton,
  // LikesCount,
  // Likes,
  // LikesAvatar,
  // LikesNames,
  FeedbackWrapper,
  CommentsWrapper,
  CommentsLogo,
  CommentsCount,
  SharesWrapper,
  SharesLogo,
  SharesCount,
  LikesHeading,
  CommentsHeading,
  SharesHeading,
  CommentsContainer
  // StyledStrong
} from "./Post.styles";
import CommentsSVG from "../../assets/icons/comments-post-icon.svg";
import LikesSVG from "../../assets/icons/like-post-icon.svg";
import SharesSVG from "../../assets/icons/share-post-icon.svg";
// import FirstLikeAvatar from "../../../../../assets/images/like1-image.jpg";
import ThreeDotsSvg from "../../assets/icons/three-dots-icon.svg";
import CreateComment from "../Comment/CreateComment";
import CommentList from "../Comment/CommentList";
import {
  DELETE_POST,
  GET_POSTS_BY_USERNAME
} from "../../utils/graphql/queries";

export default function Post({ post, user }) {
  const [deletePost] = useMutation(DELETE_POST, {
    variables: {
      postId: post.id
    },
    update: proxy => {
      const data = proxy.readQuery({
        query: GET_POSTS_BY_USERNAME,
        variables: {
          username: user.username
        }
      });

      const newPostList = data.getPosts.filter(p => p.id !== post.id);

      const newData = { getPosts: [...newPostList] };

      proxy.writeQuery({
        query: GET_POSTS_BY_USERNAME,
        variables: {
          username: user.username
        },
        data: newData
      });
    }
  });

  const SettingsPopup = (
    <div>
      <PopButton type="link" onClick={deletePost}>
        Delete Post
      </PopButton>
    </div>
  );
  return (
    <PostContainer>
      <PostCard bodyStyle={{ padding: "0" }} bordered={false}>
        <PostHeader>
          <ProfileWrapper>
            <ProfileAvatar size="large" shape="circle" src={user.coverImage} />
            <NameWrapper>
              <ProfileName>{user.username}</ProfileName>
              <PostCreation>
                {new Date(Number(post.creationDate)).toLocaleDateString(
                  "en-US"
                )}
              </PostCreation>
            </NameWrapper>
          </ProfileWrapper>
          <Popover content={SettingsPopup} placement="bottomRight">
            <img
              style={{
                marginLeft: "20px",
                width: "22px",
                cursor: "pointer"
              }}
              src={ThreeDotsSvg}
              alt="Settings Icon"
            />
          </Popover>
        </PostHeader>
        <PostContent>{post.content}</PostContent>
        <PostFooter>
          <LikesWrapper>
            <LikesDisplay>
              <LikesLogo src={LikesSVG} alt="likes_logo" />
              {/* <LikesCount>
                {post.likedBy.count === undefined ? "0" : post.likedBy.count}
              </LikesCount> */}
              <LikesHeading>Like</LikesHeading>
            </LikesDisplay>
            {/* {post.likedBy.count > 0 && (
              <Likes>
                <LikesAvatar
                  shape="circle"
                  src={FirstLikeAvatar}
                  alt="FirstLikeAvatar"
                />
              </Likes>
            )} */}
            {/* {post.likedBy.count > 0 && (
              <LikesNames>
                <StyledStrong>Jenny, </StyledStrong>
                <StyledStrong>Robert</StyledStrong>
                <br />
                and 6 more liked this
              </LikesNames>
            )} */}
          </LikesWrapper>
          <FeedbackWrapper>
            <CommentsWrapper>
              <CommentsLogo src={CommentsSVG} alt="CommentsLogo" />
              <CommentsCount>
                {/* {post.likedBy.count === undefined ? "0" : post.likedBy.count} */}
              </CommentsCount>
              <CommentsHeading>Comment</CommentsHeading>
            </CommentsWrapper>
            <SharesWrapper>
              <SharesLogo src={SharesSVG} alt="SharesLogo" />
              <SharesCount>
                {/* {post.likedBy.count === undefined ? "0" : post.likedBy.count} */}
              </SharesCount>
              <SharesHeading>Share</SharesHeading>
            </SharesWrapper>
          </FeedbackWrapper>
        </PostFooter>
      </PostCard>
      <CommentsContainer>
        <CommentList post={post} />
        <CreateComment userAvatar={user.coverImage} postId={post.id} />
      </CommentsContainer>
    </PostContainer>
  );
}
