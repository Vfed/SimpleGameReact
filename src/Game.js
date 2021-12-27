import React from "react";
import {axios} from "axios";

const url = "http://localhost:5000/user";

//let cons = Constansts();
class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            board: Array(9).fill(null),
            player: "Player1",
        }
        this.handleBlockClick = this.handleBlockClick.bind(this);
        this.handleRestartClick = this.handleRestartClick.bind(this);
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
    }
  
    

    checkWinner(board){
        const winArr = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8], [0,4,8],[2,4,6]];
        for(let i=0;i < winArr.length;i++ ){
            const [a,b,c] = winArr[i];
            if(board[a] && board[a] === board[b] && board[a] === board[c]){
                console.log([a,b,c]);
                return board[a];
            }
        }
        return null;
    }
    
    handleSubmitClick(){
        fetch("https://localhost:5001/user",
        {
            method: "GET",
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json"
            }
          })
          
          //.then((result) => result.json())
      .then(
        (result) => {
          console.log(result);
        },
        (error) => {
          console.log(error);
        },
      )
      fetch("https://localhost:5001/user/arr",
        {
            method: "GET",
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json"
            }
          })
          .then((result) => result.json())
      .then(
        (result) => {
          console.log(result);
        },
        (error) => {
          console.log(error);
        },
      )
    }

    handleBlockClick(i){
        const arr = this.state.board.slice();
        if(!arr[i] && !this.checkWinner(this.state.board)){
            arr[i] = this.state.player;
            this.setState(state => ({board : arr}) );
            if(!this.checkWinner(arr)){
                this.setState(state => ({player : this.state.player === "Player1" ? "Player2": "Player1"}));
            }
        }
    }

    handleRestartClick(i){
        this.setState(state => ({board : Array(9).fill(null), player : "Player1"}));
    }
    
    Block(i){
        let imgUrl1 ="./img/x.png";
        let imgUrl2 ="./img/0+.png";
        let divStyle;
        switch(this.state.board[i]){
            case "Player1":
                divStyle = { backgroundImage:  `url(${imgUrl1})`,};
                break;
            case "Player2":
                divStyle = { backgroundImage: `url(${imgUrl2})`,};
                break;
        }
        return(
            <div style={divStyle} className="game-block" 
            onClick={() => this.handleBlockClick(i)}></div>
        )
    }

    UserBlock(userName){
        let imgUrl = (userName === "Player1") ? "./img/x.png" : "./img/0+.png";
        return(
            <div className="player-figure-block">
                <div style={{backgroundImage: `url(${imgUrl})`, backgroundSize: '95% 95%'}} className="user-block"></div>
                <div  className="user-text-block"></div>
                <div style={{backgroundImage: `url(${imgUrl})`, backgroundSize: '50% 50%'}} className="user-block"></div>
                <div  className="user-text-block"></div>
                <div style={{backgroundImage: `url(${imgUrl})`, backgroundSize: '20% 20%'}} className="user-block"></div>
                <div  className="user-text-block"></div>
            </div>
        );
    }

    render(){
        const win = this.checkWinner(this.state.board);
        const status = (win) ? `${this.state.player} Wins !!!` : `${this.state.player} Move`;
        const restartShow = (win) ? {display : "block"}:{display : "none"};
        return(
            <div className="game">
                <div className="Title"><h1>{status}</h1>
                </div>
                {/*this.UserBlock("Player1")*/
                }
                <div className="board">
                    {Array.from(Array(9).keys()).map((key,item) => this.Block(item))}
                </div>
                {/*this.UserBlock("Player2")*/}
                <div className="restart" style={restartShow} onClick={this.handleRestartClick}><h1>Restart</h1>
                </div>
                {/* <button type="button" onClick={this.handleSubmitClick}>Отправить</button> */}
            </div>
        );
    }
}

export default Game;
