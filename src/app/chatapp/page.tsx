"use client";

import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

// const socket = io("http://localhost:4000/");
const socket = io("https://chatserver-q3gi.onrender.com/");

interface Message {
  username: string;
  message: string;
  sentByCurrentUser?: boolean;
  timestamp: string;
  room: string;
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [send, setSend] = useState("");
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [online, setonline] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on("message", (message) => {
      console.log(online);
      // setonline(socket.);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (send.trim() !== "" && username.trim() !== "" && room.trim() !== "") {
      const timestamp = getCurrentTime();
      const message: Message = { username, message: send, timestamp, room };
      socket.emit("message", message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...message, sentByCurrentUser: true },
      ]);
      setSend("");
    }
  }

  function handleJoinRoom(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (username.trim() !== "" && room.trim() !== "") {
      socket.emit("join", { username, room });
    }
  }

  return (
    <>
      <div>
        <h1 className="font-extrabold font-mono text-6xl mb-2 text-center text-violet-400">
          Global Private Chat {online}
        </h1>
        <div className="flex h-[80vh] ">
          <div
            ref={chatContainerRef}
            className={`border-2 border-white w-11/12 h-[100%] overflow-y-scroll `}
          >
            <ul className="text-2xl font-mono ">
              {messages.map((messageObj, index) => (
                <li
                  key={index}
                  className={`m-4 p-7 text-xl flex items-center rounded-3xl ${
                    messageObj.sentByCurrentUser
                      ? "bg-green-500 justify-end"
                      : "bg-orange-600 justify-start"
                  }`}
                >
                  <span className="font-bold text-center text-wrap ">
                    {messageObj.username} ({messageObj.timestamp}):
                  </span>
                  <p className="inline text-wrap">{messageObj.message}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex  justify-center items-center border-2 border-wihte  pl-32 ">
            <div className="flex flex-col justify-center items-center">
              <form onSubmit={handleJoinRoom} className=" items-center flex">
                <input
                  className="text-white text-xl border-2 border-x-white bg-black placeholder:text-gray-400 w-[25rem] rounded-3xl h-[5rem] p-4 mt-5 focus:outline-none"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your Username"
                />
                <input
                  className="text-white text-xl border-2 border-x-white bg-black placeholder:text-gray-400 w-[25rem] rounded-3xl h-[5rem] p-4 mt-5 focus:outline-none"
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="Room Name"
                />

                <button
                  className="text-white text-xl mx-auto border-y-rose-50 border-2 bg-black rounded-lg px-4 py-2 block mt-5"
                  type="submit"
                >
                  Join Room
                </button>
              </form>

              <form onSubmit={handleSubmit} className="">
                <input
                  className="text-white text-xl border-2 border-x-white bg-black placeholder:text-gray-400 w-[25rem] rounded-3xl h-[5rem] p-4 mt-5 focus:outline-none"
                  type="text"
                  value={send}
                  onChange={(e) => setSend(e.target.value)}
                  placeholder="Type your message"
                />

                <button
                  className="text-white text-xl mx-auto border-y-rose-50 border-2 bg-black rounded-lg px-4 py-2 block mt-5"
                  type="submit"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// import React, { useEffect, useState, useRef } from "react";
// import { io } from "socket.io-client";

// // const socket = io("http://localhost:4000/");
// const socket = io("https://chatserver-q3gi.onrender.com/");

// interface Message {
//   username: string;
//   message: string;
//   sentByCurrentUser?: boolean;
//   timestamp: string;
//   room: string;
// }

// export default function Page() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [send, setSend] = useState("");
//   const [username, setUsername] = useState("");
//   const [room, setRoom] = useState("");
//   const [online, setOnline] = useState<number>(0);
//   const chatContainerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     socket.on("message", (message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     return () => {
//       socket.off("message");
//       // socket.off("onlineUsers");
//     };
//   }, []);

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop =
//         chatContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   function getCurrentTime() {
//     const now = new Date();
//     const hours = now.getHours().toString().padStart(2, "0");
//     const minutes = now.getMinutes().toString().padStart(2, "0");
//     return `${hours}:${minutes}`;
//   }

//   function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     if (send.trim() !== "" && username.trim() !== "" && room.trim() !== "") {
//       const timestamp = getCurrentTime();
//       const message: Message = { username, message: send, timestamp, room };
//       socket.emit("message", message);
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { ...message, sentByCurrentUser: true },
//       ]);
//       setSend("");
//     }
//   }

//   function handleJoinRoom(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     socket.on("onlineUsers", (online) => {
//       setOnline(online);
//     });
//     if (username.trim() !== "" && room.trim() !== "") {
//       socket.emit("join", { username, room });
//     }
//   }

//   return (
//     <>
//       <div>
//         <h1 className="font-extrabold font-mono text-6xl mb-2 text-center text-violet-400">
//           Global Private Chat ({online} online users)
//         </h1>
//         <div className="flex h-[80vh] ">
//           <div
//             ref={chatContainerRef}
//             className={`border-2 border-white w-11/12 h-[100%] overflow-y-scroll `}
//           >
//             <ul className="text-2xl font-mono ">
//               {messages.map((messageObj, index) => (
//                 <li
//                   key={index}
//                   className={`m-4 p-7 text-xl flex items-center rounded-3xl ${
//                     messageObj.sentByCurrentUser
//                       ? "bg-green-500 justify-end"
//                       : "bg-orange-600 justify-start"
//                   }`}
//                 >
//                   <span className="font-bold text-center text-wrap ">
//                     {messageObj.username} ({messageObj.timestamp}):
//                   </span>
//                   <p className="inline text-wrap">{messageObj.message}</p>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="flex  justify-center items-center border-2 border-wihte  pl-32 ">
//             <div className="flex flex-col justify-center items-center">
//               <form onSubmit={handleJoinRoom} className=" items-center flex">
//                 <input
//                   className="text-white text-xl border-2 border-x-white bg-black placeholder:text-gray-400 w-[25rem] rounded-3xl h-[5rem] p-4 mt-5 focus:outline-none"
//                   type="text"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   placeholder="Your Username"
//                 />
//                 <input
//                   className="text-white text-xl border-2 border-x-white bg-black placeholder:text-gray-400 w-[25rem] rounded-3xl h-[5rem] p-4 mt-5 focus:outline-none"
//                   type="text"
//                   value={room}
//                   onChange={(e) => setRoom(e.target.value)}
//                   placeholder="Room Name"
//                 />

//                 <button
//                   className="text-white text-xl mx-auto border-y-rose-50 border-2 bg-black rounded-lg px-4 py-2 block mt-5"
//                   type="submit"
//                 >
//                   Join Room
//                 </button>
//               </form>

//               <form onSubmit={handleSubmit} className="">
//                 <input
//                   className="text-white text-xl border-2 border-x-white bg-black placeholder:text-gray-400 w-[25rem] rounded-3xl h-[5rem] p-4 mt-5 focus:outline-none"
//                   type="text"
//                   value={send}
//                   onChange={(e) => setSend(e.target.value)}
//                   placeholder="Type your message"
//                 />

//                 <button
//                   className="text-white text-xl mx-auto border-y-rose-50 border-2 bg-black rounded-lg px-4 py-2 block mt-5"
//                   type="submit"
//                 >
//                   Send Message
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
