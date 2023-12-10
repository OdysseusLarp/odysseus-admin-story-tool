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
import Messages from "./components/Messages";
import React from "react";

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
            <Events isActive={key === "Events"} />
          </div>
        </Tab>
        <Tab eventKey="Messages" title="Messages">
          <div style={style}>
            <Messages isActive={key === "Messages"} />
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
      </h1>
      {renderTable()}
      <Routes>
        <Route path="/fleet/:id" element={<Ship changeTab={changeTab} />} />
        <Route path="/characters/:id" element={<Character changeTab={changeTab} />} />
        <Route path="/artifacts/:id" element={<Artifact changeTab={changeTab} />} />
        <Route path="/plots/:id" element={<Plots changeTab={changeTab} />} />
        <Route path="/events/:id" element={<Events changeTab={changeTab} />} />
        <Route path="/messages/:id" element={<Messages changeTab={changeTab} />} />
        <Route path="*" element={<></>} />
      </Routes>
    </div>
  );
}

export default App;
