import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Link } from "react-router-dom";
import { apiGetRequest } from "../api";
import useSWR from "swr";

import './Plots.css';

export default function Plots() {
  const [page, setPage] = React.useState(1);
  const [sizePerPage, setSizePerPage] = React.useState(15);

  const { data: plots, error, isLoading } = useSWR(
    "/story/plots",
    apiGetRequest
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load data</div>;

  function getRowIndex(cell, row, rowIndex) {
    return (page-1) * sizePerPage + rowIndex + 1;
  }
  
  const selectOptions = {
    true: 'Yes',
    false: 'No'
  };

  const sizeSelectOptions = {
    "Small": 'Small',
    "Medium": 'Medium',
    "Large": 'Large',
  };

  const importanceSelectOptions = {
    "Small": 'Nice to have',
    "Medium": 'Should have',
    "Large": 'Mandatory',
  };

  const gmActionSelectOptions = {
    "No need": 'No need',
    "Event": 'Event',
    "Empty Epsilon": 'Empty Epsilon',
    "Text NPC": 'Text NPC',
    "Live NPC": 'Live NPC',
    "Briefing Character": 'Briefing Character',
    "Briefing NPCs": 'Briefing NPCs',
    "Other": 'Other',
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
      dataField: 'name',
      text: 'Name',
      sort: true,
      filter: textFilter(),
      formatter: (cell, row) => {
        return <Link to={`/plots/${row.id}`}>{cell}</Link>
      }
    }, {
      dataField: 'character_groups',
      text: 'Character groups',
      sort: true,
      filter: textFilter()
    }, {
      dataField: 'size',
      text: 'Size',
      sort: true,
      filter: selectFilter({
        options: sizeSelectOptions
      }),
    }, {
      dataField: 'importance',
      text: 'Importance',
      sort: true,
      filter: selectFilter({
        options: importanceSelectOptions
      }),
    }, {
      dataField: 'after_jump',
      text: 'After Jump',
      sort: true,
      filter: textFilter()
    }, {
      dataField: 'gm_actions',
      text: 'GM Actions',
      sort: true,
      filter: selectFilter({
        options: gmActionSelectOptions
      }),
    }, {
      dataField: 'text_npc_first_message',
      text: 'Text NPC Message First?',
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
      text: 'All', value: plots.length
    }] // A numeric array is also available. the purpose of above example is custom the text
  };

  return (
    <div className='plots'>
      <BootstrapTable
        bootstrap4
        striped
        hover
        keyField="id"
        bordered={ false }
        data={ plots }
        columns={ columns }
        filter={ filterFactory() }
        pagination={ paginationFactory(options) }
      />
    </div>
  )
}