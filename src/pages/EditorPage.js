import React, {useState, useRef, useEffect} from 'react'
import Client from '../components/Client';
import Editor from '../components/Editor';
import logo from '../assets/logo.png';
import { initSocket } from '../socket';
import ACTIONS from '../Actons';
import {useLocation, useNavigate, Navigate, useParams} from 'react-router-dom';
import toast from 'react-hot-toast';

const EditorPage = () => {
  const socketRef = useRef(null);
  const location = useLocation();
  const {roomId} = useParams();
  const reactNavigate = useNavigate(); 
  const codeRef = useRef("");

  const [clients , setClients] = useState([
    
  ]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err) => { handleError(err) });
      socketRef.current.on('connect_failed', (err) => { handleError(err) });

      function handleError(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed");
        reactNavigate('/');
      }

      socketRef.current.emit(ACTIONS.JOIN,{
        roomId,
        username: location.state?.username
      });

      //listen for joined
      socketRef.current.on(ACTIONS.JOINED, ({clients, username, socketId})=>{
        console.log('Received clients:', clients);
        // Only show toast if the joining user is not yourself
        if (socketId !== socketRef.current.id) {
          toast.success(`${username} joined the room`);
        }
        setClients(
          clients.filter(
            (client, index, self) =>
              index === self.findIndex((c) => c.socketId === client.socketId)
          )
        );
        // If you are the new user, request code sync from another user
        if (socketRef.current.id === socketId) {
          if (clients.length > 1) {
            // Pick the first client that is not yourself
            const otherClient = clients.find(c => c.socketId !== socketId);
            if (otherClient) {
              socketRef.current.emit(ACTIONS.SYNC_CODE, {
                socketId: socketRef.current.id,
              });
            }
          }
        }
      })

      // Listen for SYNC_CODE and respond with your code
      socketRef.current.on(ACTIONS.SYNC_CODE, ({ socketId }) => {
        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          socketId,
          code: codeRef.current,
        });
      });

      //listen for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({socketId, username})=>{
        toast.success(`${username} left the room.`);
        setClients((prev)=>{
          return prev.filter((client)=>client.socketId !== socketId);
        });
      })

      // Listen for code changes and update codeRef
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        codeRef.current = code;
      });

      // Remove the listener for username taken error
      // socketRef.current.on('error-username-taken', ({ message }) => {
      //   toast.error(message);
      //   reactNavigate('/');
      // });
    }
    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
        socketRef.current.off(ACTIONS.CODE_CHANGE);
        socketRef.current.off(ACTIONS.SYNC_CODE);
      }
    };

  }, []);

  const handleCodeChange = (code) => {
    codeRef.current = code;
    if (socketRef.current) {
      socketRef.current.emit(ACTIONS.CODE_CHANGE, {
        roomId,
        code,
      });
    }
  };

  async function copyRoomId(){
    try{
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied to clipboard");
    }
    catch(err){
      toast.error("Failed to copy room ID");
    }
  }

  function leaveRoom(){
    reactNavigate('/');
  }

  if (!location.state){
    return <Navigate to="/" />;
  }
  return (
    <div className='mainWrap'>
      <div className='aside'>
        <div className='asideInner'>
          <div className='logo'>
            <img
              className='logoImage'
              src={logo}
              alt='logo'
            />
          </div>
          <h3>Connected</h3>
          <div className='clientList'>
            {clients.map((client) => (
              <Client
                key={client.socketId}
                username={client.username}
              />
            ))}
          </div>
        </div>
        <div className="asideBottom">
          <button className='btn copyBtn' onClick = {copyRoomId}>Copy ROOM ID</button>
          <button className='btn leaveBtn' onClick = {leaveRoom}>Leave</button>
        </div>
      </div>
      <div className='editorWrap'> 
        <Editor 
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={handleCodeChange}
        />
      </div>
    </div>
  )
}

export default EditorPage