import React from "react";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Select from 'react-select'
import { Button, InputGroup } from "react-bootstrap";
import { apiGetRequest } from "../../api";
import { useNavigate } from "react-router-dom";
import { errorToast, successToast } from "../../utils/toaster";
import { upsertEvent } from "../../api/events";
import useSWR from "swr";
import { customStylesDark, customStylesLight } from "../../utils/helpers";

const DEFAULT_EVENT_STATE = {
  after_jump: null,
  artifacts: [],
  character_groups: '',
  description: '',
  dmx_event_num: '',
  gm_actions: 'No need',
  gm_note_npc: '',
  gm_notes: '',
  importance: 'Nice to have',
  locked: false,
  messages: [],
  name: '',
  npc_count: '0',
  npc_location: '',
  persons: [],
  plots: [],
  size: 'Small',
  status: 'Not Done',
  type: 'Character',
};

const CreateEditEventModal = (props) => {
  const { showModal, handleClose, onEditDone, eventToEdit } = props;
  const [event, setEvent] = React.useState(DEFAULT_EVENT_STATE);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedArtifacts, setSelectedArtifacts] = React.useState([]);
  const [selectedPersons, setSelectedPersons] = React.useState([]);
  const [selectedCharacterGroups, setSelectedCharacterGroups] = React.useState([]);
  const [selectedPlots, setSelectedPlots] = React.useState([]);
  const [selectedMessages, setSelectedMessages] = React.useState([]);
  const navigate = useNavigate();

  const swrCharacters = useSWR("/person?show_hidden=true&is_character=true", apiGetRequest);
  const swrNpcs = useSWR("/person?show_hidden=true&is_character=false", apiGetRequest);
  const swrEvents = useSWR("/story/events", apiGetRequest);
  const swrArtifacts = useSWR("/science/artifact", apiGetRequest);
  const swrPlots = useSWR("/story/plots", apiGetRequest);
  const swrMessages = useSWR("/story/messages", apiGetRequest);

  React.useEffect(() => {
    console.log("eventToEdit", eventToEdit);
    if (!eventToEdit) {
      return;
    }
    setEvent({
      ...eventToEdit,
      description: eventToEdit.description ? eventToEdit.description : '',
      gm_notes: eventToEdit.gm_notes ? eventToEdit.gm_notes : '',
      gm_note_npc: eventToEdit.gm_note_npc ? eventToEdit.gm_note_npc : '',
      npc_location: eventToEdit.npc_location ? eventToEdit.npc_location : '',
      dmx_event_num: eventToEdit.dmx_event_num ? eventToEdit.dmx_event_num : '',
    });
    if (eventToEdit.persons) {
      setSelectedPersons(
        eventToEdit.persons.map((person) => {
          return { value: person.id, label: person.name.concat(' - ', person.is_character ? 'Character' : 'NPC') };
        })
      );
    }
    if (eventToEdit.character_groups) {
      setSelectedCharacterGroups(
        eventToEdit.character_groups.split(', ').map((group) => {
          return { value: group, label: group };
        })
      );
    }
    if (eventToEdit.artifacts) {
      setSelectedArtifacts(
        eventToEdit.artifacts.map((artifact) => {
          return { value: artifact.id, label: artifact.catalog_id + ' - ' + artifact.name };
        })
      );
    }
    if (eventToEdit.plots) {
      setSelectedPlots(
        eventToEdit.plots.map((plot) => {
          return { value: plot.id, label: plot.name };
        })
      );
    }
    if (eventToEdit.messages) {
      setSelectedMessages(
        eventToEdit.messages.map((messages) => {
          return { value: messages.id, label: messages.name };
        })
      );
    }
  }, [eventToEdit]);

  const isLoading = swrCharacters.isLoading || swrNpcs.isLoading || swrArtifacts.isLoading || swrPlots.isLoading || swrMessages.isLoading;
  const isError = swrCharacters.error || swrNpcs.error || swrArtifacts.error || swrPlots.error || swrMessages.error;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Failed to load data</div>;

  const characters = [...swrCharacters.data.persons, ...swrNpcs.data.persons];
  const artifacts = swrArtifacts.data;
  const plots = swrPlots.data;
  const messages = swrMessages.data;
  const events = swrEvents.data;

  // Generic function to create options for select dropdowns
  const createOptions = (data, valueProperty, labelProperty) => data.map(item => {
    if (labelProperty === 'character_group') {
      return {
        value: item,
        label: item
      }
    }
    if ("catalog_id" in item && labelProperty === 'name') {
      return {
        value: item[valueProperty],
        label: item[labelProperty].concat(' - ', item['catalog_id'])
      }
    }
    if (labelProperty === 'full_name') {
      return {
        value: item[valueProperty],
        label: item[labelProperty].concat(' - ', item['is_character'] ? 'Character' : 'NPC')
      }
    }
    return {
      value: item[valueProperty],
      label: item[labelProperty]
    }
  }).sort((a, b) => a.label.localeCompare(b.label));

  const createFormSelectOptions = (data, valueProperty) => {
    const dataArray = [...new Set(data.map(item => item[valueProperty]))].sort().filter(item => item !== null);
    const dataOptions = dataArray.map(item =>
      <option key={item} value={item}>{item}</option>
    );
    return dataOptions;
  };

  const characterOptions = createOptions(characters, 'id', 'full_name');
  const artifactOptions = createOptions(artifacts, 'id', 'name');
  const plotOptions = createOptions(plots, 'id', 'name');
  const messageOptions = createOptions(messages, 'id', 'name');
  const characterGroupList = [...new Set(events.map(e => e.character_groups ? e.character_groups.split(', ') : []).flat(Infinity).sort())];
  const characterGroupOptions = createOptions(characterGroupList, 'character_group', 'character_group');

  const afterSubmit = (eventId) => {
    handleClose(false);
    setEvent(DEFAULT_EVENT_STATE);
    setSelectedArtifacts([]);
    setSelectedPersons([]);
    setSelectedPlots([]);
    setSelectedMessages([]);
    setSelectedCharacterGroups([]);
    setIsSubmitting(false);
    if (eventToEdit) {
      onEditDone();
    }
    else {
      navigate(`/events/${eventId}`);
    }
  };

  const handleSubmit = async () => {
    console.log("event", event);

    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    const data = {
      ...event,
      persons: selectedPersons?.map(persons => persons.value) ?? [],
      character_groups: selectedCharacterGroups?.map(group => group.value).join(', ') ?? null,
      artifacts: selectedArtifacts?.map(artifact => artifact.value) ?? [],
      dmx_event_num: event.dmx_event_num === '' ? null : parseInt(event.dmx_event_num),
      npc_count: parseInt(event.npc_count),
      npc_location: event.npc_location === '' ? null : event.npc_location,
      plots: selectedPlots?.map(plot => plot.value) ?? [],
      messages: selectedMessages?.map(message => message.value) ?? [],
    };
    console.log("data", data);
    const response = await upsertEvent(data);

    if (response.ok) {
      const data = await response.json();
      successToast(`Event ${eventToEdit ? 'updated' : 'created'} successfully`);
      afterSubmit(data.id);
    } else {
      console.error(`Got HTTP ${response.status} response:`, await response.text());
      setIsSubmitting(false);
      errorToast(`Failed to ${eventToEdit ? 'update' : 'create'} event`);
    }
  };

  const nameIsFilled = 'name' in event === true && event.name.trim() !== "";
  const npcCountIsInteger = /^-?\d+$/.test(event.npc_count) && event.npc_count !== '';
  const dmxEventNumIsValid = (/^-?\d+$/.test(event.dmx_event_num) && event.dmx_event_num > 0) || event.dmx_event_num === '';

  return (
    <Modal
      onClose={handleClose}
      onHide={handleClose}
      show={showModal}
      animation={false}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Create New Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name: (*)</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                autoComplete="off"
                value={event?.name}
                isValid={nameIsFilled}
                isInvalid={!nameIsFilled}
                onChange={(evt) => {
                  setEvent({ ...event, name: evt.target.value });
                }}
                autoFocus
                required
              />
              <Form.Control.Feedback type="invalid">
                Please give name
              </Form.Control.Feedback>
            </InputGroup>
            <Form.Label>Character groups involved:</Form.Label>
            <Select
              value={selectedCharacterGroups}
              onChange={setSelectedCharacterGroups}
              isMulti
              isClearable={true}
              isSearchable={true}
              options={characterGroupOptions}
              styles={document.querySelector('html').getAttribute("data-bs-theme") === "dark" ? customStylesDark : customStylesLight}
            />
            <Form.Label>Characters Involved:</Form.Label>
            <Select
              value={selectedPersons}
              onChange={setSelectedPersons}
              isMulti
              isClearable={true}
              isSearchable={true}
              options={characterOptions}
              styles={document.querySelector('html').getAttribute("data-bs-theme") === "dark" ? customStylesDark : customStylesLight}
            />
            <Form.Label>Artifacts:</Form.Label>
            <Select
              value={selectedArtifacts}
              onChange={setSelectedArtifacts}
              isMulti
              isClearable={true}
              isSearchable={true}
              options={artifactOptions}
              styles={document.querySelector('html').getAttribute("data-bs-theme") === "dark" ? customStylesDark : customStylesLight}
            />
            <Form.Label>Plots:</Form.Label>
            <Select
              value={selectedPlots}
              onChange={setSelectedPlots}
              isMulti
              isClearable={true}
              isSearchable={true}
              options={plotOptions}
              styles={document.querySelector('html').getAttribute("data-bs-theme") === "dark" ? customStylesDark : customStylesLight}
            />
            <Form.Label>Messages:</Form.Label>
            <Select
              value={selectedMessages}
              onChange={setSelectedMessages}
              isMulti
              isClearable={true}
              isSearchable={true}
              options={messageOptions}
              styles={document.querySelector('html').getAttribute("data-bs-theme") === "dark" ? customStylesDark : customStylesLight}
            />
            <Form.Label>Size:</Form.Label>
            <Form.Select
              value={event?.size}
              styles={{ zIndex: 0 }}
              onChange={(evt) => {
                setEvent({ ...event, size: evt.target.value });
              }}>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </Form.Select>
            <Form.Label>Importance:</Form.Label>
            <Form.Select
              value={event?.importance}
              styles={{ zIndex: 0 }}
              onChange={(evt) => {
                setEvent({ ...event, importance: evt.target.value });
              }}>
              <option value="Nice to have">Nice to have</option>
              <option value="Should have">Should have</option>
              <option value="Mandatory">Mandatory</option>
            </Form.Select>
            <Form.Label>Type:</Form.Label>
            <Form.Select
              value={event?.type}
              styles={{ zIndex: 0 }}
              onChange={(evt) => {
                setEvent({ ...event, type: evt.target.value });
              }}>
              {createFormSelectOptions(events, "type")}
            </Form.Select>
            <Form.Label>Happens after jump:</Form.Label>
            <Form.Select
              disabled={event?.locked}
              value={event?.after_jump ?? ""}
              onChange={(evt) => {
                const value = evt.target.value === "" ? null : parseInt(evt.target.value);
                setEvent({ ...event, after_jump: value });
              }}>
              <option value="">Not defined</option>
              {Array.from(Array(19).keys()).map(item =>
                <option key={item} value={item}>{item}</option>
              )}
            </Form.Select>
            <Form.Label>Message send time locked:</Form.Label>
            <Form.Select
              value={event?.locked}
              onChange={(evt) => {
                const locked = (evt.target.value === 'true') ? true : false;
                setEvent({ ...event, locked: locked });
              }}>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </Form.Select>
            <Form.Label>DMX Event Num:</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                value={event?.dmx_event_num}
                onChange={(evt) => {
                  setEvent({ ...event, dmx_event_num: evt.target.value });
                }}
                placeholder="Enter an integer > 0 or leave empty"
                required
                isValid={dmxEventNumIsValid}
                isInvalid={!dmxEventNumIsValid}
              />
              <Form.Control.Feedback type="invalid">
                Please enter an integer {">"} 0 or leave empty.
              </Form.Control.Feedback>
            </InputGroup>
            <Form.Label>Status:</Form.Label>
            <Form.Select
              value={event?.status}
              styles={{ zIndex: 0 }}
              onChange={(evt) => {
                setEvent({ ...event, status: evt.target.value });
              }}>
              <option value="Not Done">Not Done</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </Form.Select>
          </Form.Group>
          <Form.Group
            className="mb-3"
            controlId="description"
          >
            <Form.Label>Description:</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              autoComplete="off"
              value={event?.description ?? ""}
              onChange={(evt) => {
                setEvent({ ...event, description: evt.target.value });
              }}
            />
            <Form.Label>GM Notes:</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              autoComplete="off"
              value={event?.gm_notes ?? ""}
              onChange={(evt) => {
                setEvent({ ...event, gm_notes: evt.target.value });
              }}
            />
          </Form.Group>
          <Form.Group
            className="mb-3"
            controlId="npcs"
          >
            <Form.Label>GM actions:</Form.Label>
            <Form.Select
              value={event?.gm_actions}
              styles={{ zIndex: 0 }}
              onChange={(evt) => {
                setEvent({ ...event, gm_actions: evt.target.value });
              }}>
              {createFormSelectOptions(events, "gm_actions")}
            </Form.Select>
            <Form.Label>NPC location:</Form.Label>
            <Form.Select
              value={event?.npc_location}
              styles={{ zIndex: 0 }}
              disabled={event?.gm_actions === "No need"}
              onChange={(evt) => {
                setEvent({
                  ...event,
                  npc_location: evt.target.value,
                  npc_count: evt.target.value === "" ? 0 : event.npc_count
                });
              }}>
              <option value="">No NPCs needed</option>
              {createFormSelectOptions(events, "npc_location")}
            </Form.Select>
            <Form.Label>NPC count:</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                value={event?.npc_count}
                disabled={event?.npc_location === null}
                onChange={(evt) => {
                  console.log("event", evt);
                  setEvent({ ...event, npc_count: evt.target.value });
                }}
                placeholder="Enter an integer"
                required
                isValid={npcCountIsInteger}
                isInvalid={!npcCountIsInteger}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid integer.
              </Form.Control.Feedback>
            </InputGroup>
            <Form.Label>GM Notes for NPCs:</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              autoComplete="off"
              value={event?.gm_note_npc ?? ""}
              onChange={(evt) => {
                setEvent({ ...event, gm_note_npc: evt.target.value });
              }}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} type="button">
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit} type="button">
          {eventToEdit ? "Save message" : "Create message"}
        </Button>
      </Modal.Footer>
    </Modal>
  )
};

export default CreateEditEventModal;