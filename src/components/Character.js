import React from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import FloatingButtons from "./FloatingButtons";
import { apiGetRequest } from "../api";
import TableLoading from "./TableLoading";
import useSWR from "swr";
import { Button } from "react-bootstrap";
import { BiPencil } from "react-icons/bi";
import EditCharacterModal from "./modals/EditCharacterModal";

import './Character.css';

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

export default function Character(props) {
  const [showCharacterEdit, setShowCharacterEdit] = React.useState(false);
  const params = useParams();

  const swrCharacter = useSWR( "/person/" + params.id, apiGetRequest);
  const swrCharacterStory = useSWR( "/story/person/" + params.id, apiGetRequest);
  const swrFleet = useSWR( "/fleet?show_hidden=true", apiGetRequest);

  const isLoading = swrCharacter.isLoading || swrCharacterStory.isLoading || swrFleet.isLoading;
  const error = swrCharacter.error || swrCharacterStory.error || swrFleet.error;

  if (isLoading) return <TableLoading />;
  if (error) return <div>Failed to load data</div>;

  const character = swrCharacter.data;
  const characterStory = swrCharacterStory.data;
  const fleet = swrFleet.data;

  const renderCharacter = () => {
    if (!character) return null;
    if (!characterStory) return null;
    const military_history = character.entries.filter((e) => e.type === "MILITARY").map((e) => e.entry.split('\n\n')).flat();
    const military_history_list = military_history.map(milhistory => <li key={milhistory}>{milhistory}</li>);
    const medical_history = character.entries.filter((e) => e.type === "MEDICAL").map((e) => e.entry.split('\n\n')).flat();
    const medical_history_list = medical_history.map(medhistory => <li key={medhistory}>{medhistory}</li>);
    const personal_history = character.entries.filter((e) => e.type === "PERSONAL").map((e) => e.entry.split('\n\n')).flat();
    const personal_history_list = personal_history.map(phistory => <li key={phistory}>{phistory}</li>);
    const character_summary = character.summary ? character.summary.split('\n') : [];

    const getShipById = (ship_id) => {
      const shipName = (ship_id ? fleet.find(ship => ship.id === ship_id)?.name : "");
      return shipName;
    }

    const family_list = character.family.map(person => <li key={person.id}><Link onClick={() => props.changeTab('Characters')} to={`/characters/${person.id}`}>{person.full_name}</Link> - {person._pivot_relation} - {person.status} - {getIsCharacterText(person)} {person.ship_id ? <span className='fleet'>- <Link onClick={() => props.changeTab('Fleet')} to={`/fleet/${person.ship_id}`}>{person.ship_id && getShipById(person.ship_id)}</Link></span> : ""}</li>);
    const relations_list = characterStory.relations.map(person => <li key={person.id}><Link onClick={() => props.changeTab('Characters')} to={`/characters/${person.id}`}>{person.name}</Link> - {person.status} - {getIsCharacterText(person)} {person.ship ? <span className='fleet'>- <Link onClick={() => props.changeTab('Fleet')} to={`/fleet/${person.ship}`}>{person.ship && getShipById(person.ship)}</Link></span> : ""}<ul key={person.id}><li>{person.relation}</li></ul></li>);
    const military_academies_list = character.military_academies && character.military_academies.split(',').map(r => <li key={r}>{r}</li>);
    const gm_notes_list = character.gm_notes ? character.gm_notes.split('\n') : [];

    return (
      <div>
      <div className='character'>
        <Container fluid className='character'>
          <Row>
            <Col sm>
             {character.link_to_character ? <a href={character.link_to_character} target="_blank" rel="noreferrer">Link to Character document</a> : ""}
            </Col>
          </Row>
          <Row className='row-mini-header'>
            <Col sm><span className='mini-header'>Basic Info</span></Col>
          </Row>
          <Row>
            <Col sm><span className='caption'>Name: </span>{character.full_name}</Col>
            <Col sm><span className='caption'>Age: </span>{542 - character.birth_year}</Col>
            <Col sm><span className='caption'>Card ID: </span>{character.card_id}</Col>
          </Row>
          <Row>
            <Col sm><span className='caption'>Title: </span>{character.title ? character.title : "-"}</Col>
            <Col sm><span className='caption'>Birth Year: </span>{character.birth_year}</Col>
            <Col sm><span className='caption'>Bio ID: </span>{character.bio_id}</Col>
          </Row>
          <Row>
            <Col sm><span className='caption'>Occupation: </span>{character.occupation}</Col>
            <Col sm><span className='caption'>File created: </span>{character.created_year}</Col>
            <Col sm><span className='caption'>Citizen ID: </span>{character.citizen_id}</Col>
          </Row>
          <Row>
            <Col sm><span className='caption'>Wartime role: </span>{character.role ? character.role : "-"}</Col>
            <Col sm><span className='caption'>Home planet: </span>{character.home_planet}</Col>
            <Col sm><span className='caption'>Database ID: </span>{character.id}</Col>
          </Row>
          <Row>
            <Col sm={8}><span className='caption'>Military Rank: </span>{character.military_rank ? character.military_rank : "-"}</Col>
          </Row>
          <Row>
            <Col sm><span className='caption'>Shift: </span>{character.shift ? character.shift : "-"}</Col>
          </Row>
          <Row className='row-mini-header'>
            <Col sm><span className='mini-header'>Social Details</span></Col>
          </Row>
          <Row>
            <Col sm={4}><span className='caption'>Social Class: </span>{character.social_class}</Col>
            <Col sm={8}><span className='caption'>Religion: </span>{character.religion}</Col>
          </Row>
          <Row>
            <Col sm={4}><span className='caption'>Dynasty: </span>{character.dynasty}</Col>
            <Col sm={8}><span className='caption'>Political Party: </span>{character.political_party}</Col>
          </Row>
          <Row className='row-mini-header'>
            <Col sm><span className='mini-header'>Current Status</span></Col>
          </Row>
          <Row>
            <Col sm={4}><span className='caption'>Status: </span>{character.status}</Col>
            <Col sm={4}><span className='caption'>Ship: </span>{character.ship ? <span className='fleet'><Link onClick={() => props.changeTab('Fleet')} to={`/fleet/${character.ship.id}`}>{character.ship.name}</Link></span> : "None"}</Col>
          </Row>
          <Row className='row-mini-header'>
            <Col sm><span className='mini-header'>GM Information</span></Col>
          </Row>
          <Row>
            <Col sm={4}><span className='caption'>Character group: </span>{character.character_group ? character.character_group : "-"}</Col>
            <Col sm={4}><span className='caption'>Elder gene: </span>{character.medical_elder_gene ? "Yes" : "No"}</Col>
          </Row>
          <Row>
            <Col sm={4}><span className='caption'>Additional role: </span>{character.role_additional ? character.role_additional : "-"}</Col>
          </Row>
          <Row>
            <Col sm={8}><span className='caption'>Special group: </span>{character.special_group ? character.special_group : "-"}</Col>
          </Row>
          <Row className='row-mini-header'>
            <Col sm={4}><span className='mini-header'>Plots</span>
              <span className="plots">{characterStory?.plots.length < 1 ? <ul><li>No linked plots</li></ul> : <ul> {characterStory?.plots.map(p => <li key={p.id}>
                <Link onClick={() => props.changeTab('Plots')} to={`/plots/${p.id}`}>{p.name}</Link></li>)}
              </ul>
              }</span>
            </Col>
            <Col sm={8}><span className='mini-header'>Events</span>
              <span className="events">{characterStory?.events.length < 1 ? <ul><li>No linked Events</li></ul> : <ul> {characterStory?.events.map(e => <li key={e.id}>
                <Link onClick={() => props.changeTab('Events')} to={`/events/${e.id}`}>{e.name}</Link></li>)}
              </ul>
              }</span>
            </Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header'>Messages</span>
              <span className="messages">{characterStory.messages.length < 1 ? <ul><li>No messages</li></ul> : <ul> {characterStory.messages.map(m => <li key={m.id}>
                <Link onClick={() => props.changeTab('Messages')} to={`/messages/${m.id}`}>{m.name}</Link> - Sent: {m.sent}</li>)}
              </ul>
              }</span>
            </Col>
          </Row>
          <Row>
            <Col sm ><span className='mini-header'>Summary</span></Col>
          </Row>
          <span className="description">{character_summary.length < 1 ? <p>No summary</p> : <ul>{character_summary.map(n => <li key={n}><Row><Col sm>{n}</Col></Row></li>)}
          </ul>}</span>
          <Row>
            <Col sm>
              <span className='mini-header'>GM Notes
                <Button className="float-char-btn edit-btn" title="Edit GM Note" variant="outline-secondary" size="sm" onClick={() => setShowCharacterEdit(true)} ><BiPencil size="18px" /></Button>
              </span>
            </Col>
          </Row>
          <Row>
            <Col sm>
              <span className="description">{gm_notes_list.length <1 ? <ul><li>No notes</li></ul> :
                <ul>{gm_notes_list.map(n => <li key={n}>{n}</li>)}</ul>}</span>
            </Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header' id='family'>Family</span></Col>
          </Row>
          <Row>
            <Col sm>{family_list.length ? <ul>{family_list}</ul> : <ul><li>None</li></ul>}</Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header'>Other known relations</span></Col>
          </Row>
          <Row>
            <Col sm><span className="description">{relations_list.length ? <ul>{relations_list}</ul> : <ul><li>None</li></ul>}</span></Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header'>Personal</span></Col>
          </Row>
          <Row>
            <Col sm>{personal_history_list ? <ul>{personal_history_list}</ul> : <ul><li>None</li></ul>}</Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header'>Classified personal data</span></Col>
          </Row>
          <Row>
            <Col sm><span className="description">{character.personal_secret_info ? character.personal_secret_info : "No classified personal data"}</span></Col>
          </Row>
          <Row className='row-mini-header'>
            <Col sm><span className='mini-header' id='military'>Military</span></Col>
          </Row>
          <Row>
            <Col sm={4}>
              <span className='caption'>Military Academies: </span>
              {military_academies_list ? <ul>{military_academies_list}</ul> : "None"}
            </Col>
            <Col sm={8}><span className='caption'>Military Rank: </span>{character.military_rank ? character.military_rank : "-"}</Col>
          </Row>
          <Row>
            <Col sm>
              <span className='caption'>Military Remarks:</span>{!character.military_remarks && " None"}
              {character.military_remarks && <ul>{character.military_remarks.split('\n\n').filter(Boolean).map(r => <li key={r}>{r}</li>)}</ul>}
            </Col>
          </Row>
          <Row>
            <Col sm><span className='caption'>Military Service History</span></Col>
          </Row>
          <Row>
            <Col sm>{military_history_list?.length ? <ul>{military_history_list}</ul> : <ul><li>None</li></ul>}</Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header' id='medical'>Medical</span></Col>
          </Row>
          <Row>
            <Col sm><span className='caption'>Fitness Level: </span>{character.medical_fitness_level ? character.medical_fitness_level : "-"}</Col>
            <Col sm><span className='caption'>Blood Type: </span>{character.medical_blood_type ? character.medical_blood_type : "-"}</Col>
            <Col sm><span className='caption'>Last Fitness Check: </span>{character.medical_last_fitness_check ? character.medical_last_fitness_check : "-"}</Col>
          </Row>
          <Row>
            <Col sm>
              <span className='caption'>Active Conditions</span>{!character.medical_active_conditions && <span><span className='caption'>:</span> None</span>}
              {character.medical_active_conditions && <ul>{character.medical_active_conditions.split('\n\n').filter(Boolean).map(c => <li key={c}>{c}</li>)}</ul>}
            </Col>
            <Col sm>
              <span className='caption'>Current Medication</span>{!character.medical_current_medication && <span><span className='caption'>:</span> None</span>}
              {character.medical_current_medication && <ul>{character.medical_current_medication.split('\n\n').filter(Boolean).map(m => <li key={m}>{m}</li>)}</ul>}
            </Col>
            <Col sm>
              <span className='caption'>Allergies</span>{!character.medical_allergies && <span><span className='caption'>:</span> None</span>}
              {character.medical_allergies && <ul>{character.medical_allergies.split(',').filter(Boolean).map(c => <li key={c}>{c}</li>)}</ul>}
            </Col>
          </Row>
          <Row>
            <Col sm><span className='caption'>Medical History</span>{medical_history.length === 0 && <span><span className='caption'>:</span> None</span>}</Col>
          </Row>
          <Row>
            <Col sm>{medical_history_list ? <ul>{medical_history_list}</ul> : "None"}</Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header'>Groups/Roles</span></Col>
          </Row>
          {character.groups.length === 0 && <ul><li>None</li></ul>}
          <ul>{character.groups.map(group => <li key={group}>{group}</li>)}</ul>
          <Row className='row-mini-header'>
            <Col sm><span className='mini-header'>Metadata</span></Col>
          </Row>
          <Row>
            <Col sm={4}><span className='caption'>Is Character: </span>{getIsCharacterText(character)}</Col>
            <Col sm={4}><span className='caption'>Is Visible: </span>{character.is_visible ? "Yes" : "No"}</Col>
          </Row>
          <Row>
            <Col sm>&nbsp;</Col>
          </Row>
        </Container>
      </div>
      <EditCharacterModal
        characterToEdit={character}
        showModal={showCharacterEdit}
        handleClose={() => setShowCharacterEdit(false)}
        onEditDone={swrCharacter.mutate}
      />
      </div>
    )
  }

  return (
    <div className='character'>
      <h1 className='character' id="app-title">{character?.full_name} ({getIsCharacterText(character)})</h1>
      {renderCharacter()}
      <FloatingButtons />
    </div>
  );
}
