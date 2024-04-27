import React from 'react'

const page = ({params}:{params:{type: string}}) => {
  return (
    <div>page - {params.type}</div>
  )
}

export default page