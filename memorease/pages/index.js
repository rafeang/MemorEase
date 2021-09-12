import React, { useState, useEffect } from "react";
import { db } from "../firebase/clientApp";
import { doc, onSnapshot } from "firebase/firestore";

export default function Board() {
	const[message, setMessage] = useState("")

	const messageListener = onSnapshot(doc(db, "message", "displayed"), (doc) => {
    setMessage(doc.data().body);
	})

	return (
		<div>
			<h1 className="p-5 m-5 text-9xl">{ message }</h1>
		</div>
	)
}
