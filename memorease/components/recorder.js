import React, { useState, useEffect, useRef } from "react";

export default function Recorder({onChange}) {
  const [recorder, setRecorder] = useState(null)
  const [playerSrc, setPlayerSrc] = useState(null)
  const [buttonStyle, setButtonStyle] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [recordedChunks, setRecordedChunks] = useState([])
  const [blob, setBlob] = useState(null)
  const [iconPath, setIconPath] = useState("")
  const options = {mimeType: 'audio/webm'}
  const recordSVG = "M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
  const stopSVG = "M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
  const audioRef = useRef()

  const initRecorder = function(stream) {
    let recorder = new MediaRecorder(stream, options);
    recorder.ondataavailable = function(e) {
      if (e.data.size > 0) {
        let chunks = recordedChunks;
        chunks.push(e.data);
        setRecordedChunks(chunks);
      }
    }
    recorder.onstop = function(e) {
      setButtonStyle("bg-green-300 hover:bg-green-500 font-medium p-3 rounded-full");
      setIconPath(recordSVG);;
      let blob = new Blob(recordedChunks)
      let url = URL.createObjectURL(blob);
      setBlob(blob)
      setPlayerSrc(url);
    }
    setRecorder(recorder);
  };

  const startRecording = function() {
      setIconPath(stopSVG);
      setButtonStyle("bg-red-400 font-medium p-3 rounded-full");
      setIsRecording(true);
      recorder.start();
  }

  const stopRecording = function() {
    setButtonStyle("bg-green-300 hover:bg-green-500 font-medium p-3 rounded-full");
    setIconPath(recordSVG);
    setIsRecording(false);
    recorder.stop();
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(initRecorder);
  }

  const clearRecorder = function(){
    window.location.reload(false);
  }

  useEffect(() => {
    setButtonStyle("bg-green-300 hover:bg-green-500 font-medium p-3 rounded-full");
    setIconPath(recordSVG);
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(initRecorder);
  },[])

  useEffect(() => {
    onChange(blob);
  }, [blob])

  return (
    <div className="flex flex-wrap">
      <button
        type="button"
        className={ `${buttonStyle} px-4 mr-5 content-center` }
        onClick={ !isRecording ? startRecording : stopRecording }
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d={ iconPath } clipRule="evenodd" />
        </svg>
      </button>
      <audio
        id="player"
        ref={ audioRef }
        src={ playerSrc }
        className="w-2/3 flex-grow"
        controls
      >
      </audio>
      { blob === null ? <></> : (
        <button
          type="button"
          className="bg-red-400 hover:bg-red-500 text-white font-bold w-full p-2 rounded-full my-3"
          onClick={ clearRecorder }
        >
          Clear Recording
        </button>
      ) }

    </div>
  );
}

