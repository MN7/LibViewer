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

// All imports necessary for the ViewInfo page

class Viewinfo extends Component {

  constructor(props) {
    super(props);
    this.state = { // all state-variables for ViewInfo
      loading: false, // To track download of JSON data from external website
      libdata: [], // parse JSON data into internal array of objects
      idmap: {}, // Map key (ie, biblionumber from JSON) to the array-index for quick retrieval
      viewSimple: true, // Switch between "Admin" user (with "add/update/delete" access) or regular user
      rowDetail: {prev:-1, curr:-1}, // Track which row user had clicked previously & currently
      rtid: -1, // Row Timeout ID - To help with auto-disappearance of row-detail
      page: 0, // Page number for row-pagination
      rowsPerPage: 10, // Number of rows per page of the table
      loaded: false // to track when/if data has been loaded into the internal libdata array
    };
  }

  componentDidMount() {
    this.setState({loaded: false}); // to ensure data is loaded when component mounts
    // the proxy URL provided by heroku is to circumvent CORS issues (Cross Origin Resource Sharing)
    // Typically, ReactJS front-end does not directly communicate with 3rd party cross-origin domains
    // This communication is routed from the back-end (such as NodeJS-Express) and we enable CORS at Express
    // However, in this example - since only front-end is needed, a proxy has been used
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const targetUrl = "https://prosentient.intersearch.com.au/cgi-bin/koha/svc/report?id=2&annotated=1";
    this.getKohaJSON(proxyUrl+targetUrl);
  }

  getKohaJSON = async (url) => { // Download koha JSON data. "async" so this does not block loading of UI
    this.setState({"loading": true});
    fetch(url, { method: "GET" })
      .then(res => {this.setState({"loading":false});
      return res.json();})
      .then(json => {this.parseKohaJSON(json);})
      .catch((err) => {console.log("Koha JSON info not fetched. Error: "+err)})
  }

  parseKohaJSON = (rawJSON) => { // Parse Koha JSON and set-up intenral array, map
    let m = new Map(), i=0;
    const temp = [...rawJSON.map((x) => {
        // The "Subjects" needs to have an upper-case "S"
        const book=this.createData(x.biblionumber, x.title, x.author, x.copyrightdate, x.type, x.isbn, x.Subjects);
        if (!m.has(book.id)) m.set(book.id, i++);
        return book;
      })
    ];
    this.setState({libdata: temp, idmap: m, loaded: true});
  }

  createData = (id, title, author, year, type, isbn, subjects) => { // quickly return an object with relevant properties
    return { id, title, author, year, type, isbn, subjects };
  }

  viewAdmin = () => { // Under-development - to present an "Edit"-able table with admin-access
    this.setState({viewSimple: !this.state.viewSimple});
  }

  handleChangePage = (event, newPage) => { this.setState({page: newPage}); } // when user clicks "Next Page" on table

  // When user changes number of rows displayed per-page
  handleChangeRowsPerPage = (event) => { this.setState({rowsPerPage: +event.target.value, page: 0}); }

  showDetails = (id) => { // Show row details when user clicks any row
    // First check if "id" is -1 (placeholder/default)
    // If so, this call is triggered by "timeout" - so reset the timeout-id and prev, curr row detail.
    if (id===-1) this.setState({rtid: -1, rowDetail: {prev: this.state.rowDetail.curr, curr:-1} });
    else { // User has clicked a row
      if (this.state.rtid!==-1) clearTimeout(this.state.rtid); // clear previous timeout if it was set
      // Prepare rowDetail with prev, curr set-up appropriately
      const trd={prev: this.state.rowDetail.curr, curr:this.state.idmap.get(id)};
      // Set timeout for reseting showDetails at 12 second and store the timeout-id to state variable "rtid"
      const nxrtid=setTimeout(()=>{this.showDetails(-1) }, 12000)
      this.setState({rtid: nxrtid, rowDetail: trd});
    }
  }

  render() {

    // constants to reduce using "this.state"
    const dataLoaded = this.state.loaded, viewSimple = this.state.viewSimple;
    const page = this.state.page, rowsPerPage = this.state.rowsPerPage;
    const idx=this.state.rowDetail.curr;
    const rows = [...this.state.libdata];
    const book= (idx !== -1) ? rows[idx] : {};

    // Below is the actual UI elements. First "div" displays the Header (with the logo, "View As Admin" button, etc)
    // Next is a conditionally-displayed div that shows book-details when user clicks any row
    // The last div is also conditional. If data is not loaded, it shows a circular-progress icon.
    // If data is loaded and user clicked "View As Admin" this div shows a message that the feature is under-development
    // If data is loadedd & user did not opt for "Admin" view, then display paginated-table showing details from Koha JSON

    return (
      <div className="viewinfo">
        <div className="vi-header">
          <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
            <Grid item xs={3}>
              <img src={require("../../public/LibViewer.svg")} alt="Lib Viewer Logo" width="20%" height="20%"
                align="right" />
            </Grid>
            <Grid item xs={3}>
              <h2>Simple Library Info Viewer</h2>
            </Grid>
            <Grid item xs={3} align-self="flex-start">
              <Grid container direction="row" spacing={2}>
                <Grid item>
                  <Button onClick={this.viewAdmin} variant="outlined" size="medium">
                    View { viewSimple ? "As Admin" : "As User" }
                  </Button>
                </Grid>
                <Grid item>
                  <Button target="_blank" variant="outlined" color="secondary" size="medium"
                     href="https://drive.google.com/file/d/16mz0NcVtNU86p26RoctBd6sleuTZr48v/view?usp=sharing">
                     Download Source
                   </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
        <div>
          { idx === -1 ?
            <br/>
            :
            <BookDetails book={book} showDetails={this.showDetails} />
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
