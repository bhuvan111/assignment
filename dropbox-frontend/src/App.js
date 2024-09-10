import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import axios from 'axios';
import { Box, Heading, Container } from '@chakra-ui/react'; 

function App() {
  const [files, setFiles] = useState([]);

  // Fetch files from the backend
  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/files/');
      setFiles(response.data);  
    } catch (error) {
      console.error('Error fetching files', error);
    }
  };

  
  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <Box bg="gray.100" minHeight="100vh" py={10}>  {}
      <Container
        maxW="container.md"
        p={6}
        bg="white"
        boxShadow="xl"
        borderRadius="md"
      >
        <Heading as="h1" size="xl" mb={6} textAlign="center" color="blue.600">
          Simplified Dropbox
        </Heading>
        <FileUpload onFileUpload={fetchFiles} />
        <FileList files={files} />
      </Container>
    </Box>
  );
}

export default App;
