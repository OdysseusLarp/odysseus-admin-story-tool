import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import React from "react";
import { Link } from "react-router-dom";
import { apiGetRequest } from "../api";
import { Container, Row, Col } from "react-bootstrap";
import useSWR from "swr";

import './Fleet.css';

export default function Fleet() {
  const [page, setPage] = React.useState(1);
  const [sizePerPage, setSizePerPage] = React.useState(15);

  const { data: fleet, error, isLoading } = useSWR(
    "/fleet?show_hidden=true",
    apiGetRequest
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load data</div>;

  function getRowIndex(cell, row, rowIndex) {
    return (page-1) * sizePerPage + rowIndex + 1;
  }

  const classSelectOptions = {
    "Aurora Class Explorer": 'Aurora Class Explorer',
    "Stellar Class Battlecruiser": 'Stellar Class Battlecruiser',
    "Helios Class Corvette": 'Helios Class Corvette',
    "Luna Class Cargo Carrier": 'Luna Class Cargo Carrier',
    "Eclipse Class Frigate": 'Eclipse Class Frigate',
  };

  const statusSelectOptions = {
    "Present and accounted for": 'Accounted',
    "Destroyed": 'Destroyed',
  };

  const typeSelectOptions = {
    "Military": 'Military',
    "Civilian": 'Civilian',
  };

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
      dataField: 'description',
      text: 'Description',
      sort: true,
      filter: textFilter()
    }, {
      dataField: 'class',
      text: 'Class',
      sort: true,
      headerStyle: () => {
        return { width: '20%', textAlign: 'left' };
      },
      filter: selectFilter({
        options: classSelectOptions
      }),
    }, {
      dataField: 'status',
      text: 'Status',
      sort: true,
      headerStyle: () => {
        return { width: '13%', textAlign: 'left' };
      },
      formatter: (cell, row) => {
        return cell === 'Present and accounted for' ? "Accounted" : cell
      },
      filter: selectFilter({
        options: statusSelectOptions
      }),
    }, {
      dataField: 'type',
      text: 'Type',
      sort: true,
      headerStyle: () => {
        return { width: '10%', textAlign: 'left' };
      },
      filter: selectFilter({
        options: typeSelectOptions
      }),
    }, {
      dataField: 'position.name',
      text: 'Position',
      sort: true,
      headerStyle: () => {
        return { width: '10%', textAlign: 'left' };
      },
      filter: textFilter()
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
    <Container fluid className='ship'>
      <Row>
        <Col sm><p className='mini-header'>Total souls alive: {fleet.map(ship => parseInt(ship.person_count)).reduce((a, b) => a + b, 0)}</p></Col>
      </Row>
      </Container>
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