import React, { Component } from 'react';
import BookDetails from './BookDetails.js';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

class Viewinfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      libdata: [],
      idmap: {},
      viewSimple: true,
      rowDetail: {prev:-1, curr:-1},
      rtid: -1,
      page: 0,
      rowsPerPage: 10,
      loaded: false
    };
  }

  componentDidMount() {
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
      return res.json();})
      .then(json => {this.parseKohaJSON(json);})
      .catch((err) => {console.log("Koha JSON info not fetched. Error: "+err)})
  }

  parseKohaJSON = (rawJSON) => {
    let m = new Map(), i=0;
    const temp = [...rawJSON.map((x) => {
        const book=this.createData(x.biblionumber, x.title, x.author, x.copyrightdate, x.type, x.isbn, x.subjects);
        if (!m.has(book.id)) m.set(book.id, i++);
        return book;
      })
    ];
    this.setState({libdata: temp, idmap: m, loaded: true});
  }

  createData = (id, title, author, year, type, isbn, subjects) => {
    return { id, title, author, year, type, isbn, subjects };
  }

  viewAdmin = () => {
    this.setState({viewSimple: !this.state.viewSimple});
  }

  handleChangePage = (event, newPage) => { this.setState({page: newPage}); }

  handleChangeRowsPerPage = (event) => { this.setState({rowsPerPage: +event.target.value, page: 0}); }

  showDetails = (id) => {
    if (id===-1) this.setState({rtid: -1, rowDetail: {prev: this.state.rowDetail.curr, curr:-1} });
    else {
      const trd={prev: this.state.rowDetail.curr, curr:this.state.idmap.get(id)};
      this.setState({rowDetail: trd});
      if (this.state.rtid!==-1) clearTimeout(this.state.rtid);
      let nxrtid=setTimeout(()=>{this.showDetails(-1) }, 12000)
      this.setState({rtid: nxrtid});
    }
    // setTimeout(()=>{ }, 15000);
  }

  render() {

    const dataLoaded = this.state.loaded, viewSimple = this.state.viewSimple;
    const page = this.state.page, rowsPerPage = this.state.rowsPerPage;
    const idx=this.state.rowDetail.curr;
    console.log("invoked render with idx: "+idx);
    const rows = [
      ...this.state.libdata
    ];
    const book= (idx !== -1) ? rows[idx] : {};

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
            <Grid item xs={3}>
              <Button onClick={this.viewAdmin}>View { viewSimple ? "As Admin" : "As User" } </Button>
            </Grid>
          </Grid>
        </div>
        <div>
          { idx === -1 ?
            <br/>
            :
            <BookDetails book={book} />
          }
        </div>
        { dataLoaded && viewSimple ?
          <div className="vi-intro">
            <TableContainer component={Paper}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Author</TableCell>
                        <TableCell align="right">Year</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell align="right">ISBN</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                        <TableRow key={row.id} onClick={()=>this.showDetails(row.id)}>
                          <TableCell component="th" scope="row">
                            {row.title}
                          </TableCell>
                          <TableCell>{row.author}</TableCell>
                          <TableCell align="right">{row.year}</TableCell>
                          <TableCell>{row.type}</TableCell>
                          <TableCell align="right">{row.isbn}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
          </div>
          : viewSimple ?
            <div>
              <Grid container direction="column" justify="flex-end" alignItems="center" >
                <Grid item xs={6}>
                  <p> Data is being loaded from Koha JSON. Please wait. </p>
                </Grid>
                <Grid item xs={3}>
                  <CircularProgress color="secondary" width="30%" height="30%"
                    />
                </Grid>
              </Grid>
            </div>
            : <p>Watch this space for: an access-restricted Admin panel with add, update, delete access to be created.</p>
        }
      </div>
    );
  }
}

export default Viewinfo;
