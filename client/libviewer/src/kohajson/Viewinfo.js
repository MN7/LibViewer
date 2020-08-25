import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class Viewinfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      libdata: [],
      loaded: false
    };
  }

  componentDidMount() {
    console.log("comp mount bgn");
    this.setState({loaded: false}); // to ensure data is loaded when component mounts
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const targetUrl = "https://prosentient.intersearch.com.au/cgi-bin/koha/svc/report?id=2&annotated=1";
    this.getKohaJSON(proxyUrl+targetUrl);
  }

  getKohaJSON = async (url) => {
    console.log("trying fetch now");
    this.setState({"loading": true});
    fetch(url, { method: "GET" })
      .then(res => {this.setState({"loading":false});
console.log("response received: "+res);
      return res.json();})
      .then(json => {this.parseKohaJSON(json);})
      .catch((err) => {console.log("Koha JSON info not fetched. Error: "+err)})
  }

  parseKohaJSON = (rawJSON) => {
    console.log("typeof rawJSON: "+typeof rawJSON);
    const temp = [...rawJSON.map((x) => {
        const book=this.createData(x.biblionumber, x.title, x.author, x.copyrightdate, x.type);
        return book;
        // return { x.biblionumber, x.title, x.author, x.copyrightdate, x.type };
        // return this.createData(x.title, x.author, x.copyrightdate, x.type);
      })
    ];
    this.setState({libdata: temp, loaded: true});
alert("exit parseKohaJSON..");
  }

  createData = (id, title, author, year, type) => {
    return { id, title, author, year, type };
  }

  render() {

    // const dataLoaded = this.loaded;
    const rows = [
      ...this.state.libdata
    ];

    // const createData = this.createData;
    // createData( 111, 'Frozen yoghurt', "abcd", 1924, "Paperback"),
    // createData( 111, 'Test book 002', "pqrs", 2014, "Kindle"),

    //       <Table className={classes.table} aria-label="simple table">

    return (
      <div className="viewinfo">
        <div className="vi-header">
          <h2>View JSON info from Koha</h2>
        </div>
        { this.state.loaded ?
          <div className="vi-intro">
            <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Author</TableCell>
                        <TableCell align="right">Year</TableCell>
                        <TableCell>Type</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell component="th" scope="row">
                            {row.title}
                          </TableCell>
                          <TableCell>{row.author}</TableCell>
                          <TableCell align="right">{row.year}</TableCell>
                          <TableCell>{row.type}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
          </div>
          :
          <div> <p> Data is being loaded from Koha JSON. Please wait. </p> </div>
        }

      </div>
    );
  }
}

export default Viewinfo;
