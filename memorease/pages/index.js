import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase/clientApp";
import { doc, onSnapshot, collection, updateDoc } from "firebase/firestore";
import axios from 'axios';
import Clock from 'react-live-clock'
<link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"></link>

export default function Index() {
	const [message, setMessage] = useState("")
  const [location, setLocation] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [audioUrl, setAudioUrl] = useState("")
  const dayInMs = 24 * 60 * 60 * 1000;
  var countdowns = [];

  const scheduleMessage = function(message, location, imageUrl, audioUrl, ttr) {
    countdowns.push(
      setTimeout(() => {
        updateDoc(doc(db, "message", "displayed"), {
          body: message,
          location: location,
          imageUrl: imageUrl,
          audioUrl: audioUrl
        });
        const dweet = { location: location };
        console.log(dweet);
        axios.post('https://dweet.io/dweet/for/memorease', dweet);
      }, ttr)
    );
  }

  useEffect(() => {
    const listener = KeyboardEvent => {
      console.log(KeyboardEvent.code)
      console.log(KeyboardEvent)
      updateDoc(doc(db, "message", "displayed"), {
        body: "",
        location: "",
        imageUrl: "",
        audioUrl: ""
      });
      const dweet = { stop: location };
      console.log(dweet);
      axios.post('https://dweet.io/dweet/for/memorease', dweet);
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);

  useEffect(() => {
    onSnapshot(collection(db, "reminders"), (collection) => {
      countdowns.forEach((timeout) => {
        clearTimeout(timeout);
      })
      countdowns = [];
      collection.forEach((doc) => {
        let time = doc.id.split(":");
        let hr = time[0];
        let min = time[1];
        let currentTime = new Date();
        let day = currentTime.getDate();
        let month = currentTime.getMonth();
        let year = currentTime.getFullYear();
        let reminderTime = new Date(year, month, day, hr, min);
        let timeDiff = reminderTime.getTime() - currentTime.getTime();
        let timeToReminder = timeDiff > 0 ? timeDiff : timeDiff + dayInMs;
        let data = doc.data();
        scheduleMessage(data.message, data.location, data.imageUrl, data.audioUrl, timeToReminder);
      });
    });

    onSnapshot(doc(db, "message", "displayed"), (doc) => {
      setMessage(doc.data().body);
      setLocation(doc.data().location);
      setImageUrl(doc.data().imageUrl);
      setAudioUrl(doc.data().audioUrl);
    });

    setTimeout(function() { window.location.reload(true); }, dayInMs);
  }, [])
  
	return (
		<div> 
      <div className="max-w-screen p-3 max-h-screen h-screen bg-gray-200 justify-center items-center">  
        <div className="max-w-screen flex rounded overflow-hidden shadow-lg bg-blue-300 max-h-screen h-full">
          <div className="px-3 font-mono align-middle items-center w-full">
          <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          <div className=" font-bold text-4xl mb-1 inline-block p-3">
            Reminders
            <Clock
              format={'HH:mm:ss'}
              ticking={true}
              timezone={'Asia/Singapore'}
              className="text-4xl text-center font-semibold font-mono pl-12 float-right"
            />  
          </div><hr/>
          <p className="text-gray-700 text-base text-5xl my-2 p-2 text-center">
            {message}
          </p>
          {
            imageUrl === '' ? <div className="h-full object-fill"></div>
            :
            <img src={imageUrl} alt="reminderImage" className="py-2 object-scale-down object-center h-full mx-auto"/>
          }
          </div>
        </div>
      </div>
      {
        audioUrl === '' ? ''
        :
        <audio autoPlay loop src={audioUrl} type="audio/mp3">
        </audio>
      }
		</div>
    
	)
}
