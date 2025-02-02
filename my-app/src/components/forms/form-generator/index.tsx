import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ErrorMessage } from '@hookform/error-message'
import React from 'react'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'

type Props = {
    type: 'text' | 'email' | 'password' // Type of the input field
    inputType: 'select' | 'input' | 'textarea' // Type of the form element
    options?: { value: string; label: string; id: string }[] // Options for select field
    label?: string // Label for the form element
    placeholder: string // Placeholder text for the form element
    register: UseFormRegister<any> // Register function from react-hook-form
    name: string // Name of the form field
    errors: FieldErrors<FieldValues> // Errors object from react-hook-form
    lines?: number // Number of lines for textarea
    form?: string // Form ID
    defaultValue?: string // Default value for the form element
}

const FormGenerator = ({
    errors,
    inputType,
    name,
    placeholder,
    defaultValue,
    register,
    type,
    form,
    label,
    lines,
    options,
}: Props) => {
    switch (inputType) {
        case 'input':
        default:
            return (
                <Label
                    className="flex flex-col gap-2"
                    htmlFor={`input-${label}`}
                >
                    {label && label} {/* Render the label if provided */}
                    <Input
                        id={`input-${label}`}
                        type={type}
                        placeholder={placeholder}
                        form={form}
                        defaultValue={defaultValue}
                        {...register(name)} // Register the input field
                    />
                    <ErrorMessage
                        errors={errors}
                        name={name}
                        render={({ message }) => (
                            <p className="text-red-400 mt-2">
                                {message === 'Required' ? '' : message} {/* Display the error message */}
                            </p>
                        )}
                    />
                </Label>
            )
        case 'select':
            return (
                <Label htmlFor={`select-${label}`}>
                    {label && label} {/* Render the label if provided */}
                    <select
                        form={form}
                        id={`select-${label}`}
                        {...register(name)} // Register the select field
                    >
                        {options?.length &&
                            options.map((option) => (
                                <option
                                    value={option.value}
                                    key={option.id}
                                >
                                    {option.label} {/* Render each option */}
                                </option>
                            ))}
                    </select>
                    <ErrorMessage
                        errors={errors}
                        name={name}
                        render={({ message }) => (
                            <p className="text-red-400 mt-2">
                                {message === 'Required' ? '' : message} {/* Display the error message */}
                            </p>
                        )}
                    />
                </Label>
            )
        case 'textarea':
            return (
                <Label
                    className="flex flex-col gap-2"
                    htmlFor={`input-${label}`}
                >
                    {label && label} {/* Render the label if provided */}
                    <Textarea
                        form={form}
                        id={`input-${label}`}
                        placeholder={placeholder}
                        {...register(name)} // Register the textarea field
                        rows={lines}
                        defaultValue={defaultValue}
                    />
                    <ErrorMessage
                        errors={errors}
                        name={name}
                        render={({ message }) => (
                            <p className="text-red-400 mt-2">
                                {message === 'Required' ? '' : message} {/* Display the error message */}
                            </p>
                        )}
                    />
                </Label>
            )
        defualt: return <></> // Return empty fragment if inputType is invalid
    }
}

export default FormGenerator
