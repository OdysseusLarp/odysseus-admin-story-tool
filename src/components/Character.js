import React from "react";
import { useParams } from "react-router-dom";

const getCharacter = async (id) => {
    const response = await fetch(`http://localhost:8888/person/${id}`);
    const character = await response.json();
    return character;
  }

export default function Character() {
  const [character, setCharacter] = React.useState(null);
  const params = useParams();

  React.useEffect(() => {
    if (!params.id) return;

    getCharacter(params.id).then((s) => setCharacter(s));
  }, [params.id, setCharacter]);

  const renderCharacter = () => {
      if (!character) return null;
      return (
          <pre style={{ textAlign: "left" }}>
              {JSON.stringify(character, null, 2)}
          </pre>
      )
  }

  return (
    <div>
      <h1>{character?.full_name}</h1>
      {renderCharacter()}
    </div>
  );
}
