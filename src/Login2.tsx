import React, { Component } from 'react';
import axios from 'axios';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies, useCookies } from 'react-cookie';
import { Navigate } from "react-router";

const url = 'https://localhost:5001';

interface IProps {
}

interface UserDto {
  Name?: string;
}

interface IUser {
  name?: string;
  score?: number;
}

interface IState {
  textInfo?: string;
  name?: string;
  userRegistration?: boolean,
  cookies?: any,
  redirect?: boolean;
}

class LoginForm extends React.Component<IProps, IState> {
    static propTypes = {
      cookies: instanceOf(Cookies).isRequired
    };
    
    constructor(props:any) {
      super(props);
      const { cookies } = props;
      this.state = {
        textInfo: '',
        name: '',
        userRegistration: false,
        cookies: props,
        redirect: false
      };

      this.handleUsernameFieldChange = this.handleUsernameFieldChange.bind(this);
      this.handleLoginClick = this.handleLoginClick.bind(this);
      this.handleRegistrationClick = this.handleRegistrationClick.bind(this);
     }

     //START Handle events

     handleUsernameFieldChange(event: any){
      this.setState({
        name: event.target.value, 
        textInfo: '', 
        userRegistration: false});
     }

     async handleLoginClick(){
       let user : IUser = await this.GetUser(this.state.name);
       if(user !== null && user !== undefined)
       {
        const { cookies } = this.state.cookies;
        cookies.set('name', user.name, { path: '/' })
        cookies.set('score', user.score, { path: '/' });
        this.setState({redirect: true});
       }
       else
       {
        this.setState({
          textInfo: `User ${this.state.name} not found. Registrate ?`,
          userRegistration: true});
       }
     }

     async handleRegistrationClick(){
        let userDto : UserDto = {Name: this.state.name }
        await axios.post(`${url}/api/user/add`, userDto)
        .then(resp => {
          if(resp.status === 200)
          {
            console.log(resp.data);
            if(resp.data)
            {
              this.setState({textInfo:'Registration Ok !!!', userRegistration: false});
              this.handleLoginClick();
              return;
            }
          }
        });
        this.setState({textInfo:'Registration Failed try another Username !!!', userRegistration: false});
     }

     //END Handle events
     
     //START Extra functions
     
     async GetUser(name:string | undefined){
      let user = null;
      if( name ){
      user = await axios.get(`${url}/api/user/login?name=${name}`)
      .then(resp => {
        return (resp.status === 200 ) ? resp.data : null ;
      });
      }
      return user;
    }

     //END Extra functions

     //START Show functions
     
     ShowInfo(){
      if(this.state.textInfo !== '')
      {
        return(<p>{this.state.textInfo}</p>);
      }
    }

    ShowLogin(){
     if(!this.state.userRegistration)
     {
       return(<input type="button" onClick={this.handleLoginClick} value={'Login'}/>);
     }
   }
    ShowRegistrate(){
     if(this.state.userRegistration)
     {
       return(<input type="button" onClick={this.handleRegistrationClick} value={'Registrate'}/>);
     }
   }

   ShowRedirect(){
    if(this.state.redirect)
    {
      return(
        <Navigate to="/menu" />
      );
    }
  }

  //END Show functions
  
  render() {
    return(
      <div className='login'>
        <div className='main-block'>
          <p>Username :</p>
          {this.ShowInfo()}
          {this.ShowRedirect()}
          <input type="text" onChange={this.handleUsernameFieldChange} />
          {this.ShowLogin()}
          {this.ShowRegistrate()}
        </div>
      </div>
    );
  }

}
export default withCookies(LoginForm) ;
          
  