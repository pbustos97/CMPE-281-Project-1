import styled, { css } from 'styled-components';

const sharedStyles = css`
  background-color: #eee;
  height: 60px;
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

const StyledFileEntry = styled.div`
    display: inline-block !important;
    width: 100%;
    padding: 40px;
    background-color: #fff;
    border-radius: 10px;
    box-sizing: border-box;
    box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.2);
    text-align: right;
    margin-left: auto;
    margin-right: auto;
`

const StyledFileGrid = styled.div`
    display: grid;
    grid-template-columns: auto auto auto auto auto auto auto auto;
`

const StyledButtonGrid = styled.div`
    display: grid;
    grid-template-rows: auto auto auto auto;
    margin-left: auto;
`

const StyledFileGridColumn = styled.div``

const StyledInput = styled.input`
    display: block;
    width: 100%;
    ${sharedStyles}
`

const StyledFile = styled.input`
    display: flex;
    width: 50%;
    height: 200px;
    ${sharedStyles}
`

const StyledButton = styled.button`
    display: inline;
    background-color: brown;
    color: #fff;
    border: 0;
    border-radius: 5px;
    height: 40px;
    padding: 0 20px;
    cursor: pointer;
    box-sizing: border-box;
`
const StyledButtonDelete = styled.button`
    display: block;
    background-color: red;
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

const StyledTextArea = styled.input`
    display: flex;
`

export { StyledFormWrapper, StyledForm, StyledInput, StyledError, StyledButton, StyledFile, StyledButtonDelete, StyledTextArea, StyledFileEntry, StyledFileGrid, StyledFileGridColumn, StyledButtonGrid }