import React from "react";
import { connect } from "react-redux";

const Post = () => <></>;

const Feed = () => <h1 />;

export default connect(state => state)(Feed);

export { default as epics } from "./epics";
