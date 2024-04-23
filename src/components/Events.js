import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Link } from "react-router-dom";
import { apiUrl } from "../api";

import './Events.css';

const getEvents = async () => {
  const response = await fetch(apiUrl("/story/events"));
  const events = await response.json();
  return events;
}

export default function Events() {
  const [events, setEvents] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [sizePerPage, setSizePerPage] = React.useState(15);

  React.useEffect(() => {
    getEvents().then(data => setEvents(data));
  }, []);

  function getRowIndex(cell, row, rowIndex) {
    return (page-1) * sizePerPage + rowIndex + 1;
  }
  
  const columns = [{
      dataField: '_row_index_placeholder',
      text: 'Row',
      formatter: getRowIndex,
      headerStyle: () => {
        return { width: '50px', textAlign: 'center' };
      },
      align: 'center'
    }, {
      dataField: 'name',
      text: 'Name',
      sort: true,
      filter: textFilter(),
      formatter: (cell, row) => {
        return <Link to={`/events/${row.id}`}>{cell}</Link>
      }
    }, {
      dataField: 'type',
      text: 'Type',
      sort: true,
      filter: textFilter()
    }, {
      dataField: 'character_groups',
      text: 'Character groups',
      sort: true,
      filter: textFilter()
    }, {
      dataField: 'size',
      text: 'Size',
      sort: true,
      filter: textFilter()
    }, {
      dataField: 'importance',
      text: 'Importance',
      sort: true,
      filter: textFilter()
    }, {
      dataField: 'after_jump',
      text: 'After Jump',
      sort: true,
      filter: textFilter()
    }, {
      dataField: 'status',
      text: 'Status',
      sort: true,
      filter: textFilter()
    }, {
      dataField: 'gm_actions',
      text: 'GM Actions',
      sort: true,
      filter: textFilter(),
    }, {
      dataField: 'npc_count',
      text: 'NPC Count',
      sort: true,
      filter: textFilter(),
    }, {
      dataField: 'npc_location',
      text: 'NPC Location',
      sort: true,
      filter: textFilter()
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
      text: 'All', value: events.length
    }] // A numeric array is also available. the purpose of above example is custom the text
  };

  return (
    <div className='events'>
      <BootstrapTable
        bootstrap4
        striped
        hover
        keyField="id"
        bordered={ false }
        data={ events }
        columns={ columns }
        filter={ filterFactory() }
        pagination={ paginationFactory(options) }
      />
    </div>
  )
}