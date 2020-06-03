import React from 'react';
import styles from './Backdrop.module.css';

function Backdrop(props) {

    const onClickHandler = () => {
        props.modalToggle();
    };

    return (
        <div className={styles.backdrop} onClick={onClickHandler}>
            
        </div>
    )
}

export default Backdrop;
