import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import './game-style.css';
import { CookiesProvider } from 'react-cookie';

const GameField = lazy(() => import('./GameField.tsx'));
const LoginForm = lazy(() => import('./Login2.tsx'));
const Menu = lazy(() => import('./Menu.tsx'));
// const Chat = lazy(() => import('./Chat.js'));

ReactDOM.render(
  <CookiesProvider>
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route exact path="/" element={<LoginForm/>} />
          {/* <Route exact path="/games" element={<Game />}/>*/}
          <Route exact path="/menu" element={<Menu/>}/> 
          {/* <Route path="*" element={<NotFound/>}/> */}
          <Route path="/menu/game" element={<GameField />} />
          {/* <Route path="/menu/game/:id" 
          render={(props) => <GameField {...props.match.params} /> } /> */}
        </Routes>
      </Suspense>
    </Router>
  </CookiesProvider>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
