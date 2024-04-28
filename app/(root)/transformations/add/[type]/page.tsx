import React from 'react';
import Header from '@/components/shared/Header';
import { transformationTypes } from '@/constants';
import TransformationForm from '@/components/shared/TransformationForm';
import { auth } from '@clerk/nextjs/server';
import { getUserById } from '@/lib/actions/user.action';

const page = async ({ params }: { params: { type: string } }) => {
  //it is a object de-structuring we have get it by same name
  const { userId } = auth();
  const user = await getUserById(userId as string);
  const type: string = params.type;
  const transformation = transformationTypes[type as TransformationTypeKey];
  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />
      <section className='mt-10'>
      <TransformationForm
      //as we are in add page so action is add
        action='Add'
        userId={user._id}
        type={transformation.type as TransformationTypeKey}
        creditBalance={user.creditBalance}
      />
      </section>
    </>
  );
};

export default page;
