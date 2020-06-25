import React, {Component} from "react";
import { Link } from "react-router-dom"
import {
    AutoSizer,
    List as VirtualizedList,
    CellMeasurer,
    CellMeasurerCache
} from 'react-virtualized';
import '../styles/List.css';

class List extends Component {
  constructor(props) {
    super(props);
    this.cache = new CellMeasurerCache({
        defaultHeight: 80,
        minHeight: 50,
        fixedWidth: true,
    });
  }
  componentDidMount () {
    this.resizeList();
  }
  componentDidUpdate () {
    this.resizeList();
  }
  resizeList() {
    this.cache.clearAll();
    this.list && this.list.recomputeRowHeights();
  }

  rowRenderer({key, index, parent, style}) {
    const book = this.props.books[index];
    const tagsList = book.tags.map((tag) =>
      <span
        className="tag"
        onClick={e=>this.props.onTagClick(tag)}
        key={tag}
      >
        {tag}
      </span>
    );

    return (
    <CellMeasurer
      cache={this.cache}
      columnIndex={0}
      key={key}
      parent={parent}
      rowIndex={index}
    >
      <div
        className="Row"
        key={key}
        style={{
        ...style,
        display: 'flex',
        }}
      >
        <div>{book.author}</div>
        <div class="rowHeader">
          <div>{book.title}</div>
          <div
            onClick={e=> this.props.onMoveClick(book.id)}
            key={book.id}
            className="moveBookLink"
          >
            move &#8594;
          </div>
        </div>
        <div>{book.description}</div>
        <div className="tagsList">{tagsList}</div>
      </div>
    </CellMeasurer>
  )};

  render () {
    return (
      <AutoSizer>
        {({ height, width }) => {

          if (this.recentWidth && this.recentWidth !== width) {
            setTimeout(this.resizeList.bind(this), 0);
          }
          this.recentWidth = width;

          return (
            <VirtualizedList
              width={width}
              height={300}
              rowHeight={this.cache.rowHeight}
              ref={(list)=>{this.list = list}}
              rowGetter={({ index }) => this.props.books[index]}
              rowCount={this.props.books.length}
              rowRenderer={this.rowRenderer.bind(this)}
              className="booksList"
            />
          )
        }}
      </AutoSizer>
    );
  }
}
export default List