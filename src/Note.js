import React, { Component } from 'react';
import './App.css';
import Draggable from 'react-draggable';

class Note extends Component {

  constructor(props) {

    super(props);

    this.state = {
      editing: false,
    };

    this._edit = this._edit.bind(this);
    this._remove = this._remove.bind(this);
    this._save = this._save.bind(this);
    this._renderForm = this._renderForm.bind(this);
    this._randomBetween = this._randomBetween.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (this.props.children !== nextProps.children || 
            this.state !== nextState);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.editing) {
      this.refs.newText.focus();
      this.refs.newText.select();
    }
  }

  componentWillMount() {
    this.style = {
      top: this._randomBetween(0, window.innerHeight - 150, 'px'),
      right: this._randomBetween(0, window.innerWidth - 150, 'px')
    };
  }

  _edit() {
    this.setState({ editing: true });
    console.log('Editing note');
  }

  _save() {
    this.props.onChange(this.refs.newText.value, this.props.id);
    this.setState({ editing: false });
  }

  _remove() {
    this.props.onRemove(this.props.id);
  }

  _randomBetween(x, y, s) {
    return (x + Math.ceil(Math.random() * (y - x) )) + s;
  }

  _renderForm() {
    return (
      <div className="note"
           style={this.style}>
        <textarea ref="newText"
                  defaultValue={this.props.children}></textarea>
        <button onClick={this._save}>Save</button>
      </div>
    );
  }


  _renderDisplay() {
    return (
      <div className="note"
           style={this.style}>
        <p>{this.props.children}</p>
        <span>
          <button onClick={this._edit}>Edit</button>
          <button onClick={this._remove}>X</button>
        </span>
      </div>
    );
  }

  render() {
    return (
      <Draggable>
        {this.state.editing ? this._renderForm() : this._renderDisplay()}
      </Draggable>
    );
  }
}

export default Note;
