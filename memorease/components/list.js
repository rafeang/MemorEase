import React, { useState, useEffect } from "react";
import { db } from "../firebase/clientApp";
import { onSnapshot, collection, deleteDoc, doc } from "firebase/firestore";

export default function List() {
  const [reminders, setReminders] = useState([])
  // const deleteReminder = async (time) => {
  //   try {
  //     await deleteDoc(doc(db, "reminders", time));
  //     alert("Reminder deleted");
  //   } catch(e) {
  //     alert(e.message);
  //   }
  // }
  const deleteReminder = function(time) {
    deleteDoc(doc(db, "reminders", time));
  }

  useEffect(() => {
    onSnapshot(collection(db, "reminders"), (collection) => {
      let reminders = [];
      collection.forEach((doc) => {
        let obj = {}
        obj["time"] = doc.id;
        obj["message"] = doc.data().message
        obj["location"] = doc.data().location
        reminders.push(obj);
      });
      setReminders(reminders);
    });
  }, [])

  return (
    <div className="flex flex-wrap mx-9 my-6">
      <table className="w-full table-fixed border border-blue-300 p-2 text-center">
        <thead>
          <tr className="bg-blue-100">
            <th className="border border-blue-300 p-2 text-center md:w-1/12 w-1/6">Time</th>
            <th className="border border-blue-300 p-2 text-center md:w-2/12 w-1/6">Location</th>
            <th className="border border-blue-300 p-2 text-center md:w-8/12 w-3/6">Reminder</th>
            <th className="border border-blue-300 p-2 text-center md:w-1/12 w-1/6">Delete?</th>
          </tr>
        </thead>
        <tbody>
          { reminders.map((reminder) => (
            <tr key={ reminder.time }>
              <td className="border border-blue-300 p-2 text-center">{ reminder.time }</td>
              <td className="border border-blue-300 p-2 text-center">{ reminder.location }</td>
              <td className="border border-blue-300 p-2 text-center">{ reminder.message }</td>
              <td className="border border-blue-300 p-2 text-center">
                <button className="bg-red-300 hover:bg-red-500 text-white p-2 rounded-full"
                  onClick={ () => deleteReminder(reminder.time) }
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          )) }
        </tbody>
      </table>
    </div>
  )
}
