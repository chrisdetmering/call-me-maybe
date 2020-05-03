import React from 'react'; 
import classes from './Button.module.css'
import Aux from '../../hoc/Aux/Aux';
const button = (props) => (
  <Aux>
  <button 
    className={classes.Button}
    onClick={props.click}>{props.children}</button>
  </Aux>
)

export default button; 