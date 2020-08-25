import React, { Component } from 'react';

class Viewinfo extends Component {
  render() {
    return (
      <div className="viewinfo">
        <div className="vi-header">
          <h2>View JSON info from Koha</h2>
        </div>
        <p className="vi-intro">
          To get started, edit <code>src/kohajson/Viewinfo.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default Viewinfo;
