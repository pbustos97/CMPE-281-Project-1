import { createGlobalStyle } from 'styled-components';
import {Route, BrowserRouter as Router} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UserPage from './pages/UserPage';
import AdminPage from './pages/AdminPage';
import HomePage from './pages/HomePage';

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
  console.log(process.env)
  return (
    <div className="App">
      <GlobalStyle />
      <Router>
          <Route exact path='/' component={HomePage}/>
          <Route exact path='/login' component={LoginPage}/>
          <Route exact path='/user' component={UserPage}/>
          <Route exact path='/files' component={AdminPage}/>
        </Router>
    </div>
  );
}

export default App;
