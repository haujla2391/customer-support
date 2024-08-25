'use client'
import { Box, Stack, TextField, Button } from "@mui/material";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi I\'m the Headstarter Support Agent, how can I assist you today?',
    },
  ])

  const [message, setMessage] = useState('')

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    setMessage('')
    setMessages((messages) => [
      ...messages,
      {role:'user', content: message},
      {role:'assistant', content: ''}
    ])
    const response = fetch('/api/chat', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([...messages, {role: 'user', content: message}])
    }).then (async (res)=> {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let result = ''
      return reader.read().then(function processText({done, value}) {
        if (done) {
          return result
        }
        const text = decoder.decode (value || new Int8Array(), {stream:true})
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text,
            },
          ]
        })
        return reader.read().then(processText)
      })
    })
  }

  return (
    <Box 
      width="100vw" 
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundImage: `url('https://img.freepik.com/free-vector/hand-drawn-medical-background_23-2151334866.jpg?t=st=1723408979~exp=1723412579~hmac=a4dc286170525e5ddf876862cffc91e5e75be2760820dab9d713559fddd96a6c&w=1800')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Stack
        direction="column"
        width="500px"
        height="650px"
        border="1px solid #e0e0e0"
        borderRadius="10px"
        bgcolor="rgba(255, 255, 255, 0.9)"
        p={2}
        spacing={2}
      >
        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
          <img src="/betrhealth.jpeg" alt="BetrHealth Logo" height="70px" />
        </Box>
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          p={1}
        >
          {messages.map((message, index) => (
            <Box 
              key={index}
              display="flex" 
              justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
            >
              <Box 
                bgcolor={message.role === 'assistant' ? '#d269e6' : '#bff4fe'}
                color={message.role === 'assistant' ? 'white' : 'black'}
                borderRadius="16px"
                p={2}
                maxWidth="80%"
              >
                {message.content}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction="row" spacing={1}>
          <TextField
            label="Message"
            fullWidth
            variant="outlined"
            size="small"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'normal', 
            }}
          />
          <Button 
          variant="contained"
          onClick={sendMessage} 
          sx={{ bgcolor: "#d269e6",
          minWidth: '80px',
          '&:hover': {
            bgcolor: "#bff4fe !important",
            color: "#000000",
          }
          }}>
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
