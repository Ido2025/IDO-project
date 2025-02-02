'use client'

import React, { useState } from 'react'

// Define the type for initial values
type InitialValuesProps = {
    currentStep: number
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>
}

// Initial values for the context
const InitialValues: InitialValuesProps = {
    currentStep: 1,
    setCurrentStep: () => undefined,
}

// Create the context with initial values
const authContext = React.createContext(InitialValues)

// Destructure the Provider from the context
const { Provider } = authContext

// Context Provider component to wrap the children components
export const AuthContextProvider = ({
    children,
}: {
    children: React.ReactNode
}) => {
    // State to manage the current step
    const [currentStep, setCurrentStep] = useState<number>(
        InitialValues.currentStep
    )

    // Values to be provided to the context consumers
    const values = {
        currentStep,
        setCurrentStep,
    }

    // Return the Provider component with the values
    return <Provider value={values}>{children}</Provider>
}

// Custom hook to use the auth context
export const useAuthContextHook = () => {
    // Access the context values
    const state = React.useContext(authContext)
    return state
}
