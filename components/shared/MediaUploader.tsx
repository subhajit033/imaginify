'use client';
import React from 'react';
import { CldUploadWidget } from 'next-cloudinary';

import { Button } from '@/components/ui/button';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';

const MediaUploader = ({ onValueChange, image, setImage, publicId, type }) => {
  const { toast } = useToast();
  const onUploadSuccesshandler = () => {
    toast({
        title: 'image uploaded successfully',
        description: 'You have used 1 free credit',
        duration: 5000,
        className: 'success-toast'
    })
  };
  const onUploadErrorhandler = () => {
    toast({
        title: 'something went wrong!',
        description: 'lease try again',
        duration: 5000,
        className: 'error-toast'
    })
  };
  return (
    <CldUploadWidget
      uploadPreset='subha_imaginify'
      options={{ multiple: false, resourceType: 'image' }}
      onSuccess={onUploadSuccesshandler}
      onError={onUploadErrorhandler}
    ></CldUploadWidget>
  );
};

export default MediaUploader;
