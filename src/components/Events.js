import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, Comparator, selectFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Link } from "react-router-dom";
import { apiGetRequest } from "../api";
import { toSelectOptions } from "../utils/helpers";
import TableLoading from "./TableLoading";
import useSWR from "swr";

import './Events.css';

export default function Events() {
  const [page, setPage] = React.useState(1);
  const [sizePerPage, setSizePerPage] = React.useState(15);

  const { data: events, error, isLoading } = useSWR(
    "/story/events",
    apiGetRequest
  );

  if (isLoading) return <TableLoading />;
  if (error) return <div>Failed to load data</div>;

  function getRowIndex(cell, row, rowIndex) {
    return (page - 1) * sizePerPage + rowIndex + 1;
  }
  const selectCharGroup = {
    'Bridge Crew': 'Bridge Crew',
    Civilian: 'Civilian',
    Engineer: 'Engineer',
    Marine: 'Marine',
    Medic: 'Medic',
    Officer: 'Officer',
    Pilot: 'Pilot',
    Scientist: 'Scientist',
    Royalty: 'Royalty',
    Velian: 'Velian'
  };

  const selectImportance = toSelectOptions(events, 'importance');
  const selectStatus = toSelectOptions(events, 'status');
  const selectNPCLocation = toSelectOptions(events, 'npc_location');
  const selectGmActions = toSelectOptions(events, 'gm_actions');
  const selectSize = toSelectOptions(events, 'size');
  const selectType = toSelectOptions(events, 'type');

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
    dataField: 'after_jump',
    text: 'After Jump',
    sort: true,
    filter: textFilter()
  }, {
    dataField: 'importance',
    text: 'Importance',
    sort: true,
    filter: selectFilter({
      options: selectImportance
    })
  }, {
    dataField: 'status',
    text: 'Status',
    sort: true,
    filter: selectFilter({
      options: selectStatus
    })
  }, {
    dataField: 'type',
    text: 'Type',
    sort: true,
    filter: selectFilter({
      options: selectType
    })

  }, {
    dataField: 'character_groups',
    text: 'Character Group',
    sort: true,
    filter: selectFilter({
      options: selectCharGroup,
      comparator: Comparator.LIKE
    })
  }, {
    dataField: 'size',
    text: 'Size',
    sort: true,
    filter: selectFilter({
      options: selectSize
    })

  }, {

    dataField: 'gm_actions',
    text: 'GM Actions',
    sort: true,
    filter: selectFilter({
      options: selectGmActions
    })

  }, {
    dataField: 'npc_count',
    text: 'NPC Count',
    sort: true,
    filter: textFilter(),
  }, {
    dataField: 'npc_location',
    text: 'NPC Location',
    sort: true,
    filter: selectFilter({
      options: selectNPCLocation
    })
  }];

  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total">
      Showing {from} to {to} of {size} Results
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
        bordered={false}
        data={events}
        columns={columns}
        filter={filterFactory()}
        pagination={paginationFactory(options)}
      />
    </div>
  )
}