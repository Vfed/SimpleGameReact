import React from "react";
import { instanceOf } from 'prop-types';
import { withCookies, Cookies, useCookies } from 'react-cookie';
import axios from "axios";
import { Navigate } from "react-router-dom";

const url = 'https://localhost:5001';
interface IProps{
}
interface IGameSession{
    id: number,
    Users?: any,
    currentPlayer: any,
    gameStatus:string,
    dateTime: Date,
    field: String[][],
}
interface IState { 
    Id: number,   
    Player1: string,
    Player2: string,
    Field: String[][],
    //dto?: IGameSession,
    restart: boolean,
    currentPlayer: string
    status : string ,
    redirect: boolean
}
interface UserSessionDto {
    Player1?: string,
    Player2?: string,
}
interface SessionIdDto {
    Id: number,
}
interface GameSessionDoActionDto
    {
        Id: number,
        UserName: string,
        PointX: number,
        PointY: number,
    }
interface RestartGameDto
{
    Id?: number, 
    UserName?: string,
}


class GameField extends React.Component<IProps,IState>{
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    
    constructor(props: any){
        super(props);
        const {cookies} : any = props;
        
        this.state ={
            Id: cookies.get('sessionId'),
            Player1: cookies.get('name'),
            Player2: cookies.get('opponent'),
            Field: Array(3).fill(Array(3).fill("")),
            restart: false,
            currentPlayer: "",
            status: "",
            redirect: false,
        }
        this.loadField();
        
        let Updatetimer = setInterval(() => this.loadField(), 3000);
        
        this.handleGoToMenu = this.handleGoToMenu.bind(this);
        this.handleRestartClick = this.handleRestartClick.bind(this);
        this.handleBlockClick = this.handleBlockClick.bind(this);
    }

    //START Handle event

    async handleBlockClick(i:number,j:number){
        
        let item: GameSessionDoActionDto = {
            Id : this.state.Id,
            UserName : this.state.Player1,
            PointX: i,
            PointY: j, 
        }
        await axios.post(`${url}/api/games/do`,item).then(resp => {
            console.log(resp);
            if(resp.status === 200 )
            {
                console.log(resp);
                if(resp.data !== null )
                {
                    this.loadField();
                }
            }
        })
    }

    async handleRestartClick(){
        console.log('restart');
        let item:RestartGameDto ={ Id: this.state.Id, UserName: this.state.Player1}
        await axios.post(`${url}/api/games/restart`,item).then(
            resp => {
                console.log(resp);
                if(resp.status == 200){
                    this.loadField();        
                }
            }
        )
    }

    handleGoToMenu(){
        this.setState({redirect: true}); 
        return;
    }

    //END Handle event

    //START Extra functions

    async loadField(){
        const dto : SessionIdDto = {Id: this.state.Id};
        let game: IGameSession = await axios.post(`${url}/api/games/getsessionbyid`, dto)
        .then(resp => {
            if(resp.status === 200)
            {
                return resp.data;
            }
            else{
                return null;
            }})
        console.log(game);
        if(game !== null ){
            this.setState({
                Field : game.field,
                currentPlayer: game.currentPlayer.name,
                status: game.gameStatus,
            });
        }
        console.log(this.state.Field);
    }
    
    //END Extra functions

    //START Show elements

    Block(i:number,j:number){
        let imgUrl1 ="/img/x.png";
        let imgUrl2 ="/img/0+.png";
        let divStyle;
        switch(this.state.Field[i][j]){
            case this.state.Player1:
                divStyle = { backgroundImage: `url(${imgUrl1})`,};
                break;
            case this.state.Player2:
                divStyle = { backgroundImage: `url(${imgUrl2})`,};
                break;
        }
        return(
            <div style={divStyle} className="game-block" onClick={() => this.handleBlockClick(i,j)}></div>
        )
    }

    ShowCurrentPlayer(){
        switch (this.state.status) {
            case "Active":
                return(<h1>Player <i>{this.state.currentPlayer}</i> Action</h1>)
                break;
            case "Complite":
                return(<h1>Player {this.state.currentPlayer} - Wins</h1>)
                    break;
            case "NoAction":
                return(<h1>No More Action</h1>)
                break;
            default:
                break;
        }
    }
    ShowRedirectToMenu(){
        if(this.state.redirect){
            return(<Navigate to="/menu" />);}
    }
    
    //END Show elements

    render() {
        let end = false;
        if(this.state.status == "Complite" || this.state.status == "NoAction"){
            end = true;
        } 
        //const win = this.checkWinner(this.state.board);
        //const status = (win) ? `${this.state.player} Wins !!!` : `${this.state.player} Move`;
        const restartShow = (end) ? {display : "block"}:{display : "none"};
        console.log(this.state);
        return(
            <div className="game">
                {this.ShowRedirectToMenu()}
                User: {this.state.Player1}<br/>
                Opponent player: {this.state.Player2}<br />
                <button onClick={() => this.handleGoToMenu()} >Back to Menu</button>
                <div className="Title">{this.ShowCurrentPlayer()}
                </div>
                {/*this.UserBlock("Player1")*/
                }
                <div className="board">
                    {Array.from(Array(3).keys()).map((key1) => 
                    Array.from(Array(3).keys()).map((key2) => this.Block(key1,key2)))}
                </div>
                {/*this.UserBlock("Player2")*/}
                <div className="restart" style={restartShow} onClick={this.handleRestartClick}><h1>Restart</h1>
                </div>
            </div>
        );
    }
}


export default withCookies(GameField) ;