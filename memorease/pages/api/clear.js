// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from "../../firebase/clientApp";
import { doc, updateDoc } from "firebase/firestore";

export default function handler(req, res) {
  updateDoc(doc(db, "message", "displayed"), {
    body: "",
    location: "",
    imageUrl: "",
    audioUrl: ""
  });
  res.status(200).json({ message: 'Message board cleared.' })
}
