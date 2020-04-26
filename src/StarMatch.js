import React from 'react';
import logo from './logo.svg';
import './App.css';

const PlayNumber = (props) => (
    <button
        className="number"
        style={{backgroundColor: colors[props.status]}}
        onClick={() => props.onClick(props.buttonId, props.status)}
    >
        {props.buttonId}
        </button>
);

const StarsDisplay = (props) => (
    <>
        {utils.range(1, props.count).map((starId)=>
               <div key={starId} className="star"/>)
        }
   </>
);

const PlayAgain  = (props) => (
 <div className="game-done">
   <div
       className="message"
       style={{color: props.gameStatus === 'lost'? 'red': 'green'}}>
       {props.gameStatus === 'lost' ? 'Game Over': 'Nice'}
   </div>
   <button onClick={props.onClick}>Play Again!</button>
 </div>
);

const StarMatch = () => {
    const [gameId, setGameId] = React.useState(1);
    return <Game key={gameId} startNewGame={()=> setGameId(gameId+1)} />;
}

const Game = (props) => {
  const [stars, setStars] = React.useState(utils.random(1, 9));
  const [availableNums, setAvailableNums] = React.useState(utils.range(1, 9));
  const [candidateNums, setCandidateNums] = React.useState([]);
  const [secondsLeft, setSecondsLeft] = React.useState(10);

  const candidatesAreWrong = utils.sum(candidateNums) > stars;
  const gameStatus = (availableNums.length === 0) ? 'won' : (secondsLeft === 0) ? 'lost' : 'active';

    React.useEffect(() => {
        if (secondsLeft > 0 && availableNums.length > 0) {
            const timerId = setTimeout(() => {
                setSecondsLeft(secondsLeft - 1);
            }, 1000);
            return () => clearTimeout(timerId);
        }
    });

    const NumberStatus = (buttonId) => {
    if(!availableNums.includes(buttonId)){
        return 'used';
    }
    if(candidateNums.includes(buttonId)){
      return candidatesAreWrong ? 'wrong' : 'candidate';
    }
    return 'available';
  };

  const onNumberClick = (buttonId, currentStatus) => {
   //current status=> new status
      if(gameStatus !== 'active' || currentStatus === 'used'){
        return;
      }
      //candidateNums
      const newCandidateNums =
          currentStatus === "available"? candidateNums.concat(buttonId): candidateNums.filter(cn => cn !== buttonId);

      if(utils.sum(newCandidateNums) !== stars){ // wrong pick
        setCandidateNums(newCandidateNums);
      }else{   // correct pick
        const newAvailableNums = availableNums.filter(
            (n) => !newCandidateNums.includes(n)
        );
        // redraw the no of stars from what is available
          setStars(utils.randomSumIn(newAvailableNums, 9));
        setAvailableNums(newAvailableNums);
        setCandidateNums([]);
      }

  };

    return (
      <div className="game">
        <div className="help">
          Pick one or more numbers that sum to the stars.
        </div>
        <div className="body">
          <div className="left">
              {gameStatus !== 'active' ? (
                  <PlayAgain onClick={props.startNewGame} gameStatus={gameStatus}/>): (<StarsDisplay count={stars}/>)}
          </div>
          <div className="right">
              {utils.range(1, 9).map((buttonId)=>
                  <PlayNumber
                      key={buttonId}
                      buttonId={buttonId}
                      status={NumberStatus(buttonId)}
                      onClick={onNumberClick}
                  />
              )}
          </div>
        </div>
        <div className="timer">Time remaining: {secondsLeft}</div>
      </div>
  );
};

const colors = {
        available: 'lightgray',
        used: 'lightgreen',
        wrong: 'lightcoral',
        candidate: 'deepskyblue'
};

const utils = {

    //sum an array
    sum: arr => arr.reduce((total, num)=> total+num, 0),

    // create an array of numbers between min and max (edges included)
    range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

    // pick a random number between min and max (edges included)
    random: (min, max) => min + Math.floor(max * Math.random()),

    // Given an array of numbers and a max...
    // Pick a random sum (< max) from the set of all available sums in arr
    randomSumIn: (arr, max) => {
        const sets = [[]];
        const sums = [];
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0, len = sets.length; j < len; j++) {
                const candidateSet = sets[j].concat(arr[i]);
                const candidateSum = utils.sum(candidateSet);
                if (candidateSum <= max) {
                    sets.push(candidateSet);
                    sums.push(candidateSum);
                }
            }
        }
        return sums[utils.random(0, sums.length)];
    },
};

export default StarMatch;
