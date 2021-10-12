import Header from './components/Header';
import { createGlobalStyle } from 'styled-components';
import {Route, BrowserRouter as Router} from 'react-router-dom';
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
      <Router>
        <Header />
          <Route exact path='/login' component={LoginPage}/>
          <Route exact path='/user' component={UserPage}/>
          <Route exact path='/files' component={AdminPage}/>
        </Router>
    </div>
  );
}

export default App;
