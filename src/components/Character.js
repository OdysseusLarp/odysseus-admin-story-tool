import React from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import FloatingButtons from "./FloatingButtons";
import { apiUrl } from "../api";

import './Character.css';

const getCharacter = async (id) => {
    const response = await fetch(apiUrl(`/person/${id}`));
    const character = await response.json();
    return character;
  }

export default function Character(props) {
  const [character, setCharacter] = React.useState(null);
  const params = useParams();

  React.useEffect(() => {
    if (!params.id) return;

    getCharacter(params.id).then((s) => setCharacter(s));
  }, [params.id, setCharacter]);

  React.useEffect(() => {
    props.changeTab('Characters');
  }, []);

  const renderCharacter = () => {
    if (!character) return null;
    const military_history = character.entries.filter((e) => e.type === "MILITARY").map((e) => e.entry.split('\n\n')).flat();
    const medical_history = character.entries.filter((e) => e.type === "MEDICAL").map((e) => e.entry.split('\n\n')).flat();
    const personal_history = character.entries.filter((e) => e.type === "PERSONAL").map((e) => e.entry.split('\n\n')).flat();

    return (
      <div className='character'>
      <Container fluid className='character'>
        <Row>
          <Col sm><span className='mini-header'>Basic Info</span></Col>
        </Row>
        <Row>
          <Col sm><span className='caption'>Name: </span>{character.full_name}</Col>
          <Col sm><span className='caption'>Age: </span>{542-character.birth_year}</Col>
          <Col sm><span className='caption'>ID: </span>{character.id}</Col>
        </Row>
        <Row>
          <Col sm><span className='caption'>Title: </span>{character.title}</Col>
          <Col sm><span className='caption'>Birth Year: </span>{character.birth_year}</Col>
          <Col sm><span className='caption'>Card ID: </span>{character.card_id}</Col>
        </Row>
        <Row>
          <Col sm><span className='caption'>Occupation: </span>{character.occupation}</Col>
          <Col sm><span className='caption'>Home planet: </span>{character.home_planet}</Col>
          <Col sm><span className='caption'>Bio ID: </span>{character.bio_id}</Col>
        </Row>
        <Row>
          <Col sm><span className='caption'>Military Rank: </span>{character.military_rank}</Col>
          <Col sm><span className='caption'>Citizenship: </span>{character.citizenship}</Col>
          <Col sm><span className='caption'>Citizen ID: </span>{character.citizen_id}</Col>
        </Row>
        <Row>
          <Col sm>&nbsp;</Col>
        </Row>
        <Row>
          <Col sm><span className='caption'>File created: </span>{character.created_year}</Col>
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
          <Col sm={8}><span className='caption'>Ship: </span>{character.ship ? <span className='fleet'><Link onClick={() => props.changeTab('Fleet')} to={`/fleet/${character.ship.id}`}>{character.ship.name}</Link></span> : "None"}</Col>
        </Row>
        <Row className='row-mini-header'>
          <Col sm><span className='mini-header' id='personal'>Personal</span></Col>
        </Row>
        <Row>
          <Col sm><span className='caption'>Personal History:</span>{personal_history.length === 0 && " None"}</Col>
        </Row>
        {<ul>{personal_history.map(e => <li><Row key={e}><Col sm>{e}</Col></Row></li>)}</ul>}
        <Row className='row-mini-header'>
          <Col sm><span className='mini-header'>Family</span></Col>
        </Row>
        {<ul>{character.family.map(person => <li><Row key={person}><Col sm><span className='characters'><Link onClick={() => props.changeTab('Characters')} to={`/characters/${person.id}`}>{person.full_name}</Link></span> ({person._pivot_relation})</Col></Row></li>)}</ul>}
        <Row className='row-mini-header'>
          <Col sm><span className='mini-header' id='military'>Military</span></Col>
        </Row>
        <Row>
          <Col sm><span className='caption'>Military Rank: </span>{character.military_rank}</Col>
        </Row>
        <Row>
          <Col sm><span className='caption'>Military Remarks:</span>{!character.military_remarks && " None"}</Col>
        </Row>
        {character.military_remarks && <ul>{character.military_remarks.split('\n\n').filter(Boolean).map(r => <li><Row key={r}><Col sm>{r}</Col></Row></li>)}</ul>}
        <Row>
          <Col sm><span className='caption'>Military Service History:</span>{military_history.length === 0 && " None"}</Col>
        </Row>
        {<ul>{military_history.map(e => <li><Row key={e}><Col sm>{e}</Col></Row></li>)}</ul>}
        <Row className='row-mini-header'>
          <Col sm><span className='mini-header' id='medical'>Medical</span></Col>
        </Row>
        <Row>
          <Col sm={4}><span className='caption'>Fitness Level: </span>{character.medical_fitness_level}</Col>
          <Col sm={8}><span className='caption'>Blood Type: </span>{character.medical_blood_type}</Col>
        </Row>
        <Row>
          <Col sm><span className='caption'>Last Fitness Check: </span>{character.medical_last_fitness_check}</Col>
        </Row>
        <Row>
          <Col sm>&nbsp;</Col>
        </Row>
        <Row>
          <Col sm><span className='caption'>Allergies: </span>{character.medical_allergies || " None"}</Col>
        </Row>
        <Row>
          <Col sm><span className='caption'>Active Conditions:</span>{!character.medical_active_conditions && " None"}</Col>
        </Row>
        {character.medical_active_conditions && <ul>{character.medical_active_conditions.split('\n\n').filter(Boolean).map(c => <li><Row key={c}><Col sm>{c}</Col></Row></li>)}</ul>}
        <Row>
          <Col sm><span className='caption'>Current Medication: </span>{!character.medical_current_medication && " None"}</Col>
        </Row>
        {character.medical_current_medication && <ul>{character.medical_current_medication.split('\n\n').filter(Boolean).map(m => <li><Row key={m}><Col sm>{m}</Col></Row></li>)}</ul>}
        <Row>
          <Col sm><span className='caption'>Medical History:</span>{medical_history.length === 0 && " None"}</Col>
        </Row>
        {<ul>{medical_history.map(e => <li><Row key={e}><Col sm>{e}</Col></Row></li>)}</ul>}
        <Row className='row-mini-header'>
          <Col sm><span className='mini-header'>Groups/Roles</span></Col>
        </Row>
        <ul>{character.groups.map(group => <li><Row key={group}><Col sm>{group}</Col></Row></li>)}</ul>
        <Row className='row-mini-header'>
          <Col sm><span className='mini-header'>Metadata</span></Col>
        </Row>
        <Row>
          <Col sm={4}><span className='caption'>Is Character: </span>{character.is_character ? "Yes" : "No"}</Col>
          <Col sm={8}><span className='caption'>Is Visible: </span>{character.is_visible ? "Yes" : "No"}</Col>
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
      <h1 className='character' id="app-title">{character?.full_name}</h1>
      {renderCharacter()}
      <FloatingButtons />
    </div>
  );
}
