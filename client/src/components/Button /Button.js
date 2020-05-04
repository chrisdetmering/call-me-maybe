import React from 'react'; 
import classes from './Button.module.css'

const button = (props) => (
  <div className={props.input ? classes.Input : null } >
    <button 
      className={classes.Button}
      onClick={props.click}>{props.children}</button>
    {props.input ? <input onChange={props.change} value={props.value ? props.value : ''}/> : null}
  </div>
)

export default button; 