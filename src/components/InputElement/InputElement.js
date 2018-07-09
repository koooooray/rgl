import React from 'react';
import classes from "./InputElement.css";

const InputElement = (props) => {
    
    let inputElement = null;
    const inputClasses = [classes.Input];

    if(props.invalid && props.touched){
        inputClasses.push(classes.Invalid);
    }

    switch(props.elementType){
        // case('input'):
        //     inputElement = <input
        //     {...props.elementConfig} />
        //     break;
        case('select'):
            inputElement = <select 
                value={props.value}
                onChange={props.changed}>
                {props.elementConfig.hasEmptyOption ? <option value={''}>-</option> : ''}
                {props.elementConfig.options.map(option=>(
                    <option 
                        key={option.value} 
                        value={option.value}>
                        {option.displayName}
                    </option>
                ))}
            </select>
            break;
        case('toggle'):
            const checked = props.elementConfig ? props.elementConfig.checked : false;
            inputElement = (<label className={classes.ToggleContainer}>
                    <input type="checkbox" onChange={props.changed} defaultChecked={checked}/>
                    <span  className={classes.ToggleCheckmark}></span>
                </label>)
            break;
        default:
            inputElement = null;
    }

    return !inputElement ? "" : (
        <div className={inputClasses.join(" ")}>
            <label className={classes.Label}>{props.label}</label>
            {inputElement}
            <div className={classes.ValidationError + ' validation'}>{props.invalid && props.touched ? props.validationMessage : ''}</div>
        </div>
    );
}

export default InputElement;