import React from "react";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Select from 'react-select'
import { Button, InputGroup } from "react-bootstrap";
import { apiGetRequest } from "../../api";
import { useNavigate } from "react-router-dom";
import { errorToast, successToast } from "../../utils/toaster";
import { upsertPlot } from "../../api/plots";
import useSWR from "swr";
import { customStylesDark, customStylesLight } from "../../utils/helpers";

const DEFAULT_PLOT_STATE = {
  after_jump: null,
  artifacts: [],
  character_groups: '',
  copy_from_characters: '',
  description: '',
  events: [],
  gm_actions: 'No need',
  gm_notes: '',
  importance: 'Nice to have',
  locked: false,
  messages: [],
  name: '',
  persons: [],
  size: 'Small',
  text_npc_first_message: false,
  themes: '',
};

const CreateEditPlotModal = (props) => {
  const { showModal, handleClose, onEditDone, plotToEdit } = props;
  const [plot, setPlot] = React.useState(DEFAULT_PLOT_STATE);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedArtifacts, setSelectedArtifacts] = React.useState([]);
  const [selectedEvents, setSelectedEvents] = React.useState([]);
  const [selectedMessages, setSelectedMessages] = React.useState([]);
  const [selectedPersons, setSelectedPersons] = React.useState([]);
  const [selectedCharacterGroups, setSelectedCharacterGroups] = React.useState([]);
  const [selectedThemes, setSelectedThemes] = React.useState([]);

  const navigate = useNavigate();

  const swrCharacters = useSWR("/person?show_hidden=true&is_character=true", apiGetRequest);
  const swrNpcs = useSWR("/person?show_hidden=true&is_character=false", apiGetRequest);
  const swrEvents = useSWR("/story/events", apiGetRequest);
  const swrArtifacts = useSWR("/science/artifact", apiGetRequest);
  const swrPlots = useSWR("/story/plots", apiGetRequest);
  const swrMessages = useSWR("/story/messages", apiGetRequest);

  React.useEffect(() => {
    if (!plotToEdit) {
      return;
    }
    setPlot({
      ...plotToEdit,
      description: plotToEdit.description ? plotToEdit.description : '',
      gm_notes: plotToEdit.gm_notes ? plotToEdit.gm_notes : '',
      copy_from_characters: plotToEdit.copy_from_characters ? plotToEdit.gm_note_npc : '',
    });
    if (plotToEdit.persons) {
      setSelectedPersons(
        plotToEdit.persons.map((person) => {
          return { value: person.id, label: person.name.concat(' - ', person.is_character ? 'Character' : 'NPC') };
        })
      );
    }
    if (plotToEdit.character_groups) {
      setSelectedCharacterGroups(
        plotToEdit.character_groups.split(', ').map((group) => {
          return { value: group, label: group };
        })
      );
    }
    if (plotToEdit.themes) {
      setSelectedThemes(
        plotToEdit.themes.split(', ').map((theme) => {
          return { value: theme, label: theme };
        })
      );
    }
    if (plotToEdit.artifacts) {
      setSelectedArtifacts(
        plotToEdit.artifacts.map((artifact) => {
          return { value: artifact.id, label: artifact.catalog_id + ' - ' + artifact.name };
        })
      );
    }
    if (plotToEdit.events) {
      setSelectedEvents(
        plotToEdit.events.map((event) => {
          return { value: event.id, label: event.name };
        })
      );
    }
    if (plotToEdit.messages) {
      setSelectedMessages(
        plotToEdit.messages.map((messages) => {
          return { value: messages.id, label: messages.name };
        })
      );
    }
  }, [plotToEdit]);

  const isLoading = swrCharacters.isLoading || swrNpcs.isLoading || swrArtifacts.isLoading || swrPlots.isLoading || swrMessages.isLoading || swrEvents.isLoading;
  const isError = swrCharacters.error || swrNpcs.error || swrArtifacts.error || swrPlots.error || swrMessages.error || swrEvents.error;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Failed to load data</div>;

  const characters = [...swrCharacters.data.persons, ...swrNpcs.data.persons];
  const artifacts = swrArtifacts.data;
  const plots = swrPlots.data;
  const messages = swrMessages.data;
  const events = swrEvents.data;

  // Generic function to create options for select dropdowns
  const createOptions = (data, valueProperty, labelProperty) => data.map(item => {
    if (labelProperty === 'character_groups') {
      return {
        value: item,
        label: item
      }
    }
    if (labelProperty === 'themes') {
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
  const eventOptions = createOptions(events, 'id', 'name');
  const messageOptions = createOptions(messages, 'id', 'name');

  const characterGroupListEvents = [...new Set(events.map(e => e.character_groups ? e.character_groups.split(', ') : []).flat(Infinity).sort())];
  const characterGroupListPlots = [...new Set(plots.map(e => e.character_groups ? e.character_groups.split(', ') : []).flat(Infinity).sort())];
  const characterGroupList = [...new Set(characterGroupListEvents.concat(characterGroupListPlots))].sort();
  const characterGroupOptions = createOptions(characterGroupList, 'character_groups', 'character_groups');

  const themeListPlots = [...new Set(plots.map(e => e.themes ? e.themes.split(', ') : []).flat(Infinity).sort())];
  const themeOptions = createOptions(themeListPlots, 'themes', 'themes');

  const afterSubmit = (plotId) => {
    handleClose(false);
    setPlot(DEFAULT_PLOT_STATE);
    setSelectedArtifacts([]);
    setSelectedPersons([]);
    setSelectedEvents([]);
    setSelectedMessages([]);
    setSelectedCharacterGroups([]);
    setSelectedThemes([]);
    setIsSubmitting(false);
    if (plotToEdit) {
      onEditDone();
    }
    else {
      navigate(`/plots/${plotId}`);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    const data = {
      ...plot,
      persons: selectedPersons?.map(persons => persons.value) ?? [],
      character_groups: selectedCharacterGroups?.map(group => group.value).join(', ') ?? null,
      themes: selectedThemes?.map(theme => theme.value).join(', ') ?? null,
      artifacts: selectedArtifacts?.map(artifact => artifact.value) ?? [],
      events: selectedEvents?.map(event => event.value) ?? [],
      messages: selectedMessages?.map(message => message.value) ?? [],
    };

    const response = await upsertPlot(data);

    if (response.ok) {
      const data = await response.json();
      successToast(`Plot ${plotToEdit ? 'updated' : 'created'} successfully`);
      afterSubmit(data.id);
    } else {
      console.error(`Got HTTP ${response.status} response:`, await response.text());
      setIsSubmitting(false);
      errorToast(`Failed to ${plotToEdit ? 'update' : 'create'} plot`);
    }
  };

  const nameIsFilled = 'name' in plot === true && plot.name.trim() !== "";

  return (
    <Modal
      onClose={handleClose}
      onHide={handleClose}
      show={showModal}
      animation={false}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>{plotToEdit ? "Edit" : "Create New"} Plot</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name: (*)</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                autoComplete="off"
                value={plot?.name}
                isValid={nameIsFilled}
                isInvalid={!nameIsFilled}
                onChange={(evt) => {
                  setPlot({ ...plot, name: evt.target.value });
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
            <Form.Label>Events:</Form.Label>
            <Select
              value={selectedEvents}
              onChange={setSelectedEvents}
              isMulti
              isClearable={true}
              isSearchable={true}
              options={eventOptions}
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
              value={plot?.size}
              styles={{ zIndex: 0 }}
              onChange={(evt) => {
                setPlot({ ...plot, size: evt.target.value });
              }}>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </Form.Select>
            <Form.Label>Importance:</Form.Label>
            <Form.Select
              value={plot?.importance}
              styles={{ zIndex: 0 }}
              onChange={(evt) => {
                setPlot({ ...plot, importance: evt.target.value });
              }}>
              <option value="Nice to have">Nice to have</option>
              <option value="Should have">Should have</option>
              <option value="Mandatory">Mandatory</option>
            </Form.Select>
            <Form.Label>Themes:</Form.Label>
            <Select
              value={selectedThemes}
              onChange={setSelectedThemes}
              isMulti
              isClearable={true}
              isSearchable={true}
              options={themeOptions}
              styles={document.querySelector('html').getAttribute("data-bs-theme") === "dark" ? customStylesDark : customStylesLight}
            />
            <Form.Label>GM actions:</Form.Label>
            <Form.Select
              value={plot?.gm_actions}
              styles={{ zIndex: 0 }}
              onChange={(evt) => {
                setPlot({ ...plot, gm_actions: evt.target.value });
              }}>
              {createFormSelectOptions(plots, "gm_actions")}
            </Form.Select>
            <Form.Label>Text NPC should start?</Form.Label>
            <Form.Select
              value={plot?.text_npc_first_message}
              styles={{ zIndex: 0 }}
              onChange={(evt) => {
                const value = (evt.target.value === 'true') ? true : false;
                setPlot({ ...plot, text_npc_first_message: value });
              }}>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </Form.Select>
            <Form.Label>Happens after jump:</Form.Label>
            <Form.Select
              disabled={plot?.locked}
              value={plot?.after_jump ?? ""}
              onChange={(evt) => {
                const value = evt.target.value === "" ? null : parseInt(evt.target.value);
                setPlot({ ...plot, after_jump: value });
              }}>
              <option value="">Not defined</option>
              {Array.from(Array(19).keys()).map(item =>
                <option key={item} value={item}>{item}</option>
              )}
            </Form.Select>
            <Form.Label>Plot time locked:</Form.Label>
            <Form.Select
              value={plot?.locked}
              onChange={(evt) => {
                const locked = (evt.target.value === 'true') ? true : false;
                setPlot({ ...plot, locked: locked });
              }}>
              <option value="true">Yes</option>
              <option value="false">No</option>
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
              value={plot?.description ?? ""}
              onChange={(evt) => {
                setPlot({ ...plot, description: evt.target.value });
              }}
            />
            <Form.Label>GM Notes:</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              autoComplete="off"
              value={plot?.gm_notes ?? ""}
              onChange={(evt) => {
                setPlot({ ...plot, gm_notes: evt.target.value });
              }}
            />
            <Form.Label>Copied from characters:</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              autoComplete="off"
              value={plot?.copy_from_characters ?? ""}
              onChange={(evt) => {
                setPlot({ ...plot, copy_from_characters: evt.target.value });
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
          {plotToEdit ? "Save plot" : "Create plot"}
        </Button>
      </Modal.Footer>
    </Modal>
  )
};

export default CreateEditPlotModal;