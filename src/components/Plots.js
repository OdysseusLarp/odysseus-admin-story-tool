import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Link } from "react-router-dom";
import { apiGetRequest } from "../api";
import { toSelectOptions } from "../utils/helpers";
import TableLoading from "./TableLoading";
import useSWR from "swr";

import './Plots.css';

export default function Plots() {
  const [page, setPage] = React.useState(1);
  const [sizePerPage, setSizePerPage] = React.useState(15);

  const { data: plots, error, isLoading } = useSWR(
    "/story/plots",
    apiGetRequest
  );

  if (isLoading) return <TableLoading />;
  if (error) return <div>Failed to load data</div>;
  
  const selectOptions = {
    true: 'Yes',
    false: 'No'
  };

  const sizeSelectOptions = toSelectOptions(plots, 'size');
  const importanceSelectOptions = toSelectOptions(plots, 'importance');
  const gmActionSelectOptions = toSelectOptions(plots, 'gm_actions');

  const defaultSorted = [{
    dataField: 'id',
    order: 'asc'
  }
];

  const columns = [{
      dataField: 'id',
      text: 'Id',
      sort: true,
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
      dataField: 'after_jump',
      text: 'After Jump',
      sort: true,
      filter: textFilter(),
      headerStyle: () => {
        return { width: '7%', textAlign: 'left' };
      },
      sortFunc: (a, b, order, dataField, rowA, rowB) => {
        const aValue = a === "" ? 100 : a;
        const bValue = b === "" ? 100 : b;
        if (order === 'asc') {
          return bValue - aValue;
        }
        return aValue - bValue;
      }
    }, {
      dataField: 'character_groups',
      text: 'Character groups',
      sort: true,
      filter: textFilter()
    }, {
      dataField: 'themes',
      text: 'Themes',
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
        defaultSorted={defaultSorted}
      />
    </div>
  )
}