import React from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { apiGetRequest } from "../api";
import useSWR from "swr";
import { Button, ButtonGroup } from "react-bootstrap";
import { BiPencil } from "react-icons/bi";
import CreateEditPlotModal from "./modals/CreateEditPlotModal";

import './Plot.css';

export default function Plot(props) {
  const [showPlotEdit, setShowPlotEdit] = React.useState(false);
  const params = useParams();

  const { data: plot, error, isLoading, mutate: mutatePlot } = useSWR(
    "/story/plots/" + params.id,
    apiGetRequest
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load data</div>;

  const renderPlot = () => {
    const plot_notes = plot.gm_notes ? plot.gm_notes.split('\n') : [];
    const description = plot.description ? plot.description.split('\n') : [];
    const copiedFromCharacter = plot.copy_from_characters ? plot.copy_from_characters.split('\n') : [];
    const characterGroups = plot.character_groups ? plot.character_groups.split(', ') : [];

    return (
      <div>
        <div className='plot'>
          <Container fluid className='plot'>
            <Row>
              <Col sm><span className='mini-header'>Basic Info</span></Col>
            </Row>
            <Row>
              <Col sm={4}><span className='caption'>GM Actions: </span>{plot.gm_actions}</Col>
              <Col sm={4}><span className='caption'>ID: </span>{plot.id}</Col>
            </Row>
            <Row>
              <Col sm={4}><span className='caption'>Text NPC should start: </span>{plot.text_npc_first_message ? "Yes" : "No"}</Col>
              <Col sm={4}><span className='caption'>Plot size: </span>{plot.size}</Col>
            </Row>
            <Row>
              <Col sm={4}>
                <span className='caption'>Happens after jump: </span>
                {plot.after_jump ? plot.after_jump : <span>No jump defined</span>}
              </Col>
              <Col sm={4}><span className='caption'>Plot Importance: </span> {plot.importance}</Col>
            </Row>
            <Row>
              <Col sm={4}><span className='caption'>Locked plot: </span>{plot.locked ? "Yes" : "No"}</Col>
              <Col sm={6}>
                <span className='caption'>Plot themes: </span>
                {plot.themes.length < 1 ? <span>No themes defined</span> : plot.themes}
              </Col>
            </Row>
            <Row className='row-mini-header'>
              <Col sm={plot.persons.length < 4 ? 4 : 6}><span className='mini-header'>Characters Involved</span>
                <div className={plot.persons.length < 4 ? "text-to-no-columns" : "text-to-columns"}>{plot.persons.length < 1 ? <ul><li>No linked characters</li></ul> : <ul> {plot.persons.map(p => <li key={p.id}>
                  <span className='characters'><Link onClick={() => props.changeTab('Characters')} to={`/characters/${p.id}`}>{p.name}</Link></span>
                  <span> - {p.is_character ? "Character" : "NPC"}</span></li>)}
                </ul>
                }</div>
              </Col>
              <Col sm={6}><span className='mini-header'>Character Groups Involved</span>
                {characterGroups.length < 1 ? <ul><li>No linked character groups</li></ul> :
                  <ul>{characterGroups.map(g => <li key={g}><Row><Col sm>{g}</Col></Row></li>)}</ul>}
              </Col>
            </Row>
            <Row>
              <Col sm={4}><span className='mini-header'>Events</span>
                {plot.events.length < 1 ? <ul><li>No linked events</li></ul> : <ul> {plot.events.map(e => <li key={e.id}>
                  <span className='events'><Link onClick={() => props.changeTab('Events')} to={`/events/${e.id}`}>{e.name}</Link></span></li>)}
                </ul>}
              </Col>
              <Col sm={4}><span className='mini-header'>Artifacts</span>
                {plot.artifacts.length < 1 ? <ul><li>No linked artifacts</li></ul> : <ul> {plot.artifacts.map(a => <li key={a.id}>
                  <span className='artifacts'><Link onClick={() => props.changeTab('Artifacts')} to={`/artifacts/${a.id}`}>{a.catalog_id} - {a.name}</Link></span></li>)}
                </ul>}
              </Col>
            </Row>
            <Row>
              <Col sm><span className='mini-header'>Messages</span>
                {plot.messages.length < 1 ? <ul><li>No linked messages</li></ul> : <ul> {plot.messages.map(m => <li key={m.id}>
                  <span className='messages'><Link onClick={() => props.changeTab('Messages')} to={`/messages/${m.id}`}>{m.name}</Link> - Sent: {m.sent}</span></li>)}
                </ul>}
              </Col>
            </Row>
            <Row>
              <Col sm><span className='mini-header'>Description</span></Col>
            </Row>
            <Row>
              <Col sm>
                <span className="description">
                  {description.length < 1 ? <p>No description available</p> :
                    description.map(n => <p key={n}>{n}</p>)}
                </span>
              </Col>
            </Row>
            <Row>
              <Col sm><span className='mini-header'>GM Notes</span></Col>
            </Row>
            <span className='description'>{plot_notes.length < 1 ? <ul><li>No notes available</li></ul> : <ul>
              {plot_notes.map(n => <li key={n}>{n}</li>)}
            </ul>}</span>
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
              <Col sm><p className="new">Save the notes between games!</p></Col>
            </Row>
            <Row>
              <Col sm><span className='mini-header'>Copied from characters</span></Col>
            </Row>
            <Row>
              <Col sm>
                <span className="description">
                  {copiedFromCharacter.length < 1 ? <p>Nothing copied</p> :
                    copiedFromCharacter.map(n => <p key={n}>{n}</p>)}
                </span>
              </Col>
            </Row>
            <Row>
              <Col sm>&nbsp;</Col>
            </Row>
          </Container>
        </div>
        <CreateEditPlotModal
          plotToEdit={plot}
          showModal={showPlotEdit}
          handleClose={() => setShowPlotEdit(false)}
          onEditDone={mutatePlot}
        />
      </div>
    )
  }

  return (
    <div>
      <div className='splitscreen'>
        <div className='left'>
          <h1 className='plot' id="app-title"> {plot?.name}</h1>
        </div>
        <div className='right plot'>
          <ButtonGroup>
            <Button className="float-char-btn" title="Edit Plot" variant="outline-secondary" onClick={() => setShowPlotEdit(true)}><BiPencil size="24px" /><span>Edit</span></Button>
          </ButtonGroup>
        </div>
      </div>
      {renderPlot()}
    </div>
  )
}