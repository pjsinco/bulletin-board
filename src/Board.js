import React, { Component } from 'react';
import './App.css';
import Note from './Note';
import 'isomorphic-fetch';
require('es6-promise').polyfill();

class Board extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      //{ id: 0, note: 'Call Bob' },
      notes: []
    };

    this._update = this._update.bind(this);
    this._remove = this._remove.bind(this);
    this._eachNote = this._eachNote.bind(this);
    this._add = this._add.bind(this);
    this._nextId = this._nextId.bind(this);
  }

  componentWillMount() {
    if (this.props.count) {

      const url = `http://www.randomtext.me/api/lorem/p-${this.props.count}/5-15/`;
      fetch(url)
        .then(response => response.json())
        .then(json => json.text_out)
        .then(text => text.split('\r'))
        .then(graphs => graphs.forEach(graph => {
          this._add(graph);
        }))
        .catch(function(err) { 
            console.log('parsing failed: ' + err);
            });

    }
  }

  _add(newText) {

    const notes = [
      ...this.state.notes,
      { id: this._nextId(), note: newText }
    ];
  
    this.setState({ notes: notes });
  }

  _nextId() {
    this.uniqueId = this.uniqueId || 0;
    return this.uniqueId++;
  }

  _update(newText, id) {
    const notes = this.state.notes.map((note) => {
      return (note.id !== id ? note : { id: note.id, note: newText });
    });

    this.setState({ notes: notes });
  }

  _remove(id) {
    const notes = this.state.notes.filter((note) => {
      return note.id !== id;
    });

    this.setState({ notes: notes });
  }


  _eachNote(note) {
    return ( 
      <Note key={note.id}
            id={note.id}
            onChange={this._update}
            onRemove={this._remove}>
        {note.note}
      </Note> 
    );
  }

  render() {

    return (
      <div className="board">
        {this.state.notes.map(this._eachNote)}
        <button onClick={() => this._add('new note')}>+</button>
      </div>
    );
  }
}

Board.propTypes = {
  //count: React.PropTypes.number
  count: (props, propName) => {
    if (typeof props[propName] !== 'number') {
      return new Error('The count must be a number');
    }

    if (props[propName] > 100) {
      return new Error(`Creating ${props[propName]} notes is ridiculous`);
    }
  }
};

export default Board;
