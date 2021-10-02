import styled, { createGlobalStyle, css } from 'styled-components';

const sharedStyles = css`
  background-color: #eee;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #ddd;
  margin: 10px 0 20px 0;
  padding: 20px;
  box-sizing: border-box;
`

const StyledFormWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    padding 0 20px;
`

const StyledForm = styled.form`
    width: 100%;
    max-width: 700px;
    padding: 40px;
    background-color: #fff;
    border-radius: 10px;
    box-sizing: border-box;
    box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.2);
`

const StyledInput = styled.input`
    display: block;
    width: 100%;
    ${sharedStyles}
`

const StyledFile = styled.input`
    display: flex;
    width: 25%;
    ${sharedStyles}
`

const StyledButton = styled.button`
    display: block;
    background-color: brown;
    color: #fff;
    border: 0;
    border-radius: 5px;
    height: 40px;
    padding: 0 20px;
    cursor: pointer;
    box-sizing: border-box;
`

const StyledError = styled.div`
    color: red;
    font-width: 800;
    margin: 0 0 40px 0;
`

export { StyledFormWrapper, StyledForm, StyledInput, StyledError, StyledButton, StyledFile }