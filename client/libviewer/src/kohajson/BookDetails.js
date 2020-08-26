import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import TextField from '@material-ui/core/TextField';
import '../App.css';

class BookDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      book: {}
    }
  }

  componentDidMount() {
    this.setState({book: this.props.book});
  }

  componentWillReceiveProps(nextProps) {
    this.setState({book: nextProps.book });
  }

  componentWillUnMount() {
    console.log("exit BookDetails for book: "+this.props.book);
  }

  validateText(f="", v="") {
    if (v != null && (v.length>0 || v>0)) return v;
    else return "No value for "+f;
  }

  render() {
    const book=this.state.book, val=this.validateText;
    return (
      <div style={{ padding: "0 0 0 3%" }}>
        <Grid container direction="row" justify="flex-start" alignItems="center" spacing={2}>
          <Grid item>
            <Grid container direction="row" justify="flex-start" alignItems="flex-start" spacing={1} paddingleft="5%">
              <Grid item xs={12}> <TextField label="Title" value={val("title", book.title)} fullWidth /></Grid>
              <Grid item> <TextField label="Author" value={val("author", book.author)} /></Grid>
              <Grid item> <TextField label="Copyright Date" value={val("Copyright Date", book.year)} /></Grid>
              <Grid item> <TextField label="ISBN" value={val("ISBN", book.isbn)} /></Grid>
              <Grid item> <TextField label="Type" value={val("type", book.type)} /></Grid>
              <Grid item xs={12}> <TextField label="Subjects" value={val("subjects", book.subjects)} fullWidth /></Grid>
            </Grid>
          </Grid>
          <Grid item className="BDCloseIcon">
            <IconButton aria-label="close" onClick={()=>this.props.showDetails(-1)} > <CancelIcon /> </IconButton>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default BookDetails;
