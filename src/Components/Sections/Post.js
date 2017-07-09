import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from "react-redux";
import { viewPost } from '../../Actions/actionsCreator';
import PostDetails from './PostDetails';
import $ from 'jquery-lite'

import classnames from 'classnames';

const Post = (props) => {

  var postClass = '';
  var showPost = true;
  var showPostDetails = false;

  // showPost = !$.isEmptyObject(props.currentPost) && props.currentPost.id == props.object.id ? 'active-post' : null;

  if (!$.isEmptyObject(props.currentPost)) {
    if (props.currentPost.id == props.object.id) {
      showPost = true;
      showPostDetails = true;
      postClass = 'active-post';

    }
    else {
      showPost = false;
    }
  }

  return (
    // 
    showPost ?
      <div  className={postClass}> 
        <div className="post-content" onClick={() => props.viewPost(props.object)}>
          {/*<NavLink to={'/view'}>*/}
          <div className="post-image">
            <img src={props.object.display_src} />
          </div>

          <p>{props.object.likes}</p>
          <p>{props.object.type}</p>


        </div>
       {showPostDetails ? <PostDetails postDetails={props.object} /> : null}
       {/*{showPostDetails ? <TestForms postDetails={props.object} /> : null}*/}
      </div>
      : null
  );

}

const mapStateToProps = (state) => {
  return {
    currentPost: state.posts.currentPost,
    activePost: ''
  };
}


const mapDispatchToProps = dispatch => {
  return {
    viewPost(currentPost, activePost) {
      dispatch(viewPost(currentPost));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Post);