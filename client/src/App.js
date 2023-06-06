import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

// Screen 1 component
function LogIn({ onSubmit }) {
  // State for Game ID and Name inputs
  const [gameId, setGameId] = useState("");
  const [name, setName] = useState("");
  const apiUrl = "/api"

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const info = { gameId: gameId, name: name };
      await axios.post(apiUrl, {loginInfo: info});
      setGameId("");
      setName("");
      onSubmit(name);
      console.log("login to name " + name);
    } catch (error) {
      // Request was not successful
      console.error('An error occurred:', error);
    }
  }

  return (
    <div className="screen1">
      <h1>Player</h1>
      <div className="input-row">
        <label>Game ID: </label>
        <input
          type="text"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
        />
      </div>
      <div className="input-row">
        <label>Name: </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <button onClick={e => handleSubmit(e)}>Submit</button>
    </div>
  );
}


// Screen 2 component
function Lobby({ onAddPlayer, nameVal }) {
  const ratingUrl = "/api/rate/id";
  const apiUrl = "/api/queue/" + nameVal;
  const lobbyUrl = "/api/lobby/search/" + nameVal;

  const [players, setPlayers] = useState([]);

  async function increaseRating(player) {
    // try {
    //   const response = await axios.put(ratingUrl, {player: player, increase: true});
    //   const data = await response.data;
    //   console.log("inc resp " + data);
    //   setPlayers(data);
    // } catch (error) {
    //   // Request was not successful
    //   console.error('An error occurred:', error);
    // }
  }

  async function decreaseRating(player) {
    // try {
    //   const response = await axios.put(ratingUrl, {player: player, increase: false});
    //   const data = await response.data;
    //   console.log("dec resp " + data);
    //   setPlayers(data);
    // } catch (error) {
    //   // Request was not successful
    //   console.error('An error occurred:', error);
    // }
  }

   // Handle add player button click
  function handleAddPlayer() {
    onAddPlayer();
  }

  async function handleSearchPlayer() {
    console.log(players);
    try {
      const response = await axios.post(lobbyUrl, {players: players});
      const newPlayers = response.data;
      setPlayers(newPlayers);
    } catch (error) {
      // Request was not successful
      console.error('An error occurred:', error);
    } 
  }

  useEffect(() => {
    try {
      axios.get(apiUrl)
      .then(res => {
        const players = res.data;
        setPlayers(players);
        console.log(players);
        console.log(`component mounted`);
      });
    }catch(error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="Lobby">
      <h1>Lobby</h1>
      <table className="lobby-table">
        <thead>
          <tr>
            <th>Game ID</th>
            <th>Name</th>
            <th>Friendliness</th>
          </tr>
        </thead>
        <tbody>
          {
            players.map((player) => (
              <tr key={player._id}>
                <td>{player.gameId}</td>
                <td>{player.name}</td>
                <td>{player.friendliness}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <button onClick={handleAddPlayer}>Add Player</button>
      <button onClick={handleSearchPlayer}>Search Players</button>
    </div>
  );
}

function App() {
  // State for managing the current screen
  const [currentScreen, setCurrentScreen] = useState("LogIn");
  const [userName, setUserName] = useState("");

  // Handle screen change from LogIn to Lobby
  function handleScreenChange(name) {
    // wait for server response
    // Set the current screen to Lobby
    setCurrentScreen("Lobby");
    setUserName(name);
  }

  // Handle screen change from Lobby to LogIn
  function handleAddPlayer() {
    // Set the current screen to LogIn
    setCurrentScreen("LogIn");
  }

  return (
    <div className="app">
      {/* Render LogIn if the current screen is LogIn */}
      {currentScreen === "LogIn" && <LogIn onSubmit={handleScreenChange} />}

      {/* Render Lobby if the current screen is Lobby */}
      {currentScreen === "Lobby" && <Lobby onAddPlayer={handleAddPlayer} nameVal={userName} />}
    </div>
  );
}

export default App;