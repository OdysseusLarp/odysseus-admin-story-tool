import "./App.css";
import { Tabs, Tab } from "react-bootstrap";
import Characters from "./components/Characters";
import Artifacts from "./components/Artifacts";
import Fleet from "./components/Fleet";
import Plots from "./components/Plots";
import Events from "./components/Events";
import Ship from "./components/Ship";
import Character from "./components/Character";
import React from "react";

import { useLocation, useNavigate, Routes, Route } from "react-router-dom";

const TabKeys = {
  Characters: "Characters",
  Fleet: "Fleet",
  Artifacts: "Artifacts",
  Plots: "Plots",
  Events: "Events",
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
  }, []);
  
  const shouldRenderTable =
    tableRoutes.includes(location.pathname) || location.pathname === "/";

  const onSelectTab = (k) => {
    setKey(k);

    const path = k.toLowerCase();
    navigate(path);
  };

  const renderTable = () => {
    const style = shouldRenderTable ? {} : { display: "none" };
    return (
      <Tabs id="tabs" activeKey={key} onSelect={onSelectTab} className="mb-3">
        <Tab eventKey="Characters" title="Characters">
          <div style={style}>
            <Characters changeTab={onSelectTab} />
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
        <Route path="/fleet/:id" element={<Ship changeTab={onSelectTab} />} />
        <Route path="/characters/:id" element={<Character />} />
        <Route path="*" element={<></>} />
      </Routes>
    </div>
  );
}

export default App;
