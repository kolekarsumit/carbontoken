'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import RegisterPage from "./mypages/Register/page";
import { useEffect, useState } from "react";
import { NumberProvider, useNumber } from "./numberContext";
import LoginPage from './mypages/Login/page';

export default function Home() {


  // const { number, setNumber } = useNumber(); // Access number and setNumber from context

  // console.log(`home page ${number}`)
  // useEffect(() => {
  //   const userNumber = prompt('Enter a number:');
  //   if (userNumber !== null) {
  //     setNumber(userNumber); // Store the entered number in the context
  //   }
  // }, [setNumber]);

  return (
   <div>
    <LoginPage/>
   
   </div>
  );
}

