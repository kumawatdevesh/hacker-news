import React from 'react';
import styles from './Error.module.css';
import { NavLink } from 'react-router-dom';
import Backdrop from './Backdrop';

function Error(props) {

    const onClickHandler = () => {
        props.modalToggle();
    };

    return (
        <div className={styles.modal}>
            <div className={styles.upper}>
                <h2>Something went Wrong!</h2>
            </div>
            <h1>Please try again!</h1>
            <div className={styles.cancel}>
                <button onClick={onClickHandler}>Cancel</button>
            </div>
        </div>
    )
}

export default Error;
