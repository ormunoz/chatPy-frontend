import { useState, useEffect, useRef } from 'react'
import { Form, Button, ListGroup } from 'react-bootstrap'
import './App.css'
import { AiOutlineMessage, AiOutlineClose } from 'react-icons/ai'

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const chatBoxRef = useRef(null)
  const apiUrl = import.meta.env.VITE_API_URL;
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Envía la solicitud al backend
    const response = await fetch(`${apiUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({ message: input }),
    })

    if (!response.ok) {
      console.error('Error al obtener la respuesta del chat')
      return
    }

    const data = await response.json()
    const newMessage = { text: input, sender: 'user' }

    const responseMessage = { text: data.data.chatBotText, sender: 'ai' }

    if (data.data.status !== 200) {
      console.error('Error en la respuesta del backend')
    }

    setMessages([...messages, newMessage, responseMessage])
    setInput('')
  };

  const handleClear = () => {
    setMessages([{ text: '¡Hola! ¿En qué puedo ayudarte hoy?', sender: 'ai' }])
  };

  const toggleChat = () => {
    if (!isChatOpen) {
      setMessages([{ text: '¡Hola! ¿En qué puedo ayudarte hoy?', sender: 'ai' }])
    }
    setIsChatOpen(!isChatOpen)
  };

  const hasUserMessages = messages.some((msg) => msg.sender === 'user')

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {isChatOpen ? (
        <div className="chat-container">
          <div className="chat-header">
            <Button
              variant="light"
              onClick={toggleChat}
              className="btn-sm"
            >
              <AiOutlineClose size={14} />
            </Button>
          </div>
          <div className="chat-box" ref={chatBoxRef}>
            <ListGroup>
              {messages.map((msg, index) => (
                <ListGroup.Item key={index} className={msg.sender}>
                  {msg.text}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
          <div className="form-container">
            <div className="d-flex justify-content-between mb-2">
              <Button variant="secondary" onClick={handleClear} disabled={!hasUserMessages}>
                Limpiar
              </Button>
            </div>
            <Form onSubmit={handleSubmit} className="d-flex">
              <Form.Control
                type="text"
                placeholder="Escribe un mensaje..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button variant="primary" type="submit" className="ml-2">
                Enviar
              </Button>
            </Form>
          </div>
        </div>
      ) : (
        <div className="chat-icon" onClick={toggleChat}>
          <AiOutlineMessage size={30} />
        </div>
      )}
    </>
  );
}

export default App;
