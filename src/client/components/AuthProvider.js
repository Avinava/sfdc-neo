import React, { Component } from 'react';
import AuthContext from './AuthContext';

export default class AuthProvider extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          session: null,
          avatar: null,
          identity: null,
          ready: false,
        };
    }
}