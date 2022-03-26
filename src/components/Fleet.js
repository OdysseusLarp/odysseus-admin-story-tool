import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import React from "react";

import './Fleet.css';


function getRowIndex(cell, row, rowIndex) {
  return rowIndex;
}

const columns = [{
    text: 'Row',
    formatter: getRowIndex,
    headerStyle: (colum, colIndex) => {
      return { width: '50px', textAlign: 'center' };
    },
    align: 'center'
  }, {
    dataField: 'name',
    text: 'Name',
    sort: true,
    filter: textFilter()
  }, {
    dataField: 'description',
    text: 'Description',
    sort: true,
    filter: textFilter()
  }, {
    dataField: 'class',
    text: 'Class',
    sort: true,
    filter: textFilter()
  }, {
    dataField: 'status',
    text: 'Status',
    sort: true,
    filter: textFilter()
  }, {
    dataField: 'type',
    text: 'Type',
    sort: true,
    filter: textFilter()
  }, {
    dataField: 'position.name',
    text: 'Position',
    sort: true,
    filter: textFilter()
  }, {
    dataField: 'fighter_count',
    text: 'Fighter Count',
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { width: '100px', textAlign: 'center' };
    },
    align: 'center'
  }, {
    dataField: 'transporter_count',
    text: 'Transporter Count',
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { width: '100px', textAlign: 'center' };
    },
    align: 'center'
  }, {
    dataField: 'person_count',
    text: 'Person Count',
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { width: '100px', textAlign: 'center' };
    },
    align: 'center'
  }, {
    dataField: 'is_visible',
    text: 'Is Visible',
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { width: '100px', textAlign: 'center' };
    },
    align: 'center'
}];

const getFleet = async () => {
  const response = await fetch("http://localhost:8888/fleet?show_hidden=true");
  const fleet = await response.json();
  return fleet;
}

export default function Fleet() {
  const [fleet, setFleet] = React.useState([]);

  React.useEffect(() => {
    getFleet().then(data => setFleet(data));
  }, []);

  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total">
      Showing { from } to { to } of { size } Results
    </span>
  );

  const options = {
    paginationSize: 4,
    pageStartIndex: 0,
    alwaysShowAllBtns: true, // Always show next and previous button
    firstPageText: 'First',
    prePageText: 'Back',
    nextPageText: 'Next',
    lastPageText: 'Last',
    nextPageTitle: 'First page',
    prePageTitle: 'Pre page',
    firstPageTitle: 'Next page',
    lastPageTitle: 'Last page',
    showTotal: true,
    paginationTotalRenderer: customTotal,
    disablePageTitle: true,
    sizePerPageList: [{
      text: '10', value: 10
    }, {
      text: '20', value: 20
    }, {
      text: '25', value: 25
    }, {
      text: '50', value: 50
    }, {
      text: 'All', value: fleet.length
    }] // A numeric array is also available. the purpose of above example is custom the text
  };

  const rowStyle = (row, _rowIndex) => {
    if (row.name.includes("Odysseus")) {
      return { background: '#c1e5e9' };
    }
    return {};
  }

  return (
    <div>
      <BootstrapTable classes="info"
        bootstrap4
        striped
        hover
        keyField="name"
        bordered={ false }
        data={ fleet }
        columns={ columns }
        filter={ filterFactory() }
        pagination={ paginationFactory(options) }
        rowStyle={ rowStyle }
      />
    </div>
  )
}