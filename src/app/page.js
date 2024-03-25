import Header from '@/components/header';
import React from 'react';
import axios from 'axios';

export default function Home() {
  /* axios.get('/api/user').then((res) => {
    console.log(res.data);
  }).catch((err) => {
    console.log(err);
  }); */

  return (
    <Header />      
  );
}
