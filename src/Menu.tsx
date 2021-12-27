import axios from 'axios';
import React from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import { Navigate } from 'react-router-dom';

const url = 'https://localhost:5001';

interface IProps {
}

interface IState {
  name: string ,
  score: number ,
  //sessionslist: [],
  addSessionInfo: string ,
  cookies?: any,
  opponentName: string,
  redirection: boolean,
}

interface UserDto {
  Name?: string;
}

interface SessionUsersDto {
  Player1?: string,
  Player2?: string,
}

interface IUser {
  name?: string;
}

interface IGameSession{
        Id: number,
        Users: any,
        CurrentPlayer: any,
        GameStatus:string,
        dateTime: Date,
        Field: Array<Array<String>>,
}

class Menu extends React.Component<IProps, IState> {

  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

    constructor(props:any) {
      super(props);
      const { cookies } = props;
      this.state = {
        name: cookies.get('name'),
        opponentName : '',
        score: cookies.get('score'),
        //sessionslist : [],
        addSessionInfo: '',
        cookies: props,
        redirection : false,
      };

      this.handleUsernameFieldChange = this.handleUsernameFieldChange.bind(this);
      this.handleAddSessionClick = this.handleAddSessionClick.bind(this);
    }

    //START Component lifestate
    
    componentDidMount(){
      const { cookies } = this.state.cookies; 
      cookies.remove('opponent');
      cookies.remove('sessionId');
    }

    //END Component state
    
    //START Handle events

    handleUsernameFieldChange(event: any){
      this.setState({
        opponentName: event.target.value,
        addSessionInfo: '',
      });
     }

     async handleAddSessionClick(){
       let user : IUser = await this.GetUser(this.state.opponentName);
       if(user !== null && user !== undefined)
       {
        this.AddSession();
        const { cookies } = this.state.cookies; 
        cookies.set('opponent', this.state.opponentName, { path: '/' });
        this.setState({addSessionInfo: 'User found',});
        const item: SessionUsersDto= { 
          Player1: this.state.name ,
          Player2: this.state.opponentName};
        const result = await axios.post(`${url}/api/games/getsessionid`,item);
        console.log(result);
        if(result.status == 200 ){
          cookies.set('sessionId', result.data.id ,{ path: '/' });
          this.setState({redirection: true});
        }

       }
       else
       {
        this.setState({addSessionInfo: 'No Such User found',});
     }
    }
    
    //END Handle events
    
    //START Extra function

    async AddSession()
    {
      const addSession: SessionUsersDto = { 
        Player1: this.state.name ,
        Player2: this.state.opponentName}
      const rezalt = await axios.post(`${url}/api/games/add`, addSession);
      if(rezalt.status == 200){
        this.setState({
          addSessionInfo : rezalt.data
        });
      }
    }

    async GetUser(name: string ){
      let user = null;
      if( name ){
        user = await axios.get(`${url}/api/user/login?name=${name}`)
        .then(resp => {
          return (resp.status === 200 ) ? resp.data : null ;
        });
      }
      return user;
    }

    //END Extra function

    //START Show functions
    
    ShowAddInfo(){
      if(this.state.addSessionInfo !== '')
       {
         return(<p>{this.state.addSessionInfo}</p>);
       }
    }

    ShowHeader(){
      if(this.state.name !== '' && this.state.name)
      return(
      <div>
        <h3 className='head'>User: <i>{this.state.name}</i>, Score: {this.state.score}</h3>
      </div>)
    }

    ShowGameRedirection(){
      if(this.state.redirection)
      return(
        <Navigate to="/menu/game" />
        )
    }
    
    //END Show functions

    render() {
      return (
        <div className='menu'>
          <div className='main-block'>
            {this.ShowGameRedirection()}
            {this.ShowHeader()}
            <p>Enter game room with Player:</p>
            <input type="text" onChange={this.handleUsernameFieldChange} />
            <input type="button" onClick={this.handleAddSessionClick} value={'Connect Player'}/>
            {/*this.ShowSessionsList()*/}
            <b>{this.ShowAddInfo()}</b>
          </div>
        </div>
      );
    }
  }

  export default withCookies(Menu);