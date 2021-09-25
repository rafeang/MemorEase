import React, { useState, useEffect } from "react";
import { db } from "../firebase/clientApp";
import { doc, onSnapshot, collection, updateDoc } from "firebase/firestore";
import axios from 'axios';

export default function Index() {
	const [message, setMessage] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const dayInMs = 24 * 60 * 60 * 1000;
  var countdowns = []

  const scheduleMessage = function(message, imageUrl, ttr) {
    countdowns.push(
      setTimeout(() => {
        updateDoc(doc(db, "message", "displayed"), {
          body: message,
          imageUrl: imageUrl
        });
        // call raspberry pi server to trigger hardware functions
        const dweet = { data: message };
        axios.post('https://dweet.io/dweet/for/memorease', dweet);
      }, ttr)
    );
  }

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
        scheduleMessage(doc.data().message, doc.data().imageUrl, timeToReminder);
      });
    });

    onSnapshot(doc(db, "message", "displayed"), (doc) => {
      setMessage(doc.data().body);
      setImageUrl(doc.data().imageUrl)
    });

    setTimeout(function() { window.location.reload(true); }, dayInMs);
  }, [])
  
	return (
		<div>
			<h1 className="p-5 m-5 text-8xl leading-snug">{ message }</h1>
      {
        imageUrl === '' ? ''
        :
        <img src={imageUrl} alt="reminderImage" />
      }
		</div>
	)
}
