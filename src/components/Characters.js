import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { apiGetRequest } from "../api";
import { toSelectOptions } from "../utils/helpers";
import { Link } from "react-router-dom";
import TableLoading from "./TableLoading";
import useSWR from "swr";

import './Characters.css';

export default function Characters(props) {
  const [page, setPage] = React.useState(1);
  const [sizePerPage, setSizePerPage] = React.useState(15);

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

  function getRowIndex(cell, row, rowIndex) {
    return (page - 1) * sizePerPage + rowIndex + 1;
  }

  const selectOptions = {
    true: 'Character',
    false: 'NPC'
  };

  const selectPlanet = toSelectOptions(characters, 'home_planet');
  const selectDynasty = toSelectOptions(characters, 'dynasty');
  const selectStatus = toSelectOptions(characters, 'status');
  const selectShip = toSelectOptions(characters.map((c) => c.ship), 'name');

  const columns = [{
    dataField: 'id',
    text: 'Id',
    sort: true,
    headerStyle: () => {
      return { width: '60px', textAlign: 'center' };
    },
    align: 'center'
  }, {
    dataField: 'full_name',
    text: 'Full Name',
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      return <Link to={`/characters/${row.id}`}>{cell}</Link>
    }
  }, {
    dataField: 'card_id',
    text: 'Card ID',
    sort: true,
    filter: textFilter()
  }, {
    dataField: 'is_character',
    text: 'Character/NPC',
    sort: true,
    formatter: cell => selectOptions[cell],
    filter: selectFilter({
      options: selectOptions
    })
  }, {
    dataField: 'character_group',
    text: 'Character Group',
    sort: true,
    filter: textFilter(),
  }, {
    dataField: 'status',
    text: 'Status',
    sort: true,
    formatter: (cell, row) => {
      return cell === 'Present and accounted for' ? "Accounted" : cell
    },
    filter: selectFilter({
      options: selectStatus
    })
  }, {
    dataField: 'dynasty',
    text: 'Dynasty',
    sort: true,
    filter: selectFilter({
      options: selectDynasty
    })
  }, {
    dataField: 'home_planet',
    text: 'Home Planet',
    sort: true,
    filter: selectFilter({
      options: selectPlanet
    })
  }, {

    dataField: 'ship.name',
    text: 'Ship',
    sort: true,
    formatter: (cell, row) => {
      return row.ship == null ? "" : <span className='fleet'><Link onClick={() => props.changeTab('Fleet')} to={`/fleet/${row.ship.id}`}>{cell}</Link></span>
    },
    filter: selectFilter({
      options: selectShip
    })
  },
  ];

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
      setPage(page);
      setSizePerPage(sizePerPage);
    },
    onSizePerPageChange: (sizePerPage, page) => {
      setPage(page);
      setSizePerPage(sizePerPage);
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
    <div className="characters">
      <BootstrapTable
        bootstrap4
        striped
        hover
        keyField="id"
        bordered={false}
        data={characters}
        columns={columns}
        filter={filterFactory()}
        pagination={paginationFactory(options)}
      />
    </div>
  )
}
