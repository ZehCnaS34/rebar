import React from "react";
import styled from "react-emotion";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Item, Row, Column } from "../Common/Components/Structure";
import { Button } from "../Common/Components/Fields";
import { Input, Submit } from "../Form";
import { setupFirebase, createPost } from "./action";
import * as s from "./selector";

const PostContainer = styled.div`
  margin: 0.3rem;
  border-radius: 0.01rem;
  box-shadow: 0 2px 0rem -1px black;
`;

const SocialButtons = () => (
  <div>
    <Button>Like</Button>
  </div>
);

const Post = ({ data: { content } }) => (
  <PostContainer>
    <p>{content}</p>
    <SocialButtons />
  </PostContainer>
);

class Feed extends React.Component {
  componentDidMount() {
    this.props.setupFirebase();
  }

  onSubmit = fields => {
    this.props.createPost(fields["feed.input"]);
  };

  render() {
    return (
      <Item>
        <h1>Feed</h1>
        <Column>
          <Item>
            <Row>
              <Item>
                <Input name="feed.input" />
              </Item>
              <Submit
                label={"send"}
                fields={["feed.input"]}
                resetOnSubmit
                onSubmit={this.onSubmit}
              />
            </Row>
          </Item>
        </Column>

        {this.props.orderedPosts.map((post, i) => (
          <Item key={i}>
            <Post data={post} />
          </Item>
        ))}
      </Item>
    );
  }
}

export default connect(
  state => ({
    orderedPosts: s.orderedPosts(state)
  }),
  dispatch => bindActionCreators({ setupFirebase, createPost }, dispatch)
)(Feed);

export { default as epics } from "./epics";
export { default as reducer } from "./reducer";
