'use client'
 
import { useState , useEffect} from 'react'
import React from 'react';
import Babylon_pong_multi from '../../components/Game/SceneComponentmulti';
import { useContext } from 'react';
import { useStore } from "zustand";
import { AuthContext } from '@contexts/AuthContext/AuthContext';
import { useRouter } from 'next/navigation';

const Game_page = () => {
  const router = useRouter();
  const authStore = useContext(AuthContext)
  const isLogged = useStore(authStore, (state) => state.isLogged)
  useEffect(() => {
    if (!isLogged) {
      router.push('/login');
      return
    }
  }, [isLogged])
  return (
    <div>
      <title>Pong 3D</title>
      <Babylon_pong_multi />
    </div>
  );
};

export default Game_page;