import React from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { apiGetRequest } from "../api";
import TableLoading from "./TableLoading";
import useSWR from "swr";

import './Ship.css';

export default function Ship(props) {
  const params = useParams();

  const swrShip = useSWR(
    "/fleet/" + params.id,
    apiGetRequest,
  );

  const swrArtifact = useSWR(
    "/science/artifact/",
    apiGetRequest,
  );

  const swrCaptain = useSWR(
    `/person?show_hidden=true&ship_id=${params.id}&title=${params.id === 'aurora' ? encodeURI('Grand Admiral of the EOC starfleet') : encodeURI('Star Captain')}`,
    apiGetRequest,
  );

  const swrPassangers = useSWR(() =>
    `/person?show_hidden=true&is_character=false&ship_id=${params.id}`,
    apiGetRequest,
  );

  const isLoading = swrArtifact.isLoading || swrShip.isLoading || swrCaptain.isLoading || swrPassangers.isLoading;
  const error = swrArtifact.error || swrShip.error || swrCaptain.error || swrPassangers.error;

  if (isLoading) return <TableLoading />;
  if (error) return <div>Failed to load data</div>;

  const ship = swrShip.data;
  const artifacts = swrArtifact.data;
  const captain = params.id === 'odysseus' ? swrCaptain.data.persons.filter(cap => cap.id === "20112")[0] : swrCaptain.data.persons[0];
  const passangers = swrPassangers.data;

  const renderShip = () => {
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
            <Col sm={4}><span className='caption'>ID: </span>{ship.id}</Col>
          </Row>
          <Row>
            <Col sm={4}><span className='caption'>Class: </span>{ship.class}</Col>
            <Col sm={4}><span className='caption'>Type: </span>{ship.type}</Col>
          </Row>
          <Row>
            <Col sm><span className='caption'>Ownership: </span>{ship.description}</Col>
          </Row>
          <Row>
            <Col sm>&nbsp;</Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header'>Description</span></Col>
          </Row>
          <Row>
            <Col sm><span className="description">{artifacts.filter(artifact => artifact.name === ship.class)[0].text.split('![]')[0].trim()}</span></Col>
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
            <Col sm={4}><span className='caption'>Position: </span>{ship.position.name}</Col>
          </Row>
          <Row>
            <Col sm>&nbsp;</Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header'>Arsenal</span></Col>
          </Row>
          <Row>
            <Col sm={4}><span className='caption'>Fighter Count: </span>{ship.fighter_count}</Col>
            <Col sm={4}><span className='caption'>Transporter Count: </span>{ship.transporter_count}</Col>
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
            <Col sm><span className='mini-header'>NPCs on Ship ({passangers.persons.length})</span></Col>
          </Row>
          {<ul>{passangers.persons?.map(person => <li key={person.id}><Row><Col sm><span className='characters'><Link onClick={() => props.changeTab('Characters')} to={`/characters/${person.id}`}>{person.full_name}</Link></span></Col></Row></li>)}</ul>}
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
