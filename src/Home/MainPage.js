import React, { useEffect, useState, createRef } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './MainPage.module.css';
import Spinner from '../UI/Spinner';
import Error from '../UI/Error';
import Backdrop from '../UI/Backdrop';
import { connect } from 'react-redux';

function MainPage(props) {

    const [user, setUser] = useState([]);
    const [news, setNews] = useState([]);
    const [value, setValue] = useState(1);
    const [loading, setLoading] = useState(false);
    const [postPerPage, setPostPerPage] = useState(20);
    const [filteredNews, setFilteredNews] = useState([]);
    const [modal, setModal] = useState(false);
    const [length, setLength] = useState();

    const storedData = JSON.parse(localStorage.getItem('userData'));

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/user-details/${storedData.userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + storedData.userToken
            }
        })
        .then(res => {
            return res.json();
        })
        .then(res => {
            setUser([...user, res.user]);
        })
        .catch(err => {
            console.log(err);
        })

    }, [storedData.userId, storedData.userToken]);

    useEffect(() => {
        setLoading(true);
        const getNews = async () => {
            const url = "https://hacker-news.firebaseio.com/v0/topstories.json";
            try {
              const response = await fetch(url);
              const json = await response.json();
              setLength(json.length);
              const items = json
                .slice(value*20-20, value*20)
                .map(id =>
                  fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
                    response => response.json()
                  )
                );
              const result = await Promise.all(items);
              setLoading(false);
              setNews(result);
              setFilteredNews(result);
            } catch (err) {
              console.error(err);
            }
          }
          getNews();
    }, [value]);

    let username;

    if(user.length > 0) {
        username = user.map(i => {
            return (
                <div className={styles.user__details} key={i._id}>
                    <p>{i.name}</p>
                </div>
            )
        })
    }
    
    let posts;
    if(news.length > 0) {
        posts = filteredNews.map((i, index) => {
            return (
                <div key={index} className={styles.post}>
                    <a href={i.url}><p>{i.title}</p></a>
                </div>
            )
        })
    }

    const onSearchHandler = (e) => {

        const value = e.target.value;
        const data = JSON.parse(localStorage.getItem('history')) || '';
        let arr = [...data];
        const obj = {title: value, time: new Date(new Date().getTime())}
        arr.push(obj);
        localStorage.setItem('history', JSON.stringify(arr));
        props.history.push(`/?query=${value}`);
        setFilteredNews(
            news.filter(i => {
                return i.title.includes(value.toLowerCase());
            })
        )
    };  

    const numberOfPages = Math.ceil(length / postPerPage);
    const arr = [];
    for(let i=1; i<=numberOfPages; i++) {
        arr.push(i);
    }

    const pages = (val) => {
        setValue(val);
    }

    const onClickModalHandler = () => {
        setModal(false);
    };
    
    return (
        <div className={styles.row}>
            {modal && <Error modalToggle={onClickModalHandler}/>}
            {modal && <Backdrop modalToggle={onClickModalHandler} />}
            <div className={styles.header}>
                {username}
                <input onChange={onSearchHandler} className={styles.searchBar} type="text" placeholder="Search stories by title, url or author" />
                <NavLink className={styles.logout} to="/auth" onClick={props.logout}>Logout</NavLink>
            </div>
            {loading && <Spinner />}
            <div className={styles.posts}>
                {posts}
            </div>
            <ul className={styles.pages}>
            {!loading && arr.map(i => {
                    return (
                        <li key={i} onClick={() => pages(i)}>
                            <a>{i}</a>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        userId: state.userId,
        userToken: state.userToken
    }
};

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch({type: 'logout'})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
