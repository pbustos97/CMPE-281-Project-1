import React from 'react';
import { useState } from 'react';
import styled, { createGlobalStyle, css } from 'styled-components';
import { StyledFormWrapper, StyledForm, StyledInput, StyledError, StyledButton }  from './StyledComponents';
import axios from 'axios';
import Login from './Login';

// Header specific stylizations
const Nav = styled.div`
    background-color: darkgrey;
    border-bottom: 1px solid rgba(0,0,0,0.0975);
`

const NavHeader = styled.div`
    max-width: 1010px;
    padding: 26px 20px;
    width: 100%;
    display: flex;
    align-items: center;
    margin 0 auto;
`

const NavLeft = styled.div`
    width: 33.333%
    text-align: left;
`

const NavCenter = styled.div`
    width: 33.333%
    text-align: center;
`
const NavRight = styled.div`
    width: 33.333%
    text-align: right;

    svg {
        margin-right: 20px;
    }
`

const MenuLink = styled.a``

function Header() {
    

    return (
        <Nav>
            <NavHeader>
                <NavLeft>
                    <MenuLink href='/'>
                        Project 1
                    </MenuLink>
                </NavLeft>
                <NavCenter>
                    Hello, world
                </NavCenter>
                <NavRight>
                    <MenuLink href="user">
                        Profile
                    </MenuLink>
                </NavRight>
            </NavHeader>
        </Nav>
    )
};

export default Header
