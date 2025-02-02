import React from 'react'

type SectionProps = {
    label: string
    message: string
}

const Section = ({ label, message }: SectionProps) => {
  return (
    <div>
        <p className="text-sm front-medium">{label}</p>
        <p className="text-sm front-light">{message}</p>
    </div>
  )
}

export default Section