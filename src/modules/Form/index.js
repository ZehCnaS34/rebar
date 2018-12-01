import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as Fields from "../Common/Components/Fields";
import { bindActionCreators } from "redux";

import {
  registerField,
  unregisterField,
  updateField,
  resetField
} from "./action";
import { throwError } from "rxjs";

export const Input = connect(
  state => state.form.toJS(),
  dispatch =>
    bindActionCreators(
      { registerField, unregisterField, updateField },
      dispatch
    )
)(
  class extends React.Component {
    static propTypes = {
      name: PropTypes.string.isRequired
    };

    componentDidMount() {
      this.props.registerField(this.props.name);
    }

    componentWillUnmount() {
      this.props.unregisterField(this.props.name);
    }

    render() {
      const inputProps = {
        onChange: e => this.props.updateField(this.props.name, e.target.value)
      };

      if (this.props[this.props.name]) {
        inputProps.value = this.props[this.props.name].value;
      }

      return <Fields.Input {...inputProps} />;
    }
  }
);

export const Submit = connect(
  state => state.form.toJS(),
  dispatch =>
    bindActionCreators(
      { registerField, unregisterField, updateField, resetField },
      dispatch
    )
)(
  class extends React.Component {
    static propTypes = {
      label: PropTypes.string.isRequired,
      onSubmit: PropTypes.func.isRequired,
      fields: PropTypes.array.isRequired,
      resetOnSubmit: PropTypes.bool
    };

    static defaultProps = {
      resetOnSubmit: false
    };

    submit = () => {
      this.props.onSubmit(
        this.props.fields.reduce(
          (output, field) => ({
            ...output,
            [field]: this.props[field].value
          }),
          {}
        )
      );

      if (this.props.resetOnSubmit) {
        for (const field of this.props.fields) {
          this.props.resetField(field);
        }
      }
    };

    render() {
      return <button onClick={this.submit}>{this.props.label}</button>;
    }
  }
);

export { default as reducer } from "./reducer";
