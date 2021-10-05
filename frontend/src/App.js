import Header from './components/Header';
import Register from './components/Register';
import Login from './components/Login';
import styled, { createGlobalStyle, css } from 'styled-components';
import Upload from './components/Upload';
import Files from './components/Files';
import {Route, Link} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UserPage from './pages/UserPage';
import AdminPage from './pages/AdminPage';

const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
  }

  body {
    background: grey;
    height: 100%;
    margin: 0;
  }
`

function App() {
  return (
    <div className="App">
      <GlobalStyle />
        <Header />
        <Route exact path='/login' component={LoginPage}/>
        <Route exact path='/user' component={UserPage}/>
        <Route exact path='/files' component={AdminPage}/>
    </div>
  );
}

export default App;
