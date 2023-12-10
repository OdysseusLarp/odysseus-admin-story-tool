import React from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { apiUrl } from "../api";

import './Ship.css';

const getShip = async (id) => {
  const response = await fetch(apiUrl(`/fleet/${id}`));
  const ship = await response.json();
  return ship;
}

const getCaptain = async (id) => {
  const response = await fetch(apiUrl(`/person?show_hidden=true&ship_id=${id}&title=Star%20Captain`));
  let captain = await response.json();
  captain = captain.persons;
  // On Odysseus there are two Star Captains. We want Zeya Cook id 20112.
  if (id === 'odysseus') {
    captain = captain.filter(cap => cap.id === "20112");
  }
  return captain[0];
}

export default function Ship(props) {
  const [ship, setShip] = React.useState(null);
  const [captain, setCaptain] = React.useState(null);
  const params = useParams();

  React.useEffect(() => {
    if (!params.id) return;

    getShip(params.id).then((s) => setShip(s));
  }, [params.id, setShip]);

  React.useEffect(() => {
    if (!params.id) return;
    getCaptain(params.id).then((s) => setCaptain(s));
  }, [params.id, setCaptain]);

  React.useEffect(() => {
    props.changeTab('Fleet');
  }, [props]);

  const renderShip = () => {
    if (!ship) return null;
    console.log(ship)
    return (
      <div className='ship'>
        <Container fluid className='ship'>
          <Row>
            {captain?.id && <Col sm><span className='mini-header'>Star Captain: </span><span className='characters'><Link onClick={() => props.changeTab('Characters')} to={`/characters/${captain.id}`}>{captain.full_name}</Link></span></Col>}
          </Row>
          <Row>
            <Col sm>&nbsp;</Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header'>Basic Info</span></Col>
          </Row>
          <Row>
            <Col sm={4}><span className='caption'>Name: </span>{ship.name}</Col>
            <Col sm={8}><span className='caption'>ID: </span>{ship.id}</Col>
          </Row>
          <Row>
            <Col sm={4}><span className='caption'>Class: </span>{ship.class}</Col>
            <Col sm={8}><span className='caption'>Type: </span>{ship.type}</Col>
          </Row>
          <Row>
            <Col sm><span className='caption'>Description <span className="new">(check this and add the full description)</span>: </span>{ship.description}</Col>
          </Row>
          <Row>
            <Col sm>&nbsp;</Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header'>Current Status</span></Col>
          </Row>
          <Row>
            <Col sm><span className='caption'>Person Count: </span>{ship.person_count}</Col>
          </Row>
          <Row>
            <Col sm={4}><span className='caption'>Status: </span>{ship.status}</Col>
            <Col sm={8}><span className='caption'>Position: </span>{ship.position.name}</Col>
          </Row>
          <Row>
            <Col sm>&nbsp;</Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header'>Arsenal</span></Col>
          </Row>
          <Row>
            <Col sm={4}><span className='caption'>Fighter Count: </span>{ship.fighter_count}</Col>
            <Col sm={8}><span className='caption'>Transporter Count: </span>{ship.transporter_count}</Col>
          </Row>
          <Row>
            <Col sm>&nbsp;</Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header'>Metadata</span></Col>
          </Row>
          <Row>
            <Col sm><span className='caption'>Is Visible: </span>{ship.is_visible ? "Yes" : "No"}</Col>
          </Row>
          <Row>
            {ship.metadata?.scan_range && <Col sm={4}><span className='caption'>Scan Range: </span>{ship.metadata?.scan_range}</Col>}
            {ship.metadata?.probe_count && <Col sm={8}><span className='caption'>Probe Count: </span>{ship.metadata?.probe_count}</Col>}
          </Row>
          <Row>
            {ship.metadata?.jump_range && <Col sm={4}><span className='caption'>Jump Range: </span>{ship.metadata?.jump_range}</Col>}
            {ship.metadata?.jump_crystal_count && <Col sm={8}><span className='caption'>Jump Crystal Count: </span>{ship.metadata?.jump_crystal_count}</Col>}
          </Row>
          <Row>
            {ship.metadata?.object_scan_duration.min_seconds && <Col sm={4}><span className='caption'>Object Scan Duration Min: </span>{ship.metadata?.object_scan_duration.min_seconds}s</Col>}
            {ship.metadata?.grid_scan_duration.min_seconds && <Col sm={8}><span className='caption'>Grid Scan Duration Min: </span>{ship.metadata?.grid_scan_duration.min_seconds}s</Col>}
          </Row>
          <Row>
            {ship.metadata?.object_scan_duration.max_seconds && <Col sm={4}><span className='caption'>Object Scan Duration Max: </span>{ship.metadata?.object_scan_duration.max_seconds}s</Col>}
            {ship.metadata?.grid_scan_duration.max_seconds && <Col sm={8}><span className='caption'>Grid Scan Duration Max: </span>{ship.metadata?.grid_scan_duration.max_seconds}s</Col>}
          </Row>
          <Row>
            <Col sm>&nbsp;</Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header new'>Persons on Ship (Characters / NPCs)</span></Col>
          </Row>
          {<ul><li><span className='data-found'>Link to Character name</span></li><li><span className='data-found'>Link to NPC 1 </span><span className='new'>(Knows: Character Name 1, Character Name 2)</span></li><li><span className='data-found'>Link to NPC 2 </span><span className='new'>(Knows: Character Name 1, Character Name 2)</span></li></ul>}
        </Container>
      </div>
    )
  }

  return (
    <div>
      <h1 className='ship'>{ship?.name}</h1>
      {renderShip()}
    </div>
  );
}
