import React from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { apiUrl } from "../api";


import './Events.css';
import './Event.css';

//TODO: Add datafetch etc. Copy from for example Character.js or Artifact.js

const getEvent = async (id) => {
  const response = await fetch(apiUrl(`/story/events/${id}`));
  const event = await response.json();
  return event;
}

const getMessages = async () => {
  const response = await fetch(apiUrl(`/story/messages/`));
  const messages = await response.json();
  return messages;
}

const getCharacters = async () => {
  const response = await fetch(apiUrl("/person?show_hidden=true&is_character=true"));
  const characters = await response.json();
  return characters.persons;
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
  const [characters, setCharacters] = React.useState([]);
  const [messages, setMessages] = React.useState([]);

  const params = useParams();


  React.useEffect(() => {
    if (!params.id) return;
    getEvent(params.id).then((s) => setEvent(s));
  }, [params.id, setEvent]);

  React.useEffect(() => {
    props.changeTab('Events');
  }, [props]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [charactersData, messageData] = await Promise.all([
          getCharacters(),
          getMessages(),
        ]);

        const allCharacters = [...charactersData];
        setCharacters(allCharacters);
        setMessages(messageData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const renderEvent = () => {
    if (!event) return null;
    const relatedCharacterIds = event.persons.map(p => p.id);
    const relatedCharacters = characters.filter(c => relatedCharacterIds.includes(c.id));
    const relatedMessageIds = event.messages.map(m => m.id);
    const relatedMessages = messages.filter(m => relatedMessageIds.includes(m.id));

    const character_groups = event.character_groups.split(',').flat();


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
            <Col sm={4}><span className='caption'>Happens after jump: </span>{event.after_jump}</Col>
            <Col sm={6}><span className='caption'>Event type: </span> {event.type}</Col>
          </Row>
          <Row>
            <Col sm={4}><span className='caption'>Locked event: </span>{event.locked ? "Yes" : "No"}</Col>
            <Col sm={6}><span className='caption'>Event Importance: </span>{event.importance}</Col>
          </Row>
          <Row>
            <Col sm={4}><span className='caption'>Status: </span>{event.status}</Col>
            <Col sm={6}><span className='caption'>DMX event number: </span>{event.dmx_event_num}</Col>
          </Row>
          <Row>
            <Col sm>&nbsp;</Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header'>Short Description</span></Col>
            <span>{event.description}</span>
          </Row>
          <Row>
            <Col sm>&nbsp;</Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header'>GM Notes</span></Col>
          </Row>
          <Row>
            <Col sm><span>{event.gm_notes < 1 ? <p>No GM notes available.</p> : event.gm_notes}</span></Col>
          </Row>
          <Row>
            <Col sm>&nbsp;</Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header'>NPC needs</span></Col>
          </Row>
          {event.npc_count === 0 ?
            <Row>
              <Col sm={4}><span className='caption'>NPC Count: </span> {event.npc_count}</Col>
            </Row> :
            <Row>
              <Col sm={4}><span className='caption'>NPC Count: </span> {event.npc_count}</Col>
              <Col sm={6}><span className='caption'>NPC Location: </span> {event.npc_location}</Col>
            </Row>}
          {event.npc_count === 0 ? <Row /> :
            <Row>
              <Col sm><span className='caption'>What is required from NPCs?</span> </Col>
              <span>{event.gm_note_npc ? event.gm_note_npc : "No needs specified"} </span>
            </Row>}
          <Row>
            <Col sm>&nbsp;</Col>
          </Row>
          <Row>
            <Col sm={4}><span className='mini-header'>Characters Involved</span>
              {event.persons.length < 1 ? <p>No linked characters</p> : <span><ul> {relatedCharacters.map(p => <li key={p.id}>
                <Link onClick={() => props.changeTab('Characters')} to={`/characters/${p.id}`}>{p.full_name}</Link>
                <span> - {is_npc(p)}</span></li>)}
              </ul></span>}</Col>
            <Col sm={6}><span className='mini-header'>Character Groups Involved</span>
              <span>{event.character_groups.length === 0 && "No involved character groups"}</span>
              {<span><ul>{character_groups.map(e => <li><Row key={e}><Col sm>{e}</Col></Row></li>)}</ul></span>}
            </Col></Row>
          <Row>
            <Col sm>&nbsp;</Col>
          </Row>
          <Row>

            <Col sm="4"><span className='mini-header'>Plots</span>
              <span>{event.plots.length < 1 ? <p>No linked plots</p> : <ul> {event.plots.map(p => <li key={p.id}>
                <Link onClick={() => props.changeTab('Plots')} to={`/plots/${p.id}`}>{p.name}</Link></li>)}
              </ul>
              }</span></Col>
            <Col sm="6"><span className='mini-header'>Artifacts</span>
              {event.artifacts.length < 1 ? <p>No linked artifacts</p> : <ul> {event.artifacts.map(a => <li key={a.id}>
                <Link onClick={() => props.changeTab('Artifacts')} to={`/artifacts/${a.id}`}>Artifact id {a.id}, {a.name}</Link></li>)}
              </ul>
              }
            </Col>
          </Row>
          <Row>
            <Col sm>&nbsp;</Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header'>Messages</span>
              <span>{event.messages.length < 1 ? <p>No messages</p> : <ul> {relatedMessages.map(m => <li key={m.id}>
                <Link onClick={() => props.changeTab('Messages')} to={`/messages/${m.id}`}>{m.name}</Link> - Sent: {m.sent}</li>)}
              </ul>
              }</span>
            </Col>
          </Row>
          <Row>
            <Col sm>&nbsp;</Col>
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
