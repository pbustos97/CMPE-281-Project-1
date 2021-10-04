import Header from './components/Header';
import Register from './components/Register';
import Login from './components/Login';
import styled, { createGlobalStyle, css } from 'styled-components';
import Upload from './components/Upload';
import Files from './components/Files';

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
        <Upload />
        <Files />
        <Login />
    </div>
  );
}

export default App;
