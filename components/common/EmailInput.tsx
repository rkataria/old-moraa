import { KeyboardEvent } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { AiOutlineUsergroupAdd } from 'react-icons/ai'
import { TbChevronDown } from 'react-icons/tb'
import * as yup from 'yup'

import { Input, Button, Chip } from '@nextui-org/react'

import { DropdownActions } from './DropdownActions'

import { roles } from '@/utils/roles'

const schema = yup.object().shape({
  email: yup.string().email(),
  role: yup.string().required(),
})

interface EmailInputProps {
  onEnter: (email: string, role: string) => void
  onInvite: (email: string, role: string) => void
  isInviteLoading?: boolean
}

export function EmailInput({
  onEnter,
  onInvite,
  isInviteLoading = false,
}: EmailInputProps) {
  const { control, handleSubmit, setValue, setError } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: '', role: 'Participant' },
  })

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(({ email, role }: { email?: string; role: string }) => {
        if (email) {
          onEnter(email, role)
          setValue('email', '')
        }
      })()
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
    if (email) {
      onInvite(email, role)
      setValue('email', '')
    }
  }

  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div className="flex items-start w-full border pr-[0.375rem]">
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              type="email"
              placeholder="Enter email address here"
              labelPlacement="outside"
              variant="flat"
              startContent={
                <AiOutlineUsergroupAdd className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              onKeyDown={handleKeyPress}
              errorMessage={fieldState.error?.message}
              isInvalid={!!fieldState.error}
              classNames={{
                inputWrapper: 'bg-transparent shadow-none',
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
        onClick={handleSubmit(onInviteSubmit)}>
        Invite People
      </Button>
    </div>
  )
}
