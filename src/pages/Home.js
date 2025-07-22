import React , {useState} from 'react'
import {v4 as uuidv4} from 'uuid';
import toast from 'react-hot-toast';
import {useNavigate} from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    toast.success('Room created successfully');

  };

  const joinRoom = (e) => {
    e.preventDefault();
    if(!roomId || !username) {
      toast.error('Room ID and username are required');
      return;
    }
    //redirect
    navigate(`/editor/${roomId}`, {state: {username}});  //it means we can access the username after redicting to new page
  }

  const handleInputEnter = (e) => {
    if(e.code === 'Enter') {
      joinRoom(e);
    }
  }

  return (
    <div className='homePageWrapper'>
      <div className='formWrapper'>
        <img className='homePageLogo' src={require('../assets/logo.png')} alt="logo" />
        <h1>Welcome to the Editor</h1>
        <h4> Pick invitaion Room ID</h4>


        <div className='inputGroup'>
          <input type="text" 
          className='inputBox'
           placeholder='Room ID' 
           value={roomId} 
           onChange={(e) => setRoomId(e.target.value)}
           onKeyUp ={handleInputEnter} />


          <input type="text" 
          className='inputBox'
           placeholder='Username' 
           value={username} 
           onChange={(e) => setUsername(e.target.value)} 
           onKeyUp ={handleInputEnter}/>


          <button className='btn joinBtn' onClick={joinRoom}>Join</button>
          <span className='createInfo'>
            If you don't have an invite, you can create &nbsp;
            <a onClick={createNewRoom} href='' className='createNewBtn'>a new room</a>
          </span>
          
        </div>
      </div>
      <footer>
        <h4>Built with love by <a href='https://github.com/Aayushhh07'>Aayush</a></h4>
      </footer>
    </div>
  )
}

export default Home