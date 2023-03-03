import './App.css';
import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Input, Textarea, Button, Text, Progress } from '@chakra-ui/react';
import { FaWindowClose } from 'react-icons/fa';
import { humanFileSize } from './util.js';

const FAKE_UPLOAD_LENGTH = 60 * 1000; // 60 seconds
const AMOUNT_PER_INTERVAL = FAKE_UPLOAD_LENGTH / 190; // 190 * 0.5 = 95

const defaultFormState = {
  title: '',
  description: '',
  tags: '',
};

const defaultErrorState = {
  clipFile: false,
  title: false,
  description: false,
  tags: false,
};

function App() {
  const [uploading, setUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(false);
  const countRef = useRef(0);
  const [formErrors, setFormErrors] = useState(defaultErrorState);
  const [myFiles, setMyFiles] = useState([]);
  const onDrop = useCallback(
    (acceptedFiles) => {
      setMyFiles([...myFiles, ...acceptedFiles]);
    },
    [myFiles]
  );
  const removeAll = () => {
    if (uploading) return;
    setMyFiles([]);
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'video/*': ['.mp4', '.mkv', '.mov', '.avi'],
    },
  });
  const [clipFile] = myFiles;
  const [{ title, description, tags }, setFormState] = useState(defaultFormState);
  const clearFormState = () => {
    removeAll();
    setFormErrors();
    setFormState(defaultFormState);
    setFormErrors(defaultErrorState);
  };
  const updateFormState = (fieldName, text) => {
    setFormState({
      ...{ title, description, tags },
      [fieldName]: text,
    });
    setFormErrors({
      ...formErrors,
      [fieldName]: false,
    });
  };

  const increaseBarWidth = useCallback(() => {
    if (countRef.current < 95) {
      countRef.current = countRef.current + 0.5;
      setUploadPercent(countRef.current);
      setTimeout(increaseBarWidth, AMOUNT_PER_INTERVAL);
    }
  }, [countRef, setUploadPercent]);

  const startUploadAnimation = () => {
    countRef.current = 0;
    setUploadPercent(countRef.current);
    setUploading(true);
    increaseBarWidth();
  };

  const validateForm = () => {
    let errors = {
      clipFile: false,
      title: false,
      description: false,
      tags: false,
    };
    if (!clipFile) {
      errors.clipFile = 'You must select a clip to compress';
    }
    if (!title) {
      errors.title = 'You must set a title';
    }
    if (!description) {
      errors.description = 'You must set a description';
    }
    if (!tags) {
      errors.tags = 'You must set at least one tag';
    }
    setFormErrors({ ...errors });
    return Object.values(errors).filter((e) => e !== false).length === 0;
  };

  const submitForm = async () => {
    if (uploading) return;
    try {
      const validForm = validateForm();
      if (!validForm) return;

      startUploadAnimation();
      const formPayload = new FormData();
      formPayload.append('title', title);
      formPayload.append('description', description);
      formPayload.append('tags', tags);
      formPayload.append('clipFile', clipFile);

      const response = await fetch('http://localhost:8080/try-compress', {
        method: 'POST',
        body: formPayload,
      });
      if (response.ok) {
        countRef.current = 100;
        setUploadPercent(100);
        setTimeout(clearFormState, 1250);
      }
    } catch (e) {
      console.log('failed to compress.', e);
    } finally {
      setTimeout(() => setUploading(false), 1250);
    }
  };

  return (
    <div className="container">
      <img className="logo" src="/rat.png" alt="tarkov killa" />
      <Text fontSize="4xl">Rat Gamers Clip Compression</Text>
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        {uploading && (
          <div className="upload-container">
            <Progress colorScheme="orange" hasStripe value={uploadPercent} />
          </div>
        )}
        {clipFile ? (
          <div className={`selected-file ${uploading ? 'uploading' : ''}`}>
            <Text fontSize="md">
              {clipFile.path} - {humanFileSize(clipFile.size)}
            </Text>
            <FaWindowClose onClick={removeAll} />
          </div>
        ) : (
          <div {...getRootProps({ className: `dropzone ${formErrors.clipFile !== false ? 'error' : ''}` })}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop your clip here, or click to select a clip</p>
          </div>
        )}
        <Input
          disabled={uploading}
          value={title}
          onChange={(e) => updateFormState('title', e.target.value)}
          placeholder="Clip title"
          _hover={{ borderColor: 'orange.600' }}
          isInvalid={formErrors.title !== false}
          errorBorderColor="crimson"
        />
        <Textarea
          disabled={uploading}
          value={description}
          onChange={(e) => updateFormState('description', e.target.value)}
          placeholder="Clip description"
          _placeholder={{ color: 'orange.500' }}
          _hover={{ borderColor: 'orange.600' }}
          isInvalid={formErrors.description !== false}
          errorBorderColor="crimson"
        />
        <Input
          disabled={uploading}
          value={tags}
          onChange={(e) => updateFormState('tags', e.target.value)}
          placeholder="Clip tags"
          _hover={{ borderColor: 'orange.600' }}
          isInvalid={formErrors.tags !== false}
          errorBorderColor="crimson"
        />
        <Button disabled={uploading} isLoading={uploading} loadingText="Compressing..." onClick={submitForm} width="100%" variant="outline" colorScheme="orange">
          Compress
        </Button>
      </form>
    </div>
  );
}

export default App;
