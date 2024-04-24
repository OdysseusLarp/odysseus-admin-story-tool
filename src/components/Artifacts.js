import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Link } from "react-router-dom";
import { apiUrl } from "../api";

import './Artifacts.css';

const getArtifacts = async () => {
  const response = await fetch(apiUrl("/science/artifact"));
  const artifacts = await response.json();
  return artifacts;
}

export default function Artifacts() {
  const [artifacts, setArtifacts] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [sizePerPage, setSizePerPage] = React.useState(15);

  React.useEffect(() => {
    getArtifacts().then(data => setArtifacts(data));
  }, []);

  function getRowIndex(cell, row, rowIndex) {
    return (page-1) * sizePerPage + rowIndex + 1;
  }

  const originSelectOptions = {
    "Elder": 'Elder',
    "EOC": 'EOC',
    "Machine": 'Machine',
    "Earth": 'Earth',
    "Unknown": 'Unknown',
  };

  const selectOptions = {
    true: 'Yes',
    false: 'No'
  };
  
  const columns = [{
      dataField: '_row_index_placeholder',
      text: 'Row',
      formatter: getRowIndex,
      headerStyle: () => {
        return { width: '50px', textAlign: 'center' };
      },
      align: 'center'
    }, {
      dataField: 'catalog_id',
      text: 'Catalog ID',
      sort: true,
      filter: textFilter(),
      formatter: (cell, row) => {
        return <Link to={`/artifacts/${row.id}`}>{cell}</Link>
      }
    }, {
      dataField: 'name',
      text: 'Name',
      sort: true,
      filter: textFilter(),
      headerStyle: () => {
        return { width: '17%', textAlign: 'left' };
      },
    }, {
      dataField: 'type',
      text: 'Origin',
      sort: true,
      filter: selectFilter({
        options: originSelectOptions
      }),
    }, {
      dataField: 'discovered_at',
      text: 'Discovered At',
      sort: true,
      filter: textFilter()
    }, {
      dataField: 'discovered_by',
      text: 'Discovered By',
      sort: true,
      filter: textFilter()
    }, {
      dataField: 'discovered_from',
      text: 'Discovered From',
      sort: true,
      filter: textFilter()
    }, {
      dataField: 'is_visible',
      text: 'Visible',
      sort: true,
      formatter: cell => selectOptions[cell],
      filter: selectFilter({
        options: selectOptions
      })
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
      text: 'All', value: artifacts.length
    }] // A numeric array is also available. the purpose of above example is custom the text
  };

  return (
    <div className='artifacts'>
      <BootstrapTable
        bootstrap4
        striped
        hover
        keyField="id"
        bordered={ false }
        data={ artifacts }
        columns={ columns }
        filter={ filterFactory() }
        pagination={ paginationFactory(options) }
      />
    </div>
  )
}