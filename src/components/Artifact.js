import React from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { apiUrl } from "../api";

import './Artifact.css';

const getArtifact = async (id) => {
  const response = await fetch(apiUrl(`/science/artifact/${id}`));
  const artifact = await response.json();
  return artifact;
}

const getArtifactDetails = async (id) => {
  const response = await fetch(apiUrl(`/story/artifact/${id}`));
  const artifactDetails = await response.json();
  return artifactDetails;
}

const getDiscoveredById = async (name) => {
  const response = await fetch(apiUrl(`/person/search/${name}`));
  const discoveredBy = await response.json();
  console.log(discoveredBy);
  const discoveredById = discoveredBy.find(person => person.full_name === name)?.id;
  return discoveredById;
}

export default function Artifact(props) {
  const [artifact, setArtifact] = React.useState(null);
  const [artifactDetails, setArtifactDetails] = React.useState(null);
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
    if (!params.id) return;
    getArtifactDetails(params.id).then((s) => setArtifactDetails(s));
  }, [params.id]);

  React.useEffect(() => {
    props.changeTab('Artifacts');
  }, [props]);

  const renderArtifact = () => {
    if (!artifact || !artifactDetails) return null;

    const artifact_entries = artifact.entries.map((e) => e.entry.split('\r\n\r\n')).flat();
    const artifact_notes = artifact.gm_notes ? artifact.gm_notes.split('\r\n\r\n') : [];

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
            <Col sm={4}><span className='caption'>Name: </span>{artifact.catalog_id}</Col>
            <Col sm={4}><span className='caption'>Catalog ID: </span>{artifact.catalog_id}</Col>
            <Col sm={4}><span className='caption'>ID: </span>{artifact.id}</Col>
          </Row>
          <Row>
            <Col sm={4}><span className='caption'>Type: </span>{artifact.name}</Col>
            <Col sm={8}><span className='caption'>Visible on DataHub: </span>{artifact.is_visible ? "Yes" : "No"}</Col>
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
            <Col sm><span className='mini-header'>Artifact Description</span></Col>
          </Row>
          <Row><Col sm>{artifact.text.split('![]')[0]}</Col></Row>
          <Row className='row-mini-header'>
            <Col sm><span className='mini-header'>Artifact Entries</span></Col>
          </Row>
            {artifact_entries.length <1 ? <p>No entries</p> : <ul>
              {artifact_entries.map(e => <li key={e}><Row><Col sm>{e}</Col></Row></li>)}
            </ul>}
          <Row>
            <Col sm><span className='mini-header'>Plots</span></Col>
          </Row>
            {artifactDetails.plots.length<1 ? <p>No linked plots</p> : <ul> {artifactDetails.plots.map(p => <li key={p.id}>
                  <Link onClick={() => props.changeTab('Plots')} to={`/plots/${p.id}`}>{p.name}</Link></li>)}
                  </ul>
            }
          <Row>
              <Col sm><span className='mini-header'>Events <span className='new'>[CREATE EVENT BUTTON]</span></span></Col>
            </Row>
            {artifactDetails.events.length<1 ? <p>No linked events</p> : <ul> {artifactDetails.events.map(e => <li key={e.id}>
                  <Link onClick={() => props.changeTab('Events')} to={`/events/${e.id}`}>{e.name}</Link></li>)}
                  </ul>
            }
          <Row>
            <Col sm><span className='mini-header'>GM Notes</span></Col>
          </Row>
          <Row>
            <Col sm>
            {artifact_notes.length <1 ? <p>No notes</p> : <ul>
              {artifact_notes.map(n => <li key={n}><Row><Col sm>{n}</Col></Row></li>)}
            </ul>}
            </Col>
          </Row>
          <Row>
            <Col sm>&nbsp;</Col>
          </Row>  
          <Row>
          <Col sm><span className='mini-header new'>GM Notes During the Runs [ADD NOTE BUTTON] [HIDE PREVIOUS RUNS CHECKBOX]</span></Col>
          </Row>
          <ul><li><Row>
            <Col sm><span>Timestamp: Note 6</span></Col>
          </Row></li>
          <li><Row>
            <Col sm><span>Timestamp: Note 5</span></Col>
          </Row></li>
          <li><Row>
            <Col sm><span>Timestamp: Note 4</span></Col>
          </Row></li>
          <li><Row>
            <Col sm><span>Timestamp: Note 3</span></Col>
          </Row></li>
          <li><Row>
            <Col sm><span>Timestamp: Note 2</span></Col>
          </Row></li>
          <li><Row>
            <Col sm><span>Timestamp: Note 1</span></Col>
          </Row></li>
          </ul>
          <Row>
            <Col sm><span className='new'>Save the notes between games!</span></Col>
          </Row>
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
