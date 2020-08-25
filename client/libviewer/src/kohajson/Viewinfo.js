import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

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
  }

  createData = (id, title, author, year, type) => {
    return { id, title, author, year, type };
  }

  render() {

    const dataLoaded = this.state.loaded;
    const rows = [
      ...this.state.libdata
    ];

    return (
      <div className="viewinfo">
        <div className="vi-header">
          <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
            <Grid item xs={3}>
              <img src={require("../../public/LibViewer.svg")} alt="Lib Viewer Logo" width="20%" height="20%"
                align="right" />
            </Grid>
            <Grid item xs={6}>
              <h2>View JSON info from Koha</h2>
            </Grid>
          </Grid>
        </div>
        { dataLoaded ?
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
          <div>
            <Grid container direction="column" justify="flex-end" alignItems="center" paddingTop="3%">
              <Grid item xs={6}>
                <p> Data is being loaded from Koha JSON. Please wait. </p>
              </Grid>
              <Grid item xs={3}>
                <CircularProgress color="secondary" width="30%" height="30%"
                  />
              </Grid>
            </Grid>
          </div>
        }

      </div>
    );
  }
}

export default Viewinfo;
