import React from 'react';
import { Box, List, ListItem, Link, Text } from '@chakra-ui/react'; 

const FileList = ({ files }) => {
  return (
    <Box>
      <Text as="h2" fontSize="lg" fontWeight="bold" mb={4} color="gray.700">
        Uploaded Files
      </Text>
      <List spacing={3}>
        {files.map((file) => (
          <ListItem key={file.id} bg="gray.50" p={3} borderRadius="md" boxShadow="sm">
            <Link href={file.filepath} isExternal color="blue.500" fontWeight="medium">
              {file.filename}
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default FileList;
