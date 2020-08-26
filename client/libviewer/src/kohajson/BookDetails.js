import React, { Component } from 'react';
// import Grid from '@material-ui/core/Grid';
// import Button from '@material-ui/core/Button';

class BookDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      book: {}
    }
  }

  componentDidMount() {
    this.setState({book: this.props.book});
    console.log("reached BookDetails with book: "+this.props.book);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({book: nextProps.book });
  }

  componentWillUnMount() {
    console.log("exit BookDetails for book: "+this.props.book);
  }

  render() {
    const book=this.state.book;
    return (
      <p>Title: {book.title} </p>
    );
  }
}

export default BookDetails;
