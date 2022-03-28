import React from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import './Artifact.css';

// TODO: Change Artifact name to type, type to origin, text to entry and Catalog ID to name (and Catalog ID)
// TODO: Who the hell is Vic Ramirez, Pat Montoya, Tilly Fjord, Nana Ishimoto, Bob Walker, Xian Xou, Reloz Duran

const getArtifact = async (id) => {
  const response = await fetch(`http://localhost:8888/science/artifact/${id}`);
  const artifact = await response.json();
  return artifact;
}

const getDiscoveredById = async (name) => {
  const response = await fetch(`http://localhost:8888/person/search/${name}`);
  const discoveredBy = await response.json();
  console.log(discoveredBy);
  const discoveredById = discoveredBy.find(person => person.full_name == name)?.id;
  return discoveredById;
}

export default function Artifact(props) {
  const [artifact, setArtifact] = React.useState(null);
  const [discoveredById, setDiscoveredById] = React.useState(null);
  const params = useParams();

  React.useEffect(() => {
    if (!params.id) return;
    getArtifact(params.id).then((s) => setArtifact(s));
  }, [params.id, setArtifact]);

  React.useEffect(() => {
    if (!artifact?.discovered_by) return;
    getDiscoveredById(artifact.discovered_by).then((s) => setDiscoveredById(s));
  }, [artifact?.discovered_by, setDiscoveredById]);

  React.useEffect(() => {
    props.changeTab('Artifacts');
  }, []);

  const renderArtifact = () => {
    if (!artifact) return null;

    const artifact_entries = artifact.entries.filter((e) => e.type === "ARTIFACT").map((e) => e.entry.split('\n\n')).flat();

    return (
      <div className='artifact'>
        <Container fluid className='artifact'>
          <Row>
            <Col sm><span className='mini-header'>{artifact.name}</span></Col>
          </Row>
          <Row className='row-mini-header'>
            <Col sm><span className='mini-header'>Basic Info</span></Col>
          </Row>
          <Row>
            <Col sm><span className='caption'>Name: </span>{artifact.catalog_id}</Col>
            <Col sm><span className='caption'>Catalog ID: </span>{artifact.catalog_id}</Col>
            <Col sm><span className='caption'>ID: </span>{artifact.id}</Col>
          </Row>
          <Row>
            <Col sm><span className='caption'>Type: </span>{artifact.name}</Col>
          </Row>
          <Row>
            <Col sm><span className='caption'>Origin: </span>{artifact.type}</Col>
          </Row>
          <Row className='row-mini-header'>
            <Col sm><span className='mini-header'>Discovery</span></Col>
          </Row>
          <Row>
            <Col sm><span className='caption'>Discovered At: </span>{artifact.discovered_at}</Col>
          </Row>
          <Row>
            <Col sm><span className='caption'>Discovered By: </span><span className='characters'><Link onClick={() => props.changeTab('Characters')} to={`/characters/${discoveredById}`}>{artifact.discovered_by}</Link></span></Col>
          </Row>
          <Row>
            <Col sm><span className='caption'>Discovered From: </span>{artifact.discovered_from}</Col>
          </Row>
          <Row className='row-mini-header'>
            <Col sm><span className='mini-header'>Artifact Entries</span></Col>
          </Row>
          {<ul>
            <li><Row><Col sm>{artifact.text.split('![]')[0]}</Col></Row></li>
            {artifact_entries.map(e => <li><Row key={e}><Col sm>{e}</Col></Row></li>)}
          </ul>}
        </Container>
      </div>
    )
  }

  return (
    <div>
      <h1 className='artifact'>{artifact?.catalog_id}</h1>
      {renderArtifact()}
    </div>
  );
}
