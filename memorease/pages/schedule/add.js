import React, { useState, useEffect, useRef } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db, storage, ref, uploadBytesResumable, getDownloadURL } from "../../firebase/clientApp";
import List from "../../components/list";
import Recorder from "../../components/recorder";

export default function Add() {
  const [isDisabled, setIsDisabled] = useState("")
  const [buttonColour, setButtonColour] = useState("bg-blue-500")
  const [buttonText, setButtonText] = useState("Add Reminder")
  const [hour, setHour] = useState("01")
  const [minute, setMinute] = useState("00")
  const [amPm, setAmPm] = useState("AM")
  const [message, setMessage] = useState("")
  const [recorderBlob, setRecorderBlob] = useState(null)
  const [imageUrl, setImageUrl] = useState("")
  const [audioUrl, setAudioUrl] = useState("")
  const [imageAsFile, setImageAsFile] = useState('')
  const [tempImageUrl, setTempImageUrl] = useState('')
  const hours = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
  const minutes = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"]
  const dayShift = ["AM", "PM"]
  const locations = ["Bedroom", "Kitchen", "Bathroom", "Living Room"]
  const [location, setLocation] = useState(locations[0])
  const ref_file = useRef()
  const imageMeta = {
    contentType: 'image/jpeg'
  };
  const audioMeta = {
    contentType: 'audio/mp3'
  };

  const handleRecorderChange = function(blob) {
    setRecorderBlob(blob);
  }

  const formatTime = function(hr, min, ampm){
    var hour;
    if (ampm === "AM") {
      hour = "0" + parseInt(hr) % 12;
    } else {
      hour = parseInt(hr) % 12 + 12;
    }
    return hour + ":" + min;
  }

  useEffect(() => {
    if (imageAsFile !== '') {
      const time = formatTime(hour, minute, amPm)
      const imagePath = `/images/${time + "_" + imageAsFile.name}`;
      uploadToStorage(imagePath, imageAsFile, imageMeta)
    }
  }, [imageAsFile])

  useEffect(() => {
    if (recorderBlob !== null) {
      const time = formatTime(hour, minute, amPm)
      const dateString = new Date().toLocaleDateString().replace(/\//g, "_");
      const blobPath = `/audio/${time + "_" + dateString}`;
      uploadToStorage(blobPath, recorderBlob, audioMeta);
    }
  }, [recorderBlob])

  useEffect(() => {
    if (isDisabled == "") {
      setButtonColour("bg-blue-500")
      setButtonText("Add Reminder")
    } else {
      setButtonColour("bg-blue-200")
      setButtonText("Uploading...")
    }
  }, [isDisabled])

  const uploadToStorage = async function(path, file, meta) {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file, meta);
    uploadTask.on('state_changed',
      (snapshot) => {
        setIsDisabled("true") 
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
        if (progress === 100) {  
          setTimeout(() => {
            setIsDisabled("") 
            const pathReference = ref(storage, path);
            getDownloadURL(pathReference)
            .then((url) => {
              if (meta.contentType === "image/jpeg") {
                setImageUrl(url)
              } else {
                setAudioUrl(url)
              }
            });
          }, 1000);
        }
    });
  }

  const handleSubmit = function(event) {
    event.preventDefault();
    if (message === "") {
      alert("Please provide a reminder message");
      return
    }
    const time = formatTime(hour, minute, amPm)
    setDoc(doc(db, "reminders", time), {
      message: message,
      location: location,
      imageUrl: imageUrl,
      audioUrl: audioUrl
    }).then(() => {
      setMessage("");
      setLocation(location);
      ref_file.current.value = "";
      setTempImageUrl("");
      setImageUrl("");
      setAudioUrl("");
      alert("Set reminder: " + message + " for " + time);
    });
  }

  const handleImageAsFile = (e) => {
    const image = e.target.files[0]
    if (image) {
      setImageAsFile(imageFile => (image)) // Setting image as file 
      setTempImageUrl(URL.createObjectURL(image)) // For preview
    }
  }

  return (
    <>
    <header class="bg-gray-800">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl  text-white ">
        Schedule Reminders
      </h1>
    </div>
  </header>
      <form className="w-full max-w"
        onSubmit={ handleSubmit }
      >
        <div className="flex flex-wrap mx-6 my-8">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase text-gray-700 font-bold mb-2">
              Location
            </label>
            <div className="relative">
              <select className="block w-full form-input py-3 px-4 pr-8 shadow-md"
                      onChange={ (e) => setLocation(e.target.value) }
              >
                {
                  locations.map((location, idx) => (
                    <option key={idx}>
                      { location }
                    </option>
                  ))
                }
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
              <select className="form-input w-1/3 block py-3 mr-4 mb-3 text-center shadow-md" type="text" placeholder="00"
                value={ hour }
                onChange={ (e) => setHour(e.target.value) }
              >
                { hours.map((hr, idx) => (<option key={ idx } value={ hr }>{ hr }</option>))}
              </select>
              <p className="pt-2">:</p>
              <select className="form-input w-1/3 block py-3 mx-4 mb-3 text-center shadow-md" type="text" placeholder="00"
                value={ minute }
                onChange={ (e) => setMinute(e.target.value) }
              >
                { minutes.map((min, idx) => (<option key={ idx } value={ min }>{ min }</option>))}
              </select>
              <select className="form-input w-1/4 block py-3 mr mb-3 text-center shadow-md" type="text" placeholder="00"
                value={ amPm }
                onChange={ (e) => setAmPm(e.target.value) }
              >
                { dayShift.map((shift, idx) => (<option key={ idx } value={ shift }>{ shift }</option>))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap mx-6 mb-6">
          <div className="w-full px-3 mb-6 md:mb-0">
            <label className="block uppercase text-gray-700 font-bold mb-2">
              Message
            </label>
            <textarea className="form-input w-full h-32 block py-3 px-4 mb-3 shadow-md"
              placeholder="Enter reminder here"
              value={ message }
              onChange={ (e) => setMessage(e.target.value) }
            >
            </textarea>
          </div>
        </div>
        <div className="flex flex-wrap mx-6 my-6">
          <div className="w-5/12 px-3 mb-6 md:mb-0">
            <label className="block uppercase text-gray-700 font-bold mb-2">
              Image (Optional)
            </label>
            <input 
              ref={ref_file}
              type="file"
              onChange={handleImageAsFile}
            />
            {
              tempImageUrl === '' ?
              ''
              :
              <img src={tempImageUrl} alt="..." />
            }
            {imageUrl === "" ? "Awaiting image file..." : "Image upload success"}
          </div>
          <div className="w-7/12 px-3 mb-6 md:mb-0">
            <label className="block uppercase text-gray-700 font-bold mb-2">
              Audio (Optional)
            </label>
            <Recorder
              onChange={handleRecorderChange}
            >
            </Recorder>
            {audioUrl === "" ? "Awaiting Recording..." : "Upload Success"}
          </div>
        </div>

        <div className="justify-center flex flex-wrap mx-6 mb-6">
          <button className={`${ buttonColour } hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md`}
                  disabled={ isDisabled }
          >
            { buttonText }
          </button>
        </div>
      </form>
      <List></List>
    </>
  )
}
