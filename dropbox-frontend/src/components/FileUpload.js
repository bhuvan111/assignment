import React, { useState } from 'react';
import { Box, Button, Input, Text } from '@chakra-ui/react'; 
import axios from 'axios';

const FileUpload = ({ onFileUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://127.0.0.1:8000/uploadfile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('File uploaded successfully', response.data);

      
      onFileUpload();
    } catch (error) {
      console.error('Error uploading file', error);
    }
  };

  return (
    <Box mb={6}>
      <Text fontWeight="bold" mb={2}>Upload a File</Text>
      <Input
        type="file"
        onChange={handleFileChange}
        mb={3}
        size="md"
        borderColor="blue.400"
      />
      <Button
        colorScheme="blue"
        onClick={handleFileUpload}
        disabled={!selectedFile}
        size="md"
        px={6}
      >
        Upload
      </Button>
    </Box>
  );
};

export default FileUpload;
