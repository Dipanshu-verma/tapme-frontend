// src/TapMe.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './TapMe.css';
import coinImage from './assets/coin.png'; 
import { useQuery, useMutation, gql } from '@apollo/client';

// GraphQL queries and mutations
const GET_USER = gql`
  query GetUser($username: String!) {
    getUser(username: $username) {
      id
      username
      coins
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($username: String!) {
    createUser(username: $username) {
      id
      username
      coins
    }
  }
`;

const UPDATE_COINS = gql`
  mutation UpdateCoins($id: ID!, $coins: Int!) {
    updateCoins(id: $id, coins: $coins) {
      id
      coins
    }
  }
`;

const TapMe: React.FC = () => {
  // Fetch username directly from Telegram Web App context
  const username = window.Telegram.WebApp.initDataUnsafe.user?.username || `User${window.Telegram.WebApp.initDataUnsafe.user?.id}` || 'Guest';
  console.log(username, "username from Telegram WebApp");

  const [coins, setCoins] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch the user based on username
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { username },
    onCompleted: (data) => {
      if (data && data.getUser) {
        setCoins(data.getUser.coins);
        setUserId(data.getUser.id);
      } else {
        handleCreateUser();
      }
    },
  });

  const [createUser] = useMutation(CREATE_USER, {
    onCompleted: (data) => {
      if (data.createUser) {
        setCoins(data.createUser.coins);
        setUserId(data.createUser.id);
      }
    },
  });

  const [updateCoins] = useMutation(UPDATE_COINS);

  // Function to create a new user if not found
  const handleCreateUser = () => {
    if (username) {
      createUser({ variables: { username } }).catch((err) => {
        console.error('Error creating user:', err);
      });
    } else {
      console.error('Username not found from Telegram Web App.');
    }
  };

  // Function to handle tapping the button to earn coins
  const handleTap = () => {
    const newCoins = coins + 1;
    setCoins(newCoins);
    setProgress((prev) => (prev + 10 > 100 ? 0 : prev + 10));
    if (progress + 10 >= 100) {
      setLevel((prev) => prev + 1);
    }

    // Update the coin balance on the backend when the user taps
    if (userId) {
      updateCoins({ variables: { id: userId, coins: newCoins } })
        .then(() => {
          console.log('Coins updated successfully');
        })
        .catch((err) => {
          console.error('Error updating coins:', err);
        });
    } else {
      console.error('User ID not found. Ensure the user creation was successful.');
    }
  };

  // Handling loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading user data.</p>;

  return (
    <div className="container">
      <div className="coin-display">
        <span>Coins: {coins}</span>
        <div className="user-level">Level {level}</div>
      </div>
      <motion.button
        className="tap-button"
        onClick={handleTap}
        whileTap={{ scale: 0.9 }}
        style={{ backgroundImage: `url(${coinImage})` }}
      />
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <button className="connect-wallet-button">Connect Wallet</button>
    </div>
  );
};

export default TapMe;
