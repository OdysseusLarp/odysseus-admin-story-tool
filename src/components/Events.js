import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Link } from "react-router-dom";
import { apiGetRequest } from "../api";
import { toSelectOptions } from "../utils/helpers";
import TableLoading from "./TableLoading";
import useTableState from "../hooks/TableState";
import useSWR from "swr";

import './Events.css';

export default function Events(props) {
  const { page, sizePerPage, setPageAndSize, afterFilter, getDefaultFilterValue } = useTableState();

  const { data: events, error, isLoading } = useSWR(
    "/story/events",
    apiGetRequest
  );

  if (isLoading) return <TableLoading />;
  if (error) return <div>Failed to load data</div>;

  const selectImportance = toSelectOptions(events, 'importance');
  const selectStatus = toSelectOptions(events, 'status');
  const selectNPCLocation = toSelectOptions(events, 'npc_location');
  const selectGmActions = toSelectOptions(events, 'gm_actions');
  const selectSize = toSelectOptions(events, 'size');
  const selectType = toSelectOptions(events, 'type');

  const defaultSorted = [{
    dataField: 'id',
    order: 'asc'
  }];

  const columns = [{
    dataField: 'id',
    sort: true,
    text: 'Id',
    headerStyle: () => {
      return { width: '50px', textAlign: 'center' };
    },
    align: 'center'
  }, {
    dataField: 'name',
    text: 'Name',
    sort: true,
    filter: textFilter({ defaultValue: getDefaultFilterValue('name') }),
    formatter: (cell, row) => {
      return <Link to={`/events/${row.id}`}>{cell}</Link>
    }
  }, {
    dataField: 'after_jump',
    text: 'After Jump',
    sort: true,
    filter: textFilter({ defaultValue: getDefaultFilterValue('after_jump') }),
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
      defaultValue: getDefaultFilterValue('persons'),
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
      if (cell.length === 0) { return null }
      const persons = cell.filter((e, i) => i < 3).map(person =>
        <div key={person.id.concat(index)}>
          <span className='characters'>
            <Link onClick={() => props.changeTab('Characters')} to={`/characters/${person.id}`}>{person.name}</Link>
          </span>
          <br />
        </div>);
      if (cell.length > 3) { persons.push(<div key={index}>({cell.length})</div>) }
      return persons;
    }
  }, {
    dataField: 'character_groups',
    text: 'Character Group',
    sort: true,
    filter: textFilter({ defaultValue: getDefaultFilterValue('character_groups') }),
    formatter: (cell, row, i) => {
      if (cell === null) { return null }
      return cell.split(", ").sort().map(character_group => <div key={character_group.concat(i)}>{character_group}</div>)
    }
  }, {
    dataField: 'type',
    text: 'Type',
    sort: true,
    filter: selectFilter({
      options: selectType,
      defaultValue: getDefaultFilterValue('type')
    })
  }, {
    dataField: 'size',
    text: 'Size',
    sort: true,
    filter: selectFilter({
      options: selectSize,
      defaultValue: getDefaultFilterValue('size')
    })
  }, {
    dataField: 'importance',
    text: 'Importance',
    sort: true,
    filter: selectFilter({
      options: selectImportance,
      defaultValue: getDefaultFilterValue('importance')
    })
  }, {
    dataField: 'status',
    text: 'Status',
    sort: true,
    filter: selectFilter({
      options: selectStatus,
      defaultValue: getDefaultFilterValue('status')
    })
  }, {
    dataField: 'gm_actions',
    text: 'GM Actions',
    sort: true,
    filter: selectFilter({
      options: selectGmActions,
      defaultValue: getDefaultFilterValue('gm_actions')
    })
  }, {
    dataField: 'npc_count',
    text: 'NPC Count',
    sort: true,
    filter: textFilter({ defaultValue: getDefaultFilterValue('npc_count') }),
  }, {
    dataField: 'npc_location',
    text: 'NPC Location',
    sort: true,
    filter: selectFilter({
      options: selectNPCLocation,
      defaultValue: getDefaultFilterValue('npc_location')
    })
  }];

  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total">
      Showing {from} to {to} of {size} Results
    </span>
  );

  const nonExpandableRows = events.map((e, i) => {
    if (e.persons.length < 4) { return e.id }
    return null;
  }).filter(e => e !== null);

  const expandRow = {
    renderer: row => (
      <div className="events">
        <p>All characters involved ({row.persons.length})</p>
        <div className="text-to-columns">
          {row.persons.map(person =>
            <div key={person.id.concat(row.id)}>
              <span className='characters'>
                <Link onClick={() => props.changeTab('Characters')} to={`/characters/${person.id}`}>{person.name}</Link>
              </span>
              <br />
            </div>
          )}
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
      setPageAndSize(page, sizePerPage);
    },
    onSizePerPageChange: (sizePerPage, page) => {
      setPageAndSize(page, sizePerPage);
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
        filter={filterFactory({ afterFilter })}
        pagination={paginationFactory(options)}
        defaultSorted={defaultSorted}
        expandRow={expandRow}
      />
    </div>
  )
}