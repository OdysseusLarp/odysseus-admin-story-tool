import React from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { apiUrl } from "../api";

import './Event.css';

const getEvent = async (id) => {
  const response = await fetch(apiUrl(`/story/events/${id}`));
  const event = await response.json();
  return event;
}

const is_npc = (character) => {
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
  const [event, setEvent] = React.useState(null);

  const params = useParams();


  React.useEffect(() => {
    if (!params.id) return;
    getEvent(params.id).then((s) => setEvent(s));
  }, [params.id, setEvent]);

  React.useEffect(() => {
    props.changeTab('Events');
  }, [props]);

  const renderEvent = () => {
    if (!event) return null;
    const gm_notes = event.gm_notes ? event.gm_notes.split('\n') : [];
    const gm_note_npc = event.gm_note_npc ? event.gm_note_npc.split('\n') : [];
    const character_groups = event.character_groups ? event.character_groups.split(',').flat() : [];

    return (
      <div className='event'>
        <Container fluid className='event'>
          <Row>
            <Col sm><span className='mini-header'>Basic Info</span></Col>
          </Row>
          <Row>
            <Col sm={4}><span className='caption'>GM Actions: </span>{event.gm_actions}</Col>
            <Col sm={6}><span className='caption'>Event size: </span>{event.size}</Col>
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
            <Col sm={6}><span className='caption'>DMX event number: </span>{event.dmx_event_num ? event.dmx_event_num : "None"}</Col>
          </Row>
          <Row>
            <Col sm>&nbsp;</Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header'>Short Description</span></Col>
          </Row>
          <Row>
            <Col><span className='description'>{event.description}</span></Col>
          </Row>
          <Row>
            <Col sm>&nbsp;</Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header'>GM Notes</span></Col>
          </Row>
          <span className='description'>{gm_notes.length <1 ? <ul><li>No notes</li></ul> : <ul>{gm_notes.map(n => <li key={n}>{n}</li>)}</ul>}</span>
          <Row>
            <Col sm><span className='mini-header'>NPC needs</span></Col>
          </Row>
          {event.npc_count === 0 ?
            <Row>
              <Col sm={4}><p><span className='caption'>NPC Count: </span> {event.npc_count}</p></Col>
            </Row> :
            <Row>
              <Col sm={4}><span className='caption'>NPC Count: </span> {event.npc_count}</Col>
              <Col sm={6}><span className='caption'>NPC Location: </span> {event.npc_location}</Col>
            </Row>}
          {event.npc_count === 0 ? <Row /> :
            <Row>
              <Col sm><span className='caption'>What is required from NPCs?</span> 
                {gm_note_npc.length <1 ? <ul><li>No notes</li></ul> : <ul>{gm_note_npc.map(n => <li key={n}>{n}</li>)}</ul>}
              </Col>
            </Row>}
          <Row>
            <Col sm={4}><span className='mini-header'>Characters Involved</span>
              {event.persons.length < 1 ? <ul><li>No linked characters</li></ul> : <span><ul> {event.persons.map(p => <li key={p.id}>
                <span className='characters'><Link onClick={() => props.changeTab('Characters')} to={`/characters/${p.id}`}>{p.name}</Link></span>
                <span> - {is_npc(p)}</span></li>)}
              </ul></span>}
            </Col>
            <Col sm={6}><span className='mini-header'>Character Groups Involved</span>
            {character_groups.length <1 ? <ul><li>No involved character groups</li></ul> : <ul>{character_groups.map(n => <li key={n}>{n}</li>)}</ul>}
           </Col></Row>
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
              <span>{event.messages.length < 1 ? <ul><li>No messages</li></ul> : <ul> {event.messages.map(m => <li key={m.id}>
                <span className='messages'><Link onClick={() => props.changeTab('Messages')} to={`/messages/${m.id}`}>{m.name}</Link></span> - Sent: {m.sent}</li>)}
              </ul>
              }</span>
            </Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header'>GM Notes During the Runs [ADD NOTE BUTTON] [HIDE PREVIOUS RUNS CHECKBOX]</span></Col>
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
            <Col sm><span>Save the notes between games!</span></Col>
          </Row>
          <Row>
            <Col sm>&nbsp;</Col>
          </Row>
        </Container>


      </div>
    )
  }

  return (
    <div>
      <Row>
        <Col sm><h1 className='event'>{event?.name}</h1>

        </Col>

      </Row>
      {renderEvent()}
    </div>
  );
}
