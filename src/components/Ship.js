import React from "react";
import { useParams } from "react-router-dom";

const getShip = async (id) => {
    const response = await fetch(`http://localhost:8888/fleet/${id}`);
    const ship = await response.json();
    return ship;
  }

export default function Ship() {
  const [ship, setShip] = React.useState(null);
  const params = useParams();

  React.useEffect(() => {
    if (!params.id) return;

    getShip(params.id).then((s) => setShip(s));
  }, [params.id, setShip]);

  const renderShip = () => {
      if (!ship) return null;
      return (
          <pre style={{ textAlign: "left" }}>
              {JSON.stringify(ship, null, 2)}
          </pre>
      )
  }

  return (
    <div>
      <h1>{ship?.name}</h1>
      {renderShip()}
    </div>
  );
}
