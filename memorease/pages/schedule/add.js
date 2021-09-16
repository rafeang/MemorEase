import React, { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/clientApp";
import List from "../../components/list";

export default function Add() {
  const [hour, setHour] = useState("00")
  const [minute, setMinute] = useState("00")
  const [amPm, setAmPm] = useState("AM")
  const [message, setMessage] = useState("")
  const hours = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
  const minutes = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"]
  const dayShift = ["AM", "PM"]

  const formatTime = function(hr, min, ampm){
    var hour;
    if (ampm === "AM") {
      hour = "0" + parseInt(hr) % 12;
    } else {
      hour = parseInt(hr) % 12 + 12;
    }
    return hour + ":" + min;
  }

  const handleSubmit = function(event) {
    event.preventDefault();
    if (message === "") {
      alert("Please provide a reminder message");
      return
    } 
    let time = formatTime(hour, minute, amPm)
    setDoc(doc(db, "reminders", time), {
      message: message
    });
    setMessage("");
    alert("Set reminder: " + message + " for " + time);
  }

  return (
    <>
      <form className="w-full max-w"
        onSubmit={ handleSubmit }
      >
        <div className="flex flex-wrap mx-6 my-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase text-gray-700 font-bold mb-2">
              Type
            </label>
            <div className="relative">
              <select className="block w-full form-input py-3 px-4 pr-8">
                <option>Daily</option>
                {/* <option>Weekly</option>
                <option>Once</option> */}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 px-3 md:mb-0">
            <label className="block uppercase text-gray-700 font-bold mb-2">
              Time
            </label>
            <div className="flex">
              <select className="form-input w-1/3 block py-3 mr-4 mb-3 text-center" type="text" placeholder="00"
                value={ hour }
                onChange={ (e) => setHour(e.target.value) }
              >
                { hours.map((hr) => (<option value={ hr }>{ hr }</option>))}
              </select>
              <p className="pt-2">:</p>
              <select className="form-input w-1/3 block py-3 mx-4 mb-3 text-center" type="text" placeholder="00"
                value={ minute }
                onChange={ (e) => setMinute(e.target.value) }
              >
                { minutes.map((min) => (<option value={ min }>{ min }</option>))}
              </select>
              <select className="form-input w-1/4 block py-3 mr-4 mb-3 text-center" type="text" placeholder="00"
                value={ amPm }
                onChange={ (e) => setAmPm(e.target.value) }
              >
                { dayShift.map((shift) => (<option value={ shift }>{ shift }</option>))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap mx-6 mb-6">
          <div className="w-full px-3 mb-6 md:mb-0">
            <label className="block uppercase text-gray-700 font-bold mb-2">
              Message
            </label>
            <textarea className="form-input w-full h-32 block py-3 px-4 mb-3"
              placeholder="Enter reminder here"
              value={ message }
              onChange={ (e) => setMessage(e.target.value) }
            >
            </textarea>
          </div>
        </div>
        <div className="justify-center flex flex-wrap mx-6 mb-6">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Reminder
          </button>
        </div>
      </form>
      <List></List>
    </>
  )
}
