import { KeyboardEvent, useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { Input, Button, Chip } from '@nextui-org/react'
import { useForm, Controller } from 'react-hook-form'
import { AiOutlineUsergroupAdd } from 'react-icons/ai'
import { TbChevronDown } from 'react-icons/tb'
import * as yup from 'yup'

import { DropdownActions } from './DropdownActions'

import { roles } from '@/utils/roles'

const schema = yup.object().shape({
  email: yup.string(),
  role: yup.string().required(),
})

interface EmailInputProps {
  onEnter: (email: string[], role: string) => void
  onInvite: (email: string[], role: string) => void
  isInviteLoading?: boolean
}

const getEmailsList = (emailString: string) => {
  const emailList = emailString.split(',').map((email) => email.trim())
  const invalidEmails = emailList.filter(
    (email) => !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+$/.test(email)
  )

  return { emailList, invalidEmails }
}

export function EmailInput({
  onEnter,
  onInvite,
  isInviteLoading = false,
}: EmailInputProps) {
  const [showError, setShowError] = useState(true)
  const { control, handleSubmit, setValue, setError } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: '', role: 'Participant' },
  })

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setShowError(true)

      handleSubmit(({ email, role }: { email?: string; role: string }) => {
        if (email) {
          const { emailList, invalidEmails } = getEmailsList(email)

          if (invalidEmails.length > 0) {
            setError('email', {
              type: 'manual',
              message: `Invalid email(s): ${invalidEmails.join(', ')}`,
            })

            return
          }
          onEnter(emailList, role)
          setValue('email', '')
        }
      })()
    } else {
      setShowError(false)
    }
  }

  const onInviteSubmit = ({
    email,
    role,
  }: {
    email?: string
    role: string
  }) => {
    if (!email) {
      setError('email', {
        type: 'manual',
        message: 'Email is required',
      })

      return
    }
    const { emailList, invalidEmails } = getEmailsList(email)

    if (invalidEmails.length > 0) {
      setError('email', {
        type: 'manual',
        message: `Invalid email(s): ${invalidEmails.join(', ')}`,
      })

      return
    }

    if (email) {
      onInvite(emailList, role)
      setValue('email', '')
    }
  }

  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div className="flex items-start w-full border rounded-lg pr-[0.375rem]">
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              type="email"
              placeholder="Enter emails (comma-separated)"
              labelPlacement="outside"
              variant="flat"
              startContent={
                <AiOutlineUsergroupAdd className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              onKeyDown={handleKeyPress}
              errorMessage={showError && fieldState.error?.message}
              isInvalid={showError && !!fieldState.error}
              classNames={{
                inputWrapper: '!bg-transparent shadow-none',
                helperWrapper: 'py-0 absolute bottom-[2.8125rem]',
              }}
            />
          )}
        />

        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <div className="mt-[5px]">
              <DropdownActions
                triggerIcon={
                  <Chip
                    variant="light"
                    size="md"
                    endContent={<TbChevronDown />}
                    className="cursor-pointer rounded-md">
                    {field.value}
                  </Chip>
                }
                actions={roles}
                onAction={field.onChange}
              />
            </div>
          )}
        />
      </div>

      <Button
        color="primary"
        variant="solid"
        isLoading={isInviteLoading}
        className="min-w-fit"
        onClick={() => {
          setShowError(true)
          handleSubmit(onInviteSubmit)()
        }}>
        Invite
      </Button>
    </div>
  )
}
