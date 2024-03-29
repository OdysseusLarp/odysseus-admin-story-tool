import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { apiUrl } from "../api";

import { Link } from "react-router-dom";

import './Characters.css';

const getCharacters = async () => {
  const response = await fetch(apiUrl("/person?show_hidden=true&is_character=true"));
  const characters = await response.json();
  return characters.persons;
}

const getNpcs = async () => {
    const response = await fetch(apiUrl("/person?show_hidden=true&is_character=false"));
    const npcs = await response.json();
    return npcs.persons;
  }

export default function Characters(props) {
  const [characters, setCharacters] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [sizePerPage, setSizePerPage] = React.useState(15);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [charactersData, npcsData] = await Promise.all([
          getCharacters(),
          getNpcs(),
        ]);

        const allCharacters = [...charactersData, ...npcsData];
        setCharacters(allCharacters);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  function getRowIndex(cell, row, rowIndex) {
    return (page-1) * sizePerPage + rowIndex + 1;
  }

  const selectOptions = {
    true: 'Character',
    false: 'NPC'
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
      dataField: 'full_name',
      text: 'Full Name',
      sort: true,
      filter: textFilter(),
      formatter: (cell, row) => {
        return <Link to={`/characters/${row.id}`}>{cell}</Link>
      }
    }, {
      dataField: 'id',
      text: 'ID',
      sort: true,
      filter: textFilter()
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
      filter: textFilter()
    }, {
      dataField: 'last_message_recieved',
      text: 'Last Message From NPC',
      sort: true,
      filter: textFilter()
    }, {
      dataField: 'status',
      text: 'Status',
      sort: true,
      filter: textFilter()
    }, {
      dataField: 'dynasty',
      text: 'Dynasty',
      sort: true,
      filter: textFilter()
    }, {
      dataField: 'home_planet',
      text: 'Home Planet',
      sort: true,
      filter: textFilter()
    }, {
      dataField: 'ship.name',
      text: 'Ship',
      sort: true,
      filter: textFilter(),
      formatter: (cell, row) => {
        return row.ship == null ? "" : <span className='fleet'><Link onClick={() => props.changeTab('Fleet')} to={`/fleet/${row.ship.id}`}>{cell}</Link></span>
      },
    },
  ];

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
        bordered={ false }
        data={ characters }
        columns={ columns }
        filter={ filterFactory() }
        pagination={ paginationFactory(options) }
      />
    </div>
  )
}
