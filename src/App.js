import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { nanoid } from "nanoid";
import "./App.css";
import Die from "./components/Die";

function App() {
  const [dices, setDices] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);

  const [time, setTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  
  useEffect(() => {
    let interval = null;
    if(!tenzies) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      setTotalTime(time);
      setTime(0);
    }
    
    return () => {
      clearInterval(interval);
    };
  }, [tenzies]);

  useEffect(() => {
    const allHeld = dices.every((die) => die.isHeld);
    const firstValue = dices[0].value;
    const allSameValue = dices.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
    }
  }, [dices]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 2; i++) {
      newDice.push(generateNewDie()); 
    }
    return newDice;
  }

  const rollDice = () => {
    if (tenzies) {
      setTenzies(false);
      setDices(allNewDice());
    } else {
      setDices((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld === true ? die : generateNewDie();
        })
      );
    }
  };

  const holdDice = (id) => {
    setDices((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  };

  const diceElements = dices.map((dice) => {
    return (
      <Die
        key={dice.id}
        id={dice.id}
        value={dice.value}
        isHeld={dice.isHeld}
        holdDice={holdDice}
      />
    );
  });

  return (
    <main>
      <h1 className="title">Tenzies</h1>
      <div>Time: {tenzies ? totalTime : time} second(s)</div>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <button className="roll-dice" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
      {tenzies && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}
    </main>
  );
}

export default App;
