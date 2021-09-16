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
        reminders.push(obj);
      });
      setReminders(reminders);
    });
  }, [])

  return (
    <div className="flex flex-wrap mx-9 my-6">
      <table className="w-full table-fixed table-units">
        <thead>
          <tr className="bg-blue-100">
            <th className="table-units w-1/6">Time</th>
            <th className="table-units w-4/6">Reminder</th>
            <th className="table-units w-1/6">Delete?</th>
          </tr>
        </thead>
        <tbody>
          { reminders.map((reminder) => (
            <tr key={ reminder.time }>
              <td className="table-units">{ reminder.time }</td>
              <td className="table-units">{ reminder.message }</td>
              <td className="table-units">
                <button className="bg-red-300 hover:bg-red-500 text-white p-2 rounded-full"
                  onClick={ () => deleteReminder(reminder.time) }
                >
                  Delete
                </button>
              </td>
            </tr>
          )) }
        </tbody>
      </table>
    </div>
  )
}
