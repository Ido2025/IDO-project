import { currentUser } from '@clerk/nextjs'
import React from 'react'

type Props = {}

const page = async (props: Props) => {
    const user = await currentUser()
  return (
    <div>page</div>
  )
}

export default page