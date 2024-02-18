import "./App.css";
import { Tabs, Tab } from "react-bootstrap";
import Characters from "./components/Characters";
import Artifacts from "./components/Artifacts";
import Fleet from "./components/Fleet";
import Plots from "./components/Plots";
import Events from "./components/Events";
import Ship from "./components/Ship";
import Character from "./components/Character";
import Artifact from "./components/Artifact";
import Plot from "./components/Plot";
import Event from "./components/Event";
import Messages from "./components/Messages";
import Message from "./components/Message";
import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { LuMailPlus, LuCalendarPlus } from "react-icons/lu";
import { TbMessagePlus } from "react-icons/tb";
import CreateNewMessageModal from "./components/modals/CreateNewMessageModal";

import { useLocation, useNavigate, Routes, Route } from "react-router-dom";

const TabKeys = {
  Characters: "Characters",
  Fleet: "Fleet",
  Artifacts: "Artifacts",
  Plots: "Plots",
  Events: "Events",
  Messages: "Messages",
};

const tableRoutes = Object.keys(TabKeys).map((k) => "/" + k.toLowerCase());

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function App() {
  const [key, setKey] = React.useState(null);
  const [showMessageNew, setShowMessageNew] = React.useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    setKey(capitalizeFirstLetter(location.pathname.split('/')[1]));
    if (location.pathname === '/') {
      navigate("/characters")
    }
  }, [location.pathname, navigate]);
  
  const shouldRenderTable =
    tableRoutes.includes(location.pathname) || location.pathname === "/";

  const onSelectTab = (k) => {
    setKey(k);

    const path = k.toLowerCase();
    navigate(path);
  };

  const changeTab = (k) => {
    setKey(k);
  };

  const renderTable = () => {
    const style = shouldRenderTable ? {} : { display: "none" };
    return (
      <Tabs id="tabs" activeKey={key} onSelect={onSelectTab} className="mb-3">
        <Tab eventKey="Characters" title="Characters">
          <div style={style}>
            <Characters changeTab={changeTab} />
          </div>
        </Tab>
        <Tab eventKey="Fleet" title="Fleet">
          <div style={style}>
            <Fleet />
          </div>
        </Tab>
        <Tab eventKey="Artifacts" title="Artifacts">
          <div style={style}>
            <Artifacts />
          </div>
        </Tab>
        <Tab eventKey="Plots" title="Plots">
          <div style={style}>
            <Plots />
          </div>
        </Tab>
        <Tab eventKey="Events" title="Events">
          <div style={style}>
            <Events />
          </div>
        </Tab>
        <Tab eventKey="Messages" title="Messages">
          <div style={style}>
            <Messages />
          </div>
        </Tab>
      </Tabs>
    );
  };

  return (
    <div className="App">
      <h1 className="Title">
        <span>Admin Story DB: </span>
        <span className={`title-tab ${key}`}>{key}</span>
        <ButtonGroup>
          <Button className="float-char-btn" title="Create New Plot" variant="outline-secondary" onClick={null}><TbMessagePlus className="plot-button" size="35px"/></Button>
          <Button className="float-char-btn" title="Create New Event" variant="outline-secondary" onClick={null}><LuCalendarPlus className="event-button" size="35px"/></Button>
          <Button className="float-char-btn" title="Create New Message" variant="outline-secondary" onClick={() => setShowMessageNew(true)}><LuMailPlus className="message-button" size="35px"/></Button>
        </ButtonGroup>
      </h1>
      <CreateNewMessageModal
          showMessageNew={showMessageNew}
          handleClose={() => setShowMessageNew(false)}
        />
      {renderTable()}
      <Routes>
        <Route path="/fleet/:id" element={<Ship changeTab={changeTab} />} />
        <Route path="/characters/:id" element={<Character changeTab={changeTab} />} />
        <Route path="/artifacts/:id" element={<Artifact changeTab={changeTab} />} />
        <Route path="/plots/:id" element={<Plot changeTab={changeTab} />} />
        <Route path="/events/:id" element={<Event changeTab={changeTab} />} />
        <Route path="/messages/:id" element={<Message changeTab={changeTab} />} />
        <Route path="*" element={<></>} />
      </Routes>
    </div>
  );
}

export default App;
