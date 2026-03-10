import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff } from 'lucide-react';

export default function VideoCall() {
  const { roomId } = useParams();
  const { socket } = useSocket();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [status, setStatus] = useState('Initializing...');

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  const servers = {
    iceServers: [
      {
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
      },
    ],
  };

  useEffect(() => {
    if (!socket || !roomId || !user) return;

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        socket.emit('join-room', roomId, user.id);
        setStatus('Waiting for other participant...');

        socket.on('user-connected', async (userId) => {
          setStatus('User connected. Establishing connection...');
          createOffer();
        });

        socket.on('user-disconnected', () => {
          setStatus('User disconnected.');
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
          setRemoteStream(null);
          closePeerConnection();
        });

        socket.on('receive-message', (message: any) => {
           handleSignalingData(message);
        });

      } catch (err) {
        console.error('Error accessing media devices:', err);
        setStatus('Error accessing camera/microphone');
      }
    };

    init();

    return () => {
      localStream?.getTracks().forEach(track => track.stop());
      closePeerConnection();
      socket.off('user-connected');
      socket.off('user-disconnected');
      socket.off('receive-message');
    };
  }, [socket, roomId, user]);

  const closePeerConnection = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
  };

  const createPeerConnection = () => {
    if (peerConnection.current) return;

    peerConnection.current = new RTCPeerConnection(servers);

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit('send-message', { type: 'candidate', candidate: event.candidate }, roomId);
      }
    };

    peerConnection.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
      setStatus('Connected');
    };

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(track, localStream);
      });
    }
  };

  const createOffer = async () => {
    createPeerConnection();
    if (!peerConnection.current) return;

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket?.emit('send-message', { type: 'offer', offer }, roomId);
  };

  const createAnswer = async (offer: RTCSessionDescriptionInit) => {
    createPeerConnection();
    if (!peerConnection.current) return;

    await peerConnection.current.setRemoteDescription(offer);
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    socket?.emit('send-message', { type: 'answer', answer }, roomId);
  };

  const handleSignalingData = async (data: any) => {
    if (!peerConnection.current && data.type !== 'offer') return; // Wait for offer to init if receiver

    switch (data.type) {
      case 'offer':
        await createAnswer(data.offer);
        break;
      case 'answer':
        if (peerConnection.current) {
            await peerConnection.current.setRemoteDescription(data.answer);
        }
        break;
      case 'candidate':
        if (peerConnection.current) {
            await peerConnection.current.addIceCandidate(data.candidate);
        }
        break;
    }
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
      setIsVideoOff(!isVideoOff);
    }
  };

  const endCall = () => {
    navigate('/dashboard/appointments');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="flex-1 relative">
        {/* Remote Video */}
        <div className="absolute inset-0 flex items-center justify-center">
          {remoteStream ? (
             <video 
               ref={remoteVideoRef} 
               autoPlay 
               playsInline 
               className="w-full h-full object-cover"
             />
          ) : (
            <div className="text-white text-xl">{status}</div>
          )}
        </div>

        {/* Local Video */}
        <div className="absolute bottom-4 right-4 w-48 h-36 bg-black rounded-lg overflow-hidden border-2 border-gray-700 shadow-lg">
          <video 
            ref={localVideoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="h-20 bg-gray-800 flex items-center justify-center space-x-6">
        <button 
          onClick={toggleMute}
          className={`p-4 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-600 hover:bg-gray-500'}`}
        >
          {isMuted ? <MicOff className="text-white" /> : <Mic className="text-white" />}
        </button>
        
        <button 
          onClick={endCall}
          className="p-4 rounded-full bg-red-600 hover:bg-red-700"
        >
          <PhoneOff className="text-white" />
        </button>

        <button 
          onClick={toggleVideo}
          className={`p-4 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-gray-600 hover:bg-gray-500'}`}
        >
          {isVideoOff ? <VideoOff className="text-white" /> : <VideoIcon className="text-white" />}
        </button>
      </div>
    </div>
  );
}
