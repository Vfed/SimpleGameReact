import axios from 'axios';
import React from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { Navigate } from "react-router";

class LoginForm extends React.Component {

    static propTypes = {
      cookies: instanceOf(Cookies).isRequired
    };
    
    constructor(props) {
      super(props);
      const { cookies } = props;
      this.state = {
        value :  '',
        textInfo: '',
        login:false,
        name: null,
        direct: false , 
      };
      // this.handleChange = this.handleChange.bind(this);
      // this.handleSubmit = this.handleSubmit.bind(this);
      // this.handleRegistrationClick = this.handleRegistrationClick.bind(this);
      //this.handleLoginClick = this.handleLoginClick.bind(this);
      this.handleCookieClick =this.handleCookieClick.bind(this);
      this.handleCookie2Click =this.handleCookie2Click.bind(this);
      this.handleRedirectClick = this.handleRedirectClick.bind(this);
      console.log(cookies);
      console.log(this.state.name);
     }

    handleCookieClick(name){
      console.log(this.props);
      const { cookies } = this.props;
      cookies.set('name', name, { path: '/' });
      this.setState({ name: name });
    }

    handleCookie2Click(){
      const { cookies } = this.props;
      console.log(cookies.get('name'));
    }
    handleRedirectClick(){
      // const navigate = useNavigate();
      // navigate('/menu');
      this.setState({direct : true});
    }

    CheckRedirect(){
      // const navigate = useNavigate();
      // navigate('/menu');
      if(this.state.direct)
      {
        return(
          <Navigate to="/menu" />
        );
      }
    }
    handleRegistrationClick()
    {
      let userstring = this.state.value;
      let user = this.state.value;
      if(user){
        user = userstring.trim();
      }
      if(user !== `` && user !== null && user !== undefined)
      {
        axios.post(`https://localhost:5001/api/user/userexists`,{ Name : user})
        .then(res => {
          if(res.data !== null){
            this.setState({textInfo:`Name "${user}" is already used`});
          }
          else
          {
            axios.post(`https://localhost:5001/api/user/add`,{ Name : user})
            .then(res => {
              //Login
              if(res.status === 200)
              {
                this.setState({textInfo:`User was Registrated`});
                
              }
              else
              {
                this.setState({textInfo:`Something go wrong`});
              }
            });
          } 
        });
      }
    }

    handleChange(event) {
      this.setState({value: event.target.value}); 
    }

    async handleSubmit(event) {
      console.log(this.state.value);
      await axios.post(`https://localhost:5001/api/user/find`,{ Name : this.state.value})
      .then(res => {
        if(res.status === 200)
        {
          this.setState({textInfo : `User ${res.data.Name} is LoggedIn`, login:true});
          window.location.href = "/menu";
          console.log(res.data);
        }
        else
        {
          this.setState({textInfo : "No such User"});
        }
      });
      event.preventDefault();
    }
  
    render() {
      return (
        <div>
          {this.CheckRedirect()}
          <p>{this.state.textInfo}</p>
          {/* <form onSubmit={this.handleSubmit}>
            <label>
              Name:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
            </label>           
            <input type="submit" value="Send" />
           {/* <button onClick={this.handleLoginClick()}>Send</button> /}
          </form>
          <button onClick={this.handleRegistrationClick()}>Registrate</button> */}
           <button onClick={() => {this.handleCookieClick('Arturo')}}>Change Name Cookie</button>
           <button onClick={() => {this.handleCookie2Click()}}>Show Cookie</button>
           <button onClick={() => {this.handleRedirectClick()}}>Redirect</button>
           
        </div>
      );
    }
  }
  export default withCookies( LoginForm) ;