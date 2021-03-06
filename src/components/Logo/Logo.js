import React from 'react';

import pizzaLogo from '../../assets/images/logo.jpg';
import classes from './Logo.module.css';

const logo = (props) => (
    <div className={classes.Logo} style={{height: props.height}}>
        <img src={pizzaLogo} alt="My Pizza" />
    </div>
);

export default logo;