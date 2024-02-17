import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import React from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../api";

import './Fleet.css';


const getFleet = async () => {
  const response = await fetch(apiUrl("/fleet?show_hidden=true"));
  const fleet = await response.json();
  return fleet;
}

export default function Fleet() {
  const [fleet, setFleet] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [sizePerPage, setSizePerPage] = React.useState(15);

  React.useEffect(() => {
    getFleet().then(data => setFleet(data));
  }, []);

  function getRowIndex(cell, row, rowIndex) {
    return (page-1) * sizePerPage + rowIndex + 1;
  }
  
  const columns = [{
      dataField: '_row_index_placeholder',
      text: 'Row',
      formatter: getRowIndex,
      headerStyle: () => {
        return { width: '2%', textAlign: 'center' };
      },
      align: 'center'
    }, {
      dataField: 'name',
      text: 'Name',
      sort: true,
      filter: textFilter(),
      headerStyle: () => {
        return { width: '10%', textAlign: 'left' };
      },
      formatter: (cell, row) => {
        return <Link to={`/fleet/${row.id}`}>{cell}</Link>
      }
    }, {
      dataField: 'id',
      text: 'ID',
      sort: true,
      headerStyle: () => {
        return { width: '10%', textAlign: 'left' };
      },
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
      headerStyle: () => {
        return { width: '10%', textAlign: 'left' };
      },
      filter: textFilter()
    }, {
      dataField: 'position.name',
      text: 'Position',
      sort: true,
      headerStyle: () => {
        return { width: '10%', textAlign: 'left' };
      },
      filter: textFilter()
    }, {
      dataField: 'fighter_count',
      text: 'Fighter Count',
      sort: true,
      headerStyle: () => {
        return { width: '5%', textAlign: 'center' };
      },
      align: 'center'
    }, {
      dataField: 'transporter_count',
      text: 'Transporter Count',
      sort: true,
      headerStyle: () => {
        return { width: '5%', textAlign: 'center' };
      },
      align: 'center'
    }, {
      dataField: 'person_count',
      text: 'Person Count',
      sort: true,
      headerStyle: () => {
        return { width: '5%', textAlign: 'center' };
      },
      align: 'center'
  }];

  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total">
      Showing { from } to { to } of { size } Results
    </span>
  );

  const options = {
    page: page,
    sizePerPage: sizePerPage,
    paginationSize: 4,
    pageStartIndex: 1,
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
    onPageChange: (page, sizePerPage) => { 
      setPage(page); 
      setSizePerPage(sizePerPage);
    },
    onSizePerPageChange: (sizePerPage, page) => { 
      setPage(page); 
      setSizePerPage(sizePerPage);
    },
    disablePageTitle: true,
    sizePerPageList: [{
      text: '10', value: 10
    }, {
      text: '15', value: 15
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
    <div className='fleet'>
      <BootstrapTable
        bootstrap4
        striped
        hover
        keyField="id"
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