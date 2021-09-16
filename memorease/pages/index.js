import React, { useState, useEffect } from "react";
import { db } from "../firebase/clientApp";
import { doc, onSnapshot, collection, updateDoc } from "firebase/firestore";

export default function Index() {
	const[message, setMessage] = useState("")
  const dayInMs = 24 * 60 * 60 * 1000;
  var countdowns = []

  const scheduleMessage = function(message, ttr) {
    countdowns.push(
      setTimeout(() => {
        updateDoc(doc(db, "message", "displayed"), {
          body: message
        });
        // call raspberry pi server to trigger hardware functions
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
        scheduleMessage(doc.data().message, timeToReminder);
      });
    });

    onSnapshot(doc(db, "message", "displayed"), (doc) => {
      setMessage(doc.data().body);
    });

    setTimeout(function() { window.location.reload(true); }, dayInMs);
  }, [])
  
	return (
		<div>
			<h1 className="p-5 m-5 text-9xl">{ message }</h1>
		</div>
	)
}
