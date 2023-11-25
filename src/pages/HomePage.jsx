// HomePage.js
import React, { useState } from "react";
import io from "socket.io-client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NewSidebar from "../components/NewSidebar";
import ChatArea from "../components/ChatArea";
import UseSocketReply from "../hooks/useSocketReply";
import useFetchData from "../hooks/UseFetchData";
import UseSelectedQuestions from "../hooks/UseSelectedQuestions";
// import UseCopyTo from "../hooks/useCopyTo";

const socket = io("https://chatbotbackend-zsp1.onrender.com");

const HomePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sendMessage = () => {
    try{
      const userMessage = { content: inputMessage, sender: "user" };
      setConversation([...conversation, userMessage]);
      setLoading(true);
      socket.emit("message", { message: inputMessage });
      setInputMessage("");
    } catch(err){
      console.log(err);
    }

  };
  const BACKEND_URL="https://chatbotbackend-zsp1.onrender.com/user/getData"
  const { data } = useFetchData(
    BACKEND_URL,
    conversation
  );
  const { handleLiClick } = UseSelectedQuestions(
    data,
    setConversation,
    setIsSidebarOpen
  );
  // const { copyToClipboard } = UseCopyTo();
  UseSocketReply(socket, setConversation, setLoading, conversation);

  return (
    <div>
     

      <NewSidebar data={data} handleLiClick={handleLiClick} isSidebarOpen={isSidebarOpen}/>

      <ChatArea
        conversation={conversation}
        inputMessage={inputMessage}
        sendMessage={sendMessage}
        setInputMessage={setInputMessage}
        loading={loading}
        // copyToClipboard={copyToClipboard}
      />

      <div
        id="open-btn"
        className="block md:hidden fixed text-white text-2xl cursor-pointer top-4 left-4"
        onClick={toggleSidebar}
      >
        &#x02261;
      </div>
    </div>
  );
};

export default HomePage;
