import { ReactElement, useEffect, useRef, useState } from 'react'

import { Button, Chip, Input } from '@heroui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import isEqual from 'lodash.isequal'
import {
  Control,
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form'
import { BsThreeDotsVertical, BsTrash3 } from 'react-icons/bs'
import { TbChevronDown } from 'react-icons/tb'
import * as yup from 'yup'

import { DropdownActions } from './DropdownActions'
import { EmailInput } from './EmailInput'
import { UserAvatar } from './UserAvatar'

import { useUserContext } from '@/hooks/useAuth'
import { roles } from '@/utils/roles'
import { cn } from '@/utils/utils'

const participantsActions = [
  {
    key: 'delete',
    label: 'Delete',
    icon: <BsTrash3 className="h-4 w-4 text-red-500" />,
  },
]

function getAllIndexes<T>(arr: Array<T>, val: T) {
  const indexes = []
  let i = -1
  // eslint-disable-next-line no-cond-assign
  while ((i = arr.indexOf(val, i + 1)) !== -1) {
    indexes.push(i)
  }

  return indexes
}

const participantsListValidationSchema = yup
  .array(
    yup.object({
      participantId: yup.string(),
      isHost: yup.boolean(),
      role: yup.string().required(),
      inQueue: yup.boolean().optional(),
      isDeleted: yup.boolean().optional(),
      email: yup
        .string()
        .email()
        .test({
          name: 'unique-email',
          test(email, context) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const currentIndex = context.options.index
            const allParticipants: string[] =
              context.from?.[1].value?.participants?.map(
                (p: { email: string }) => p.email
              ) || []
            const indexes = getAllIndexes(allParticipants, email)
            if (indexes.length !== 1 && indexes[0] === currentIndex) return true

            return indexes.length === 1
          },
          message: 'Email addresses must be unique',
        })
        .label('Participant email')
        .required(),
    })
  )
  .required()

const participantsValidationSchema = yup.object({
  participants: participantsListValidationSchema,
})

export type ParticipantsFormData = yup.InferType<
  typeof participantsValidationSchema
>
export type AddParticipantsFormProps<
  FormData extends ParticipantsFormData = ParticipantsFormData,
> = {
  defaultValue?: FormData['participants']
  onParticipantRemove?: (email: string) => Promise<void>
} & (
  | {
      formControl?: Control<FormData>
      onSubmit?: void
      renderAction?: void
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      addParticipantsMutation: any
    }
  | {
      formControl?: never
      onSubmit?: (participants: FormData) => void
      /**
       * The action is responsible for triggering the `onSubmit` handler
       * so a least one of the button rendered using the `renderAction` should have `type="submit"`
       * @returns {ReactElement}
       */
      renderAction?: ({ showActions }: { showActions: boolean }) => ReactElement
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      addParticipantsMutation: any
    }
)

export function AddParticipantsForm<
  FormData extends ParticipantsFormData = ParticipantsFormData,
>({
  formControl,
  defaultValue,
  onSubmit,
  renderAction,
  onParticipantRemove,
  addParticipantsMutation,
}: AddParticipantsFormProps<FormData>) {
  const userProfile = useUserContext()
  const [showActions, setShowActions] = useState(false)
  const participantsForm = useForm<ParticipantsFormData>({
    resolver: yupResolver(participantsValidationSchema),
    defaultValues: {
      participants: defaultValue || [
        {
          participantId: userProfile.currentUser.id,
          email: userProfile.currentUser.email,
          isHost: true,
        },
      ],
    },
  })
  const fakeDeleteParticipantMutation = useMutation({
    mutationFn: async (id: string) => onParticipantRemove?.(id),
  })

  const control = (formControl ||
    participantsForm.control) as Control<ParticipantsFormData>

  const participantsFieldArray = useFieldArray({
    control,
    name: 'participants',
  })

  const prevDefaultValue = useRef<FormData['participants'] | undefined>(
    undefined
  )

  useEffect(() => {
    if (isEqual(defaultValue, prevDefaultValue.current)) return

    const newArray = participantsFieldArray.fields
      .filter((emailItem) => !emailItem.isDeleted)
      .map((emailItem) => {
        const isInDefaultValue = defaultValue?.find(
          (e) => e.email === emailItem.email
        )
        if (isInDefaultValue) {
          return isInDefaultValue
        }

        return emailItem
      })

    participantsForm.reset({
      participants: newArray,
    })

    prevDefaultValue.current = defaultValue
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue, participantsFieldArray.fields])

  const deleteParticipant = async ({
    participantId,
    isHost = false,
    index,
  }: {
    participantId: string
    isHost: boolean
    index: number
  }) => {
    participantsFieldArray.update(index, {
      ...participantsFieldArray.fields[index],
      isDeleted: true,
    })
    if (participantId && !isHost) {
      await fakeDeleteParticipantMutation.mutateAsync(participantId)
    }

    participantsFieldArray.remove(index)
  }

  const FormContentJSX = (
    <div>
      {participantsFieldArray.fields.map((arrayField, index) => (
        <div
          className={cn('flex items-center mb-2 pb-2 justify-between', {
            'border-b': participantsFieldArray.fields.length - 1 !== index,
          })}>
          <Controller
            key={arrayField.id}
            control={control}
            name={`participants.${index}.email`}
            render={({ field, fieldState }) => (
              <Input
                disabled={arrayField.isHost}
                value={field.value}
                startContent={
                  <UserAvatar
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    profile={(arrayField as any).profile}
                    avatarProps={{
                      size: 'sm',
                      className: 'min-w-8',
                      radius: 'sm',
                    }}
                  />
                }
                onChange={(e) => {
                  field.onChange(e)
                  setShowActions(true)
                }}
                size="sm"
                variant="flat"
                classNames={{
                  base: 'flex-1 max-w-[76%] !opacity-100',
                  inputWrapper: 'bg-transparent shadow-none',
                  innerWrapper: 'gap-2',
                  input: 'font-medium',
                }}
                errorMessage={fieldState.error?.message}
                isInvalid={!!fieldState.error}
              />
            )}
          />

          {arrayField.isHost ? (
            <Chip variant="flat" size="md" className="rounded-md">
              owner
            </Chip>
          ) : (
            <Controller
              name={`participants.${index}.role`}
              control={control}
              render={({ field }) => (
                <div className="mt-[5px]">
                  <DropdownActions
                    triggerIcon={
                      <Chip
                        variant="flat"
                        size="md"
                        endContent={<TbChevronDown />}
                        className="cursor-pointer rounded-md">
                        {field.value || arrayField.role}
                      </Chip>
                    }
                    actions={roles}
                    onAction={(e) => {
                      field.onChange(e)
                      setShowActions(true)
                    }}
                  />
                </div>
              )}
            />
          )}

          {!arrayField.isHost ? (
            <DropdownActions
              triggerIcon={
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  radius="full"
                  isLoading={
                    arrayField?.inQueue ||
                    (fakeDeleteParticipantMutation.isPending &&
                      arrayField.participantId ===
                        fakeDeleteParticipantMutation.variables)
                  }>
                  <BsThreeDotsVertical />
                </Button>
              }
              actions={participantsActions}
              onAction={(actionKey) => {
                if (actionKey === 'delete') {
                  deleteParticipant({
                    participantId: arrayField.participantId!,
                    isHost: arrayField?.isHost || false,
                    index,
                  })
                }
              }}
            />
          ) : (
            <div />
          )}
        </div>
      ))}

      {renderAction?.({ showActions })}
    </div>
  )

  return (
    <div>
      <EmailInput
        onEnter={(emails: string[], role: string) => {
          const newParticipants = emails.map((email) => ({
            email,
            role,
          }))
          participantsFieldArray.append(newParticipants)

          setShowActions(true)
        }}
        onInvite={(emails: string[], role: string) => {
          const newParticipants = emails.map((email) => ({
            email,
            role,
            inQueue: true,
          }))

          participantsFieldArray.append(newParticipants)

          addParticipantsMutation.mutate({
            participants: [
              ...participantsFieldArray.fields,
              ...newParticipants,
            ],
            closeonSave: false,
          })
        }}
      />
      {onSubmit ? (
        <form
          onSubmit={participantsForm.handleSubmit(
            onSubmit as SubmitHandler<ParticipantsFormData>
          )}>
          {FormContentJSX}
        </form>
      ) : (
        FormContentJSX
      )}
    </div>
  )
}
