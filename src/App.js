import React, { useState } from "react";
import useSWR, { SWRConfig } from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function App() {
  return (
    <SWRConfig value={{ revalidateOnFocus: false, fetcher }}>
      <Character />
    </SWRConfig>
  );
}

function Character() {
  const url = "https://www.breakingbadapi.com/api/characters/";
  //we can pass path , url or graphql query.
  const { data, error } = useSWR(url);

  if (error) {
    return <div>Error..</div>;
  }

  if (!data) {
    return <div>Loading..</div>;
  }

  return (
    <DisplayCharacter
      character={data}
      names={[...new Set(data.map((value) => value.name))]}
    />
  );
}

function DisplayCharacter({ character, names }) {
  const [filterName, setFilterName] = useState(null);
  const filteredCharacters = filterName
    ? character.filter((ch) => ch.name === filterName)
    : character;

  return (
    <>
      {names.map((name) => (
        <button onClick={() => setFilterName(name)} key={name}>
          {name}
        </button>
      ))}
      {filterName && (
        <button
          onClick={() => {
            setFilterName(null);
          }}
        >
          reset
        </button>
      )}
      <pre>{JSON.stringify(filteredCharacters, null, 5)}</pre>
    </>
  );
}

// It will show us the cached version of data if it has there it
// and then it the background we'll go and fetch the new version
// and it will replace that once it gets it.

// detects transitions between tabs
