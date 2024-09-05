/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-underscore-dangle */
/* eslint-disable array-callback-return */
/* eslint-disable react/function-component-definition */
import { useState, useEffect, FormEvent } from 'react';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { dateFormatter } from '../lib/dateFormatter';

import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [text, setText] = useState('');
  const [username, setUsername] = useState('');
  const [tweets, setTweets] =
    useState<[{ text: string; username: string; createdAt: number }]>();
  const [fetchData, setFetchData] = useState(false);

  setInterval(() => {
    if (isOnline === navigator.onLine) return;
    setIsOnline(navigator.onLine);
  }, 100);

  const getData = async () => {
    if (isOnline === true) {
      const allTweets = await window.electron.get();
      console.log(allTweets);
      setTweets(allTweets);
      const prevouisLocalStorage = JSON.parse(
        localStorage.getItem('data') as string,
      );

      if (prevouisLocalStorage !== tweets) {
        localStorage.setItem('data', JSON.stringify(allTweets));
      }
    } else {
      setTweets(
        JSON.parse(localStorage.getItem('data' as string) as string) as any,
      );
    }
  };

  useEffect(() => {
    getData();
  }, [fetchData, isOnline]);

  useEffect(() => {
    if (isOnline) {
      const localCD = localStorage.getItem('tweets');
      if (localCD !== null) {
        const converted = JSON.parse(localCD as string) as [
          { text: string; username: string; createdAt: number },
        ];

        converted.map(async (c) => {
          localStorage.removeItem('tweets');
          await window.electron.add(c);
          const newTweets = await window.electron.get();
          localStorage.setItem('data', JSON.stringify(newTweets));
          setTweets(newTweets);
        });
      }
    }
  }, [isOnline]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isOnline) {
      const previousData = JSON.parse(localStorage.getItem('tweets') as string);
      toast(
        'You are currently offline. Tweet will be published once you will go online',
        {
          type: 'info',
        },
      );
      if (previousData === null) {
        localStorage.setItem(
          'tweets',
          JSON.stringify([
            {
              text,
              username: `@${username}`,
              createdAt: Date.now(),
            },
          ]),
        );
      } else {
        const cloneOfPrevData = [...previousData];
        cloneOfPrevData.push({
          text,
          username: `@${username}`,
          createdAt: Date.now(),
        });
        localStorage.setItem('tweets', JSON.stringify(cloneOfPrevData));
      }
    } else {
      await window.electron.add({
        text,
        username: `@${username}`,
        createdAt: Date.now(),
      });
      setFetchData((prev) => !prev);
    }
    setText('');
    setUsername('');
  };

  return (
    <div>
      <h1>Hello From Home</h1>
      <button
        type="button"
        style={{
          background: 'transparent',
          border: 'none',
          padding: 0,
          margin: 0,
          fontSize: '2rem',
          marginBottom: '0.5rem',
          cursor: 'pointer',
        }}
        onClick={() => {
          if (isOnline) {
            toast('You are currently online', { type: 'success' });
          } else {
            toast('You are currently offline', { type: 'error' });
          }
        }}
      >
        {isOnline ? '🟩' : '🟥'}
      </button>
      <button type="button" onClick={() => setFetchData((prev) => !prev)}>
        Refresh
      </button>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          placeholder="What's your username?"
          required
        />
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          placeholder="What's happening?"
          required
        />
        <button type="submit">Tweet</button>
      </form>
      <ul>
        {tweets?.map((t: any) => {
          const doc = t._doc;
          return (
            <li>
              <span style={{ fontWeight: 700 }}>{doc.username}</span> {doc.text}{' '}
              <span style={{ color: 'grey' }}>
                {dateFormatter(doc.createdAt)}
              </span>
            </li>
          );
        })}
      </ul>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </div>
  );
};

export default Home;
