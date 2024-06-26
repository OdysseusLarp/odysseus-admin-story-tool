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

export default function Plots(props) {
  const [page, setPage] = React.useState(1);
  const [sizePerPage, setSizePerPage] = React.useState(15);

  const { data: plots, error, isLoading } = useSWR(
    "/story/plots",
    apiGetRequest
  );

  if (isLoading) return <TableLoading />;
  if (error) return <div>Failed to load data</div>;

  const sizeSelectOptions = toSelectOptions(plots, 'size');
  const importanceSelectOptions = toSelectOptions(plots, 'importance');
  const gmActionSelectOptions = toSelectOptions(plots, 'gm_actions');
  const selectOptions = {
    false: 'No',
    true: 'Yes'
  };

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
      dataField: 'persons',
      text: 'Characters involved',
      sort: true,
      filter: textFilter({
        onFilter: (filterValue, cell) => {
          if (!filterValue) return cell;
          const filtered = cell.filter((row) => {
            if (row.persons.length === 0) {
              return false;
            }
            const hasValue = row.persons.map(person => person.name.toLowerCase()).toString().includes(filterValue.toLowerCase());
            return hasValue;
            });
          return filtered;
        }
      }),
      formatter: (cell, row, index) => {
        if (cell.length === 0 ) { return null }
        const persons = cell.filter((e, i) => i < 3).map(person => 
          <div key={person.id.concat(index)}>
            <span className='characters'>
              <Link onClick={() => props.changeTab('Characters')} to={`/characters/${person.id}`}>{person.name}</Link>
            </span>
            <br/>
          </div>
        );
        if (cell.length > 3) { persons.push(<div key={index}>({cell.length})</div>) }
        return persons;
      }
    }, {
      dataField: 'character_groups',
      text: 'Character groups',
      sort: true,
      filter: textFilter(),
      formatter: (cell, row, i) => {
        if (cell === null ) { return null }
        return cell.split(", ").sort().map(character_group => 
          <div key={character_group.concat(i)}>{character_group}</div>)
      }
    }, {
      dataField: 'themes',
      text: 'Themes',
      sort: true,
      filter: textFilter(),
      formatter: (cell, row) => {
        if (cell === null ) { return null }
        return cell.split(", ").sort().map(theme => <div key={theme}>{theme}</div>)
      }
    }, {
      dataField: 'size',
      text: 'Size',
      sort: true,
      filter: selectFilter({
        options: sizeSelectOptions
      }),
      headerStyle: () => {
        return { width: '7%', textAlign: 'left' };
      }
    }, {
      dataField: 'importance',
      text: 'Importance',
      sort: true,
      filter: selectFilter({
        options: importanceSelectOptions
      }),
      headerStyle: () => {
        return { width: '10%', textAlign: 'left' };
      },
    }, {
      dataField: 'gm_actions',
      text: 'GM Actions',
      sort: true,
      filter: selectFilter({
        options: gmActionSelectOptions
      }),
      headerStyle: () => {
        return { width: '10%', textAlign: 'left' };
      }
    }, {
      dataField: 'text_npc_first_message',
      text: 'Text NPC starts',
      sort: true,
      formatter: cell => selectOptions[cell],
      filter: selectFilter({
        options: selectOptions
      }),
      headerStyle: () => {
        return { width: '10%', textAlign: 'left' };
      }
  }];

  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total">
      Showing { from } to { to } of { size } Results
    </span>
  );

  const nonExpandableRows = plots.map((e) => {
    if (e.persons.length < 4) { return e.id }
    return null;
   }).filter(e => e !== null);

  const expandRow = {
    renderer: row => (
      <div className="plots">
        <p>All characters involved ({row.persons.length})</p>
        <div className="text-to-columns">
          {row.persons.map(person => 
          <div key={person.id.concat(row.id)}>
            <span className='characters'>
              <Link onClick={() => props.changeTab('Characters')} to={`/characters/${person.id}`}>{person.name}</Link>
            </span>
            <br/>
          </div>)}
        </div>
      </div>
    ),
    showExpandColumn: true,
    nonExpandable: nonExpandableRows,
  };

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
        expandRow={ expandRow }
      />
    </div>
  )
}