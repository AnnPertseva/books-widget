import React, { Component } from "react";
import {withRouter} from "react-router-dom"
import queryString from 'query-string';
import data from '../../data'
import Tabs from './Tabs.js';
import Filters from './Filters.js';
import List from './List.js';

import '../styles/App.css';

class App extends Component {
  constructor(props) {
    super(props);
    const {tab = 'toread', tags = []} = queryString.parse(props.location.search, {arrayFormat: 'comma'});
    this.tabs = [
      {id: 'toread', name: 'To read'},
      {id: 'inprogress', name: 'In progress'},
      {id: 'done', name: 'Done'}
    ];
    this.state = {
      books: data.items,
      inProgressBooks: localStorage.getItem('inprogress') || [],
      doneBooks: localStorage.getItem('done') || [],
      tab: tab ,
      tags: (typeof tags === 'string') ? [tags] : [...tags]
    }
  }

  filterMethod(book) {
    if(this.state.tags.length > 0) {
      return book.tags.filter(tag => this.state.tags.includes(tag)).length > 0
    }
    return true;
  }
  handleChangeTab(tab) {
    this.setState({'tab': tab});
  }
  handleAddTag(tag) {
    if(!this.state.tags.includes(tag)) {
      this.setState((prevState) => {
        return {'tags': [...prevState.tags, tag]};
      });
    }
  }
  handleMoveBook(id) {
    const activeTab = this.state.tab.toLowerCase();
    const {from, to} = this.getTabParams(activeTab);

    this.setState((prevState) => {
      const index = prevState[from].findIndex(book=>book.id === id);
      const book = prevState[from].splice(index, 1);
      return {
        [to]: [...prevState[to], ...book],
        [from]: [...prevState[from]]
      };
    }, this.saveToLS());
  }
  saveToLS () {
    //todo
  }
  getTabParams(activeTab) {
    switch (activeTab) {
      case 'toread' :
        return {
          source: this.state.books,
          from: 'books',
          to: 'inProgressBooks'
        }
      case 'inprogress' :
        return {
          source: this.state.inProgressBooks,
          from: 'inProgressBooks',
          to: 'doneBooks'
        }
      case 'done' :
        return {
          source: this.state.doneBooks,
          from: 'doneBooks',
          to: 'inProgressBooks'
        }
    }
  }
  render() {
    const filterMethod = this.filterMethod.bind(this);
    const activeTab = this.state.tab.toLowerCase();
    const {source} = this.getTabParams(activeTab);
    return (
      <div>
        <Tabs
          active={activeTab}
          tabs={this.tabs}
          tags={this.state.tags}
          onClick={this.handleChangeTab.bind(this)}
        />
        { this.state.tags.length > 0 && <Filters/>}
        <List
          books={source.filter(filterMethod)}
          onTagClick={this.handleAddTag.bind(this)}
          onMoveClick={this.handleMoveBook.bind(this)}/>
      </div>
    );
  }
}

export default withRouter(App);