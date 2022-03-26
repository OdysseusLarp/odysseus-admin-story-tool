import './App.css';
import { Tabs, Tab } from "react-bootstrap";
import Characters from "./components/Characters";
import Artifacts from "./components/Artifacts";
import Fleet from "./components/Fleet";
import Plots from "./components/Plots";
import Events from "./components/Events";
import React from "react";

function App() {
  const [key, setKey] = React.useState('Characters');


  return (
    <div className="App">
      <h1 className="Title">
        <span>Admin Story DB: </span><span className={`title-tab ${key}`}>{key}</span>
      </h1>
      <Tabs 
        id="tabs" 
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="Characters" title="Characters">
          <Characters/>
        </Tab>
        <Tab eventKey="Fleet" title="Fleet">
          <Fleet/>
        </Tab>
        <Tab eventKey="Artifacts" title="Artifacts">
          <Artifacts/>
        </Tab>
        <Tab eventKey="Plots" title="Plots">
          <Plots/>
        </Tab>
        <Tab eventKey="Events" title="Events">
          <Events/>
        </Tab>
      </Tabs>
    </div>
  );
}

export default App;
