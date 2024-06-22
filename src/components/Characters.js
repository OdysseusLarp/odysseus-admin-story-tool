import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { ColumnToggle } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min';
import { apiGetRequest } from "../api";
import { toSelectOptions } from "../utils/helpers";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import TableLoading from "./TableLoading";
import useSWR from "swr";

import './Characters.css';

export default function Characters(props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { hash } = useLocation();

  const setHash = (newHash) => {
    window.location.hash = newHash;
  }

  let decodedHash = {};
  if (hash) {
    try {
      decodedHash = JSON.parse(window.atob(hash.slice(1)));
    } catch (e) {
      console.error("Failed to decode hash", e);
    }
  }

  const page = parseInt(searchParams.get('page'), 10) || 1;
  const sizePerPage = parseInt(searchParams.get('pageSize'), 10) || 15;

  const setPageAndSize = (newPage, newSizePerPage) => {
    setSearchParams({ page: String(newPage), pageSize: String(newSizePerPage) })
  }

  const afterFilter = (filteredResults, appliedFilters) => {
    const formattedFilters = {};
    Object.entries(appliedFilters).forEach(([key, value]) => {
      formattedFilters[key] = value.filterVal;
    });

    if (Object.keys(formattedFilters).length === 0) {
      setHash('');
      return;
    }

    const filtersHash = window.btoa(JSON.stringify(formattedFilters));
    setHash(filtersHash);
  };

  const getDefaultFilterValue = (key) => {
    return decodedHash[key];
  };

  const swrCharacters = useSWR(
    "/person?show_hidden=true&is_character=true",
    apiGetRequest,
  );

  const swrNpcs = useSWR(
    "/person?show_hidden=true&is_character=false",
    apiGetRequest,
  );

  if (swrCharacters.isLoading || swrNpcs.isLoading) return <TableLoading />
  if (swrCharacters.error || swrNpcs.error) return <div>Failed to load data</div>;

  const characters = [...swrCharacters.data.persons, ...swrNpcs.data.persons];

  const selectPlanet = toSelectOptions(characters, 'home_planet');
  const selectDynasty = toSelectOptions(characters, 'dynasty');
  const selectParty = toSelectOptions(characters, 'political_party');
  const selectReligion = toSelectOptions(characters, 'religion');
  const selectShift = toSelectOptions(characters, 'shift');
  const selectStatus = toSelectOptions(characters, 'status');
  const selectShip = toSelectOptions(characters.map((c) => c.ship), 'name');
  const selectIsCharacter = {
    true: 'Character',
    false: 'NPC'
  };

  const sortCaret = (order) => {
    if (!order) return (<span>&nbsp;<font color="gray">↑↓</font></span>);
    else if (order === 'asc') return (<span>&nbsp;↑<font color="gray">↓</font></span>);
    else if (order === 'desc') return (<span>&nbsp;<font color="gray">↑</font>↓</span>);
    return null;
  }

  const { ToggleList } = ColumnToggle;

  const columns = [{
    dataField: 'id',
    text: 'Id',
    sort: true,
    align: 'center',
    headerStyle: () => {
      return { width: '60px', textAlign: 'center' }
    },
    sortCaret: (order) => { return sortCaret(order) }
  }, {
    dataField: 'full_name',
    text: 'Full Name',
    sort: true,
    filter: textFilter({ defaultValue: getDefaultFilterValue('full_name') }),
    formatter: (cell, row) => {
      return <Link to={`/characters/${row.id}`}>{cell}</Link>
    },
    sortCaret: (order) => { return sortCaret(order) }
  }, {
    dataField: 'card_id',
    text: 'Card ID',
    sort: true,
    filter: textFilter({ defaultValue: getDefaultFilterValue('card_id') }),
    headerStyle: () => {
      return { width: '100px' }
    },
    sortCaret: (order) => { return sortCaret(order) }
  }, {
    dataField: 'is_character',
    text: 'Character/NPC',
    sort: true,
    formatter: cell => selectIsCharacter[cell],
    filter: selectFilter({
      options: selectIsCharacter,
      defaultValue: getDefaultFilterValue('is_character'),
    }),
    headerStyle: () => {
      return { width: '10%' }
    },
    sortCaret: (order) => { return sortCaret(order) }
  }, {
    dataField: 'character_group',
    text: 'Character Group',
    sort: true,
    filter: textFilter({ defaultValue: getDefaultFilterValue('character_group') }),
    sortCaret: (order) => { return sortCaret(order) }
  }, {
    dataField: 'shift',
    text: 'Shift',
    sort: true,
    hidden: true,
    filter: selectFilter({
      options: selectShift,
      defaultValue: getDefaultFilterValue('shift')
    }),
    sortCaret: (order) => { return sortCaret(order) }
  }, {
    dataField: 'title',
    text: 'Title',
    sort: true,
    filter: textFilter({ defaultValue: getDefaultFilterValue('title') }),
    sortCaret: (order) => { return sortCaret(order) }
  }, {
    dataField: 'status',
    text: 'Status',
    sort: true,
    hidden: true,
    filter: selectFilter({
      options: selectStatus,
      defaultValue: getDefaultFilterValue('status'),
    }),
    sortCaret: (order) => { return sortCaret(order) }
  }, {
    dataField: 'dynasty',
    text: 'Dynasty',
    sort: true,
    filter: selectFilter({
      options: selectDynasty,
      defaultValue: getDefaultFilterValue('dynasty'),
    }),
    sortCaret: (order) => { return sortCaret(order) }
  }, {
    dataField: 'political_party',
    text: 'Political party',
    sort: true,
    hidden: true,
    filter: selectFilter({
      options: selectParty,
      defaultValue: getDefaultFilterValue('political_party'),
    }),
    sortCaret: (order) => { return sortCaret(order) }
  }, {
    dataField: 'religion',
    text: 'Religion',
    sort: true,
    hidden: true,
    filter: selectFilter({
      options: selectReligion,
      defaultValue: getDefaultFilterValue('religion'),
    }),
    sortCaret: (order) => { return sortCaret(order) }
  }, {
    dataField: 'home_planet',
    text: 'Home Planet',
    sort: true,
    hidden: true,
    filter: selectFilter({
      options: selectPlanet,
      defaultValue: getDefaultFilterValue('home_planet'),
    }),
    sortCaret: (order) => { return sortCaret(order) }
  }, {

    dataField: 'ship.name',
    text: 'Ship',
    sort: true,
    formatter: (cell, row) => {
      return row.ship == null ? "" :
        <span className='fleet'>
          <Link onClick={() => props.changeTab('Fleet')} to={`/fleet/${row.ship.id}`}>{cell}</Link>
        </span>
    },
    filter: selectFilter({
      options: selectShip,
      defaultValue: getDefaultFilterValue('ship.name'),
    }),
    headerStyle: () => {
      return { width: '10%' }
    },
    sortCaret: (order) => { return sortCaret(order) }
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
    disablePageTitle: true,
    onPageChange: (page, sizePerPage) => {
      setPageAndSize(page, sizePerPage);
    },
    onSizePerPageChange: (sizePerPage, page) => {
      setPageAndSize(page, sizePerPage);
    },
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
      text: 'All', value: characters.length
    }] // A numeric array is also available. the purpose of above example is custom the text
  };

  return (
    <ToolkitProvider
      keyField="id"
      data={characters}
      columns={columns}
      columnToggle
    >
      {
        props => (
          <div className="characters">
            <ToggleList
              contextual="outline-secondary"
              className="list-custom-class"
              btnClassName="list-btn-custom-class"
              {...props.columnToggleProps}
            />
            <hr />
            <BootstrapTable
              bootstrap4
              striped
              hover
              keyField="id"
              bordered={false}
              data={characters}
              columns={columns}
              filter={filterFactory({ afterFilter })}
              pagination={paginationFactory(options)}
              {...props.baseProps}
            />
          </div>
        )
      }
    </ToolkitProvider>
  )
}
