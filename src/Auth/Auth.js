import React, { useState } from 'react';
import Error from '../UI/Error';
import Backdrop from '../UI/Backdrop';
import { connect } from 'react-redux';
import styles from './Auth.module.css';

function Auth(props) {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginMode, setLoginMode] = useState(false);
    const [modal, setModal] = useState(false);

    const loginModeHandler = () => {
        setLoginMode(prevState => !prevState);
    };

    const onSignUpHandler = (e) => {
        e.preventDefault();

        if(email.trim().length === 0  || password.trim().length === 0 || email.trim().length === 0) {
            setModal(true);
            return;
        }

        const data = {
            name: name,
            email: email,
            password: password
        }

        fetch(`${process.env.REACT_APP_BACKEND_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => {
            return res.json();
        })
        .then(res => {
            if(res.err) {
                setModal(true);
                return;
            }else {
                props.login(res.user._id, res.userToken);
                props.history.push('/');
            }
        })
        .catch(err => {
            console.log(err);
        });

    };

    const onLoginHandler = (e) => {
        e.preventDefault();

        if(email.trim().length === 0  || password.trim().length === 0) {
            setModal(true);
            return;
        }

        const data = {
            email: email,
            password: password
        }

        fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },  
            body: JSON.stringify(data)
        })
        .then(res => {
            return res.json();
        })
        .then(res => {
            if(res.err) {
                setModal(true);
                return;
            }else {
                props.login(res.user._id, res.userToken);
                props.history.push('/');
            }
        })
        .catch(err => {
            console.log(err);
        });

    };

    const onClickModalHandler = () => {
        setModal(false);
    };

    return (
        <div className={styles.row}>
            <p style={{fontSize: '5rem', textAlign: 'center', margin: '0', color: '#ff742b', textTransform: 'uppercase'}}>hacker news</p>
            {modal && <Error modalToggle={onClickModalHandler}/>}
            {modal && <Backdrop modalToggle={onClickModalHandler} />}
            <div className={styles.auth}>
                <form className={styles.authForm} onSubmit={loginMode ? onLoginHandler : onSignUpHandler}>

                    {!loginMode && <label>Name</label>}
                    {!loginMode && 
                    <input type="text" name="name" placeholder="enter your name" 
                    value={name}
                    onChange={e => setName(e.target.value)}/>}

                    <label>Email</label>
                    <input type="email" name="email" placeholder="enter your email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}/>

                    <label>Password</label>
                    <input type="password" name="password" placeholder="enter your password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}/>

                    <input type="submit" value={loginMode ? 'Login' : 'SignUp'}/>

                </form>
                <button onClick={loginModeHandler}>{loginMode ? 'SignUp' : 'Login'}</button>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        userId: state.userId,
        userToken: state.userToken
    }
}

const mapDispatchToProps = dispatch => {
    return {
        login: (id, token) => dispatch({type: 'login', userId: id, userToken: token}),
        signup: (id, token) => dispatch({type: 'login', userId: id, userToken: token})
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
