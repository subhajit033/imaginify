'use client';
import React, { useState, useTransition } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  aspectRatioOptions,
  defaultValues,
  transformationTypes,
} from '@/constants';
import { CustomField } from './CustomField';
import { AspectRatioKey, debounce, deepMergeObjects } from '@/lib/utils';
import MediaUploader from './MediaUploader';
import TransformedImage from './TransformedImage'

export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string().optional(),
});

const TransformationForm = ({
  data = null,
  action,
  type,
  userId,
  creditBalance,
}: TransformationFormProps) => {
  const transformationType = transformationTypes[type];
  const [image, setImage] = useState(data);
  const [newTransformation, setNewTransformation] =
    useState<Transformations | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformationConfig, setTransformationConfig] = useState(false);

  const [isPending, startTransition] = useTransition();

  const initialsValue =
    data && action === 'Update'
      ? {
          title: data?.title,
          aspectRatio: data?.aspectRatio,
          color: data?.color,
          prompt: data?.prompt,
          publicId: data?.publicId,
        }
      : defaultValues;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialsValue,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  const handleTransformation = () => {
    setIsTransforming(true);
    setTransformationConfig(
      deepMergeObjects(newTransformation, transformationConfig)
    );
    setNewTransformation(null);
    startTransition(async () => {
      //await updateUserCredits()
    });
  };

  const onSelectHandler = (
    value: string,
    onChangeField: (value: string) => void
  ) => {
    const imageSize = aspectRatioOptions[value as AspectRatioKey];

    setImage((prevState: any) => ({
      ...prevState,
      aspectRatio: imageSize.aspectRatio,
      width: imageSize.width,
      height: imageSize.height,
    }));
    setNewTransformation(transformationType.config);
    return onChangeField(value);
  };

  const onChangeHandler = (
    fieldName: string,
    value: string,
    type: string,
    onChangeField: (value: string) => void
  ) => {
    //for every key pressing we don't want to call the api, that's why we have introduced debouncing
    debounce(() => {
      setNewTransformation((prevState: any) => ({
        ...prevState,
        [type]: {
          ...prevState?.[type],
          [fieldName === 'prompt' ? 'prompt' : 'to']: value,
        },
      }));
      return onChangeField(value);
    }, 1000);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <CustomField
          control={form.control}
          name='title'
          formLabel='Image Title'
          className='w-full'
          render={({ field }) => <Input {...field} className='input-field' />}
        />
        {type === 'fill' && (
          <CustomField
            control={form.control}
            name='aspectRatio'
            formLabel='Aspect Ratio'
            className='w-full'
            render={({ field }) => {
              return (
                <Select
                  onValueChange={(value: any) =>
                    //field.onChange is pass in the functoion to change the input
                    onSelectHandler(value, field.onChange)
                  }
                >
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Select Size' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select Size</SelectLabel>
                      {/* here keys are 1:1 , 3:4, 9:16  */}
                      {Object.keys(aspectRatioOptions).map((key) => {
                        return (
                          <SelectItem key={key} value={key}>
                            {aspectRatioOptions[key as AspectRatioKey].label}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              );
            }}
          />
        )}
        {(type === 'remove' || type === 'recolor') && (
          <div className='promt-field'>
            <CustomField
              control={form.control}
              name='prompt'
              formLabel={
                type === 'recolor' ? 'Object to recolor' : 'Object to Remove'
              }
              className='w-full'
              render={({ field }) => (
                <Input
                  className='input-field'
                  value={field.value}
                  //this onChange is the function of react
                  onChange={(e) =>
                    onChangeHandler(
                      'prompt',
                      e.target.value,
                      type,
                      //and this onChange is come from react-hook-form to update the value
                      //of form
                      field.onChange
                    )
                  }
                />
              )}
            />
            {type === 'recolor' && (
              <CustomField
                name='color'
                formLabel='Replacement Color'
                control={form.control}
                className='w-full'
                render={({ field }) => (
                  <Input
                    className='input-field'
                    value={field.value}
                    onChange={(e) =>
                      onChangeHandler(
                        'color',
                        e.target.value,
                        'recolor',
                        field.onChange
                      )
                    }
                  />
                )}
              />
            )}
          </div>
        )}

        <div className='media-uploader-field'>
          <CustomField
            control={form.control}
            name='publicId'
            className='flex size-full flex-col'
            render={({ field }) => {
              return (
                <MediaUploader
                  onValueChange={field.onChange}
                  image={image}
                  setImage={setImage}
                  publicId={field.value}
                  type={type}
                />
              );
            }}
          />
        </div>

        <div className='flex flex-col gap-4'>
          <Button
            type='button'
            disabled={isTransforming || newTransformation === null}
            className='submit-button capitalize'
            onClick={handleTransformation}
          >
            {isTransforming ? 'transforming..' : 'Apply Transformation'}
          </Button>
          <Button
            type='submit'
            disabled={isSubmitting}
            className='submit-button capitalize'
          >
            {isSubmitting ? 'submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TransformationForm;
