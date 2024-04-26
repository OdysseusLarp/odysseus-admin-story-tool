import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, selectFilter, Comparator } from 'react-bootstrap-table2-filter';
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
    return (page - 1) * sizePerPage + rowIndex + 1;
  }

  const selectOptions = {
    true: 'Character',
    false: 'NPC'
  };

  const selectPlanet = {
    Caelena: 'Caelena',
    Ellarion: 'Ellarion',
    Osiris: 'Osiris',
    Velian: 'Velian',
    Voidborn: 'Voidborn',
    Unknown: 'Unknown',
    None: 'None'
  };

  const selectDynasty = {
    Defiance: 'Defiance',
    Hope: 'Hope',
    Mercy: 'Mercy',
    Purity: 'Purity',
    Strength: 'Strength',
    Wisdom: 'Wisdom',
    Floater: 'Floater',
    None: 'None'
  };

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

  const selectStatus = {
    'Present and accounted for' : 'Accounted',
    'Deceased' : 'Deceased',
    'Killed in action' : 'Killed in action',
    'Missing in action' : 'Missing in action',
    'Unknown' : 'Unknown',
    'None' : 'None'
  };

  const selectShip = {
    'CSS Centurion': 'CSS Centurion',
    'CSS Cyclone': 'CSS Cyclone',
    'CSS Prophet': 'CSS Prophet',
    'CSS Taurus': 'CSS Taurus',
    'CSS Whirlwind': 'CSS Whirlwind',
    'ESS Aries': 'ESS Aries',
    'ESS Arthas': '	ESS Arthas',
    'ESS Aurora': '	ESS Aurora',
    'ESS Bluecoat': 'ESS Bluecoat',
    'ESS Discovery': 'ESS Discovery',
    'ESS Envoy': 'ESS Envoy',
    'ESS Halo': 'ESS Halo',
    'ESS Harbinger': 'ESS Harbinger',
    'ESS Inferno': 'ESS Inferno',
    'ESS Memory': 'ESS Memory',
    'ESS Odysseus': 'ESS Odysseus',
    'ESS Polaris': 'ESS Polaris',
    'ESS Spectrum': 'ESS Spectrum',
    'ESS Valkyrie': 'ESS Valkyrie',
    'ESS Valor': 'ESS Valor',
    'ESS Warrior': 'ESS Warrior',
    None: 'None',
    'OSS Burro': 'OSS Burro',
    'OSS Immortal': 'OSS Immortal',
    'OSS Karma': 'OSS Karma',
    'OSS Marauder': 'OSS Marauder',
    'OSS Ravager': 'OSS Ravager',
    'OSS Starfall': 'OSS Starfall',
    'OSS Vulture': 'OSS Vulture',
    Unknown: 'Unknown'
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
    filter: selectFilter({
      options: selectCharGroup,
      comparator: Comparator.LIKE
    })
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
