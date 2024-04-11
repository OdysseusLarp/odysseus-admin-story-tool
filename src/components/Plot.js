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

export default function Plot(props) {
  const [plot, setPlot] = React.useState(null);
  const [messages, setMessages] = React.useState(null);
  const params = useParams();


  React.useEffect(() => {
    if (!params.id) return;
    getPlot(params.id).then((s) => setPlot(s));
  }, [params.id, setPlot]);

  React.useEffect(() => {
    getMessages().then((s) => setMessages(s));
  }, [setMessages]);

  React.useEffect(() => {
    props.changeTab('Plots');
  }, [props]);

  console.log("Plot",plot)
  console.log("messages", messages)

  const renderPlot = () => {
    if (!plot || !messages) return null;
    const relatedMessageIds = plot.messages.map(m => m.id)
    const relatedMessages = messages.filter(m => relatedMessageIds.includes(m.id))
    console.log("related", relatedMessages)
    return (
        <div>
          <div className='plot'>
            <Container fluid className='plot'>
              <Row>
                <Col sm><span className='mini-header'>
                  Characters Involved</span>
                  {plot.persons.length<1 ? <p>No linked characters</p> : <ul> {plot.persons.map(p => <li key={p.id}>
                    <Link onClick={() => props.changeTab('Characters')} to={`/characters/${p.id}`}>
                    {p.name}</Link></li>)}
                    </ul>
                  }
                  {<span className='define'><ul><li>Name Surname (Main character, Character)</li><li>Name Surname2 (Side character, NPC)</li><li>Name Surname2 (Knows random info, Character)</li></ul></span>}
                  </Col>
              </Row>
             
              <Row>
                <Col sm><span className='mini-header'>Character Groups Involved</span></Col>
              </Row>
              {<span className='define'><ul><li>Engineers</li><li>Scientists</li><li>All</li></ul></span>}
              <Row>
                <Col sm><span className='mini-header'>Basic Info</span></Col>
              </Row>
              <Row>
                <Col sm={6}><span className='caption'>GM Actions: </span>{plot.gm_actions}
                <br/>
                <span className='define'>No need / Text NPC / Event / Briefing Character</span></Col>
                <Col sm={4}><span className='caption'>Plot size: </span>{plot.size}</Col>
              </Row>
              <Row>
                <Col sm={6}><span className='caption'>Text NPC should send first message: </span>{plot.text_npc_first_message ? "Yes" : "No"}</Col>
                <Col sm={4}><span className='caption'>Plot themes: </span>
                {plot.themes.length<1 ? <p>No themes defined</p> : plot.themes}
                <br/>
                <span className='define'>Love / Beatrayal / Political / Machine</span></Col>
              </Row>
              <Row>
                <Col sm={6}><span className='caption'>Happens after jump: </span>
                {plot.after_jump ? plot.after_jump : <p>No jump defined</p>}
                <br/>
                <span className='define'>- / 3 / 13 (Editable unless plot is locked)</span></Col>
                <Col sm={4}><span className='caption'>Plot Importance: </span> {plot.importance}</Col>
              </Row>
              <Row>
                <Col sm={6}><span className='caption'>Locked plot: </span>{plot.locked ? "Yes" : "No"}</Col>
              </Row>
              <Row>
                <Col sm>&nbsp;</Col>
              </Row>
              <Row>
                <Col sm><span className='mini-header'>Events [CREATE EVENT BUTTON]</span></Col>
              </Row>
              {plot.events.length<1 ? <p>No linked events</p> : <ul> {plot.events.map(e => <li key={e.id}>
                  <Link onClick={() => props.changeTab('Events')} to={`/events/${e.id}`}>{e.name}</Link></li>)}
                  </ul>
              }
              <Row>
                <Col sm><span className='mini-header'>Messages [CREATE MESSAGE BUTTON]</span></Col>
              </Row>
              {relatedMessages.length<1 ? <p>No messages</p> : <ul> {relatedMessages.map(m => <li key={m.id}>
                  <Link onClick={() => props.changeTab('Messages')} to={`/messages/${m.id}`}>{m.name}</Link> {m.sent ? "[Already sent]" : "[Not send yet"}</li>)}
                  </ul>
              }
              <Row>
                <Col sm><span className='mini-header'>Artifacts</span></Col>
              </Row>
              {plot.artifacts.length<1 ? <p>No linked artifacts</p> : <ul> {plot.artifacts.map(a => <li key={a.id}>
                  <Link onClick={() => props.changeTab('Artifacts')} to={`/artifacts/${a.id}`}>Artifact id {a.id}, {a.name}</Link></li>)}
                  </ul>
              }
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
              <Row>
                <Col sm><span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span></Col>
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
              <Row>
                <Col sm><span className='mini-header'>Copied from characters (optional)</span></Col>
              </Row>
              <Row>
                <Col sm><span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span></Col>
              </Row>
              <Row>
                <Col sm><span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span></Col>
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
        <h1 className='plot' id="app-title">{plot?.name} <span className="define">(MAIN PLOTS) [CREATE PLOT BUTTON]</span></h1>
        {renderPlot()}
      </div>
    )
  }

   