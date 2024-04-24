import React from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { apiUrl } from "../api";

import './Plot.css';

const getPlot = async (id) => {
  const response = await fetch(apiUrl(`/story/plots/${id}`));
  const plot = await response.json();
  return plot;
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

const getNpcs = async () => {
    const response = await fetch(apiUrl("/person?show_hidden=true&is_character=false"));
    const npcs = await response.json();
    return npcs.persons;
  }

export default function Plot(props) {
  const [plot, setPlot] = React.useState(null);
  const [messages, setMessages] = React.useState(null);
  const [characters, setCharacters] = React.useState([]);
  const params = useParams();


  React.useEffect(() => {
    if (!params.id) return;
    getPlot(params.id).then((s) => setPlot(s));
  }, [params.id, setPlot]);

  React.useEffect(() => {
    getMessages().then((s) => setMessages(s));
  }, [setMessages]);

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

  React.useEffect(() => {
    props.changeTab('Plots');
  }, [props]);

  const renderPlot = () => {
    if (!plot || !messages) return null;
    const relatedMessageIds = plot.messages.map(m => m.id)
    const relatedMessages = messages.filter(m => relatedMessageIds.includes(m.id))
    const relatedCharacterIds = plot.persons.map(p => p.id)
    const relatedCharacters = characters.filter(c => relatedCharacterIds.includes(c.id))
    const plot_notes = plot.gm_notes ? plot.gm_notes.split('\n') : [];
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
                <Col sm={4}><span className='caption'>Text NPC should send first message: </span>{plot.text_npc_first_message ? "Yes" : "No"}</Col>
                <Col sm={4}><span className='caption'>Plot size: </span>{plot.size}</Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <span className='caption'>Happens after jump: </span>
                  {plot.after_jump ? plot.after_jump : <span>No jump defined</span>}
                </Col>
                <Col sm={4}>
                  <span className='caption'>Plot themes: </span>
                  {plot.themes.length<1 ? <span>No themes defined</span> : plot.themes}
                </Col>
              </Row>
              <Row>
                <Col sm={4}><span className='caption'>Locked plot: </span>{plot.locked ? "Yes" : "No"}</Col>
                <Col sm={4}><span className='caption'>Plot Importance: </span> {plot.importance}</Col>
              </Row>
              <Row>
                <Col sm>&nbsp;</Col>
              </Row>
              <Row>
                <Col sm><span className='mini-header'>Short Description</span></Col>
              </Row>
              <Row>
                <Col sm>
                  {plot.description}
                </Col>
              </Row>
              <Row>
                <Col sm>&nbsp;</Col>
              </Row>
              <Row>
                <Col sm><span className='mini-header'>GM Notes</span></Col>
              </Row>
              {plot_notes.length <1 ? <ul><li>No notes</li></ul> : <ul>
                {plot_notes.map(n => <li key={n}>{n}</li>)}
              </ul>}
              <Row>
                <Col sm={4}><span className='mini-header'>Characters Involved</span>
                  {plot.persons.length<1 ? <p>No linked characters</p> : <ul> {relatedCharacters.map(p => <li key={p.id}>
                    <span className='characters'><Link onClick={() => props.changeTab('Characters')} to={`/characters/${p.id}`}>{p.full_name}</Link></span>
                    <span> - {p.is_character ? "Character" : "NPC"}</span></li>)}
                    </ul>
                  }</Col>
                <Col sm={4}><span className='mini-header'>Character Groups Involved</span>
                {characterGroups.length <1 ? <p>No linked character groups</p> : 
              <ul>{characterGroups.map(g => <li key={g}><Row><Col sm>{g}</Col></Row></li>)}</ul>}
              </Col></Row>
              <Row>
                <Col sm={4}><span className='mini-header'>Events</span>
                  {plot.events.length<1 ? <ul><li>No linked events</li></ul> : <ul> {plot.events.map(e => <li key={e.id}>
                    <span className='events'><Link onClick={() => props.changeTab('Events')} to={`/events/${e.id}`}>{e.name}</Link></span></li>)}
                  </ul>}
                </Col>
                <Col sm={4}><span className='mini-header'>Artifacts</span>
                  {plot.artifacts.length<1 ? <ul><li>No linked artifacts</li></ul> : <ul> {plot.artifacts.map(a => <li key={a.id}>
                    <span className='artifacts'><Link onClick={() => props.changeTab('Artifacts')} to={`/artifacts/${a.id}`}>{a.catalog_id}, {a.name}</Link></span></li>)}
                  </ul>}
                </Col>
              </Row>
              <Row>
                <Col sm><span className='mini-header'>Messages</span>
                {relatedMessages.length<1 ? <ul><li>No messages</li></ul> : <ul> {relatedMessages.map(m => <li key={m.id}>
                  <span className='messages'><Link onClick={() => props.changeTab('Messages')} to={`/messages/${m.id}`}>{m.name}</Link> - Sent: {m.sent}</span></li>)}
                    </ul>}
              </Col></Row>
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
                <Col sm><span className='mini-header'>Copied from characters (optional)</span></Col>
              </Row>
              <Row>
                <Col sm>
                {copiedFromCharacter.length <1 ? <p>Nothing copied</p> : 
                copiedFromCharacter.map(n => <p key={n}>{n}</p>)}
                  </Col>
              </Row>
              <Row>
                <Col sm>&nbsp;</Col>
              </Row>
            </Container>
          </div>
        </div>
      )
    }

    return (
      <div>
        <h1 className='plot' id="app-title">{plot?.name}</h1>
        {renderPlot()}
      </div>
    )
  }