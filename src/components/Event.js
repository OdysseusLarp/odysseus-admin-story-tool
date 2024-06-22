import React from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { apiGetRequest } from "../api";
import TableLoading from "./TableLoading";
import { Button, ButtonGroup } from "react-bootstrap";
import { BiPencil } from "react-icons/bi";
import CreateEditEventModal from "./modals/CreateEditEventModal";

import './Event.css';

const getIsCharacterText = (character) => {
  if (!character)
    return null
  if (character.is_character === true)
    return 'Character'
  else if (character.is_character === false)
    return 'NPC'
  else
    return 'Random Generated Character'
}

export default function Event(props) {
  const [showEventEdit, setShowEventEdit] = React.useState(false);
  const params = useParams();

  const { data: event, error, isLoading, mutate: mutateEvent } = useSWR(
    "/story/events/" + params.id,
    apiGetRequest
  );

  if (isLoading) return <TableLoading />;
  if (error) return <div>Failed to load data</div>;

  const renderEvent = () => {
    if (!event) return null;
    const gm_notes = event.gm_notes ? event.gm_notes.split('\n') : [];
    const gm_note_npc = event.gm_note_npc ? event.gm_note_npc.split('\n') : [];
    const character_groups = event.character_groups ? event.character_groups.split(',').flat() : [];

    return (
      <div>
        <div className='event'>
          <Container fluid className='event'>
            <Row>
              <Col sm={4}><span className='mini-header'>Basic Info</span></Col>
            </Row>
            <Row>
              <Col sm={4}><span className='caption'>GM Actions: </span>{event.gm_actions}</Col>
              <Col sm={4}><span className='caption'>Event size: </span>{event.size}</Col>
              <Col sm={4}><span className='caption'>ID: </span>{event.id}</Col>
            </Row>
            <Row>
              <Col sm={4}><span className='caption'>Happens after jump: </span>{event.after_jump ? event.after_jump : "?"}</Col>
              <Col sm={6}><span className='caption'>Event type: </span> {event.type}</Col>
            </Row>
            <Row>
              <Col sm={4}><span className='caption'>Locked event: </span>{event.locked ? "Yes" : "No"}</Col>
              <Col sm={6}><span className='caption'>Event Importance: </span>{event.importance}</Col>
            </Row>
            <Row>
              <Col sm={4}><span className='caption'>Status: </span>{event.status}</Col>
              <Col sm={6}><span className='caption'>DMX event number: </span>{event.dmx_event_num ? event.dmx_event_num : "-"}</Col>
            </Row>
            <Row className='row-mini-header'>
              <Col sm><span className='mini-header'>NPC needs</span></Col>
            </Row>
            {event.npc_count === 0 ?
              <Row>
                <Col sm={4}><p><span className='caption'>NPC Count: </span> {event.npc_count}</p></Col>
              </Row> :
              <Row>
                <Col sm={4}><span className='caption'>NPC Count: </span> {event.npc_count}</Col>
                <Col sm={6}><span className='caption'>NPC Location: </span> {event.npc_location}</Col>
              </Row>
            }
            {event.npc_count === 0 ? <Row /> :
              <Row>
                <Col sm><span className='caption'>What is required from NPCs?</span>
                  {gm_note_npc.length < 1 ? <ul><li>No notes</li></ul> : <ul>{gm_note_npc.map(n => <li key={n}>{n}</li>)}</ul>}
                </Col>
              </Row>
            }
            <Row>
              <Col sm={event.persons.length < 4 ? 4 : 6}><span className='mini-header'>Characters Involved</span>
                <div className={event.persons.length < 4 ? "text-to-no-columns" : "text-to-columns"}>{event.persons.length < 1 ? <ul><li>No linked characters</li></ul> : <span><ul> {event.persons.map(p => <li key={p.id}>
                  <span className='characters'><Link onClick={() => props.changeTab('Characters')} to={`/characters/${p.id}`}>{p.name}</Link></span>
                  <span> - {getIsCharacterText(p)}</span></li>)}
                </ul></span>}</div>
              </Col>
              <Col sm={6}><span className='mini-header'>Character Groups Involved</span>
                {character_groups.length < 1 ? <ul><li>No character groups</li></ul> : <ul>{character_groups.map(n => <li key={n}>{n}</li>)}</ul>}
              </Col>
            </Row>
            <Row>
              <Col sm="4"><span className='mini-header'>Plots</span>
                <span>{event.plots.length < 1 ? <ul><li>No linked plots</li></ul> : <ul> {event.plots.map(p => <li key={p.id}>
                  <span className='plots'><Link onClick={() => props.changeTab('Plots')} to={`/plots/${p.id}`}>{p.name}</Link></span></li>)}
                </ul>
                }</span></Col>
              <Col sm="6"><span className='mini-header'>Artifacts</span>
                {event.artifacts.length < 1 ? <ul><li>No linked artifacts</li></ul> : <ul> {event.artifacts.map(a => <li key={a.id}>
                  <span className='artifacts'><Link onClick={() => props.changeTab('Artifacts')} to={`/artifacts/${a.id}`}>{a.name} - Catalog ID: {a.catalog_id}</Link></span></li>)}
                </ul>
                }
              </Col>
            </Row>
            <Row>
              <Col sm><span className='mini-header'>Messages</span>
                <span>{event.messages.length < 1 ? <ul><li>No linked messages</li></ul> : <ul> {event.messages.map(m => <li key={m.id}>
                  <span className='messages'><Link onClick={() => props.changeTab('Messages')} to={`/messages/${m.id}`}>{m.name}</Link></span> - Sent: {m.sent}</li>)}
                </ul>
                }</span>
              </Col>
            </Row>
            <Row>
              <Col sm><span className='mini-header'>Description</span></Col>
            </Row>
            <Row>
              <Col><span className='description'>{event.description ? event.description : "No description available"}</span></Col>
            </Row>
            <Row>
              <Col sm>&nbsp;</Col>
            </Row>
            <Row>
              <Col sm><span className='mini-header'>GM Notes</span></Col>
            </Row>
            <span className='description'>{gm_notes.length < 1 ? <ul><li>No notes available</li></ul> : <ul>{gm_notes.map(n => <li key={n}>{n}</li>)}</ul>}</span>
            <Row>
              <Col sm>&nbsp;</Col>
            </Row>
          </Container>
        </div>
        <CreateEditEventModal
          eventToEdit={event}
          showModal={showEventEdit}
          handleClose={() => setShowEventEdit(false)}
          onEditDone={mutateEvent}
        />
      </div>
    )
  }

  return (
    <div>
      <div className='splitscreen'>
        <div className='left'>
          <h1 className='event' id="app-title"> {event?.name}</h1>
        </div>
        <div className='right event'>
          <ButtonGroup>
            <Button className="float-char-btn" title="Edit Event" variant="outline-secondary" onClick={() => setShowEventEdit(true)} disabled={event?.status === 'Done'}><BiPencil size="24px" /><span>Edit</span></Button>
          </ButtonGroup>
        </div>
      </div>
      {renderEvent()}
    </div>
  );
}
