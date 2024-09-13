/* eslint-disable jsx-a11y/label-has-associated-control */
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
} from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '../ui/Button'

import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { ProfileService } from '@/services/profile.service'
import { styles } from '@/styles/form-control'

const formSchema = z.object({
  first_name: z.string().min(1, {
    message: 'First Name is required.',
  }),
  last_name: z.string().min(1, {
    message: 'Last Name is required.',
  }),
})

export function NamesForm({
  isEdit = false,
  show = false,
  closeHandler,
}: {
  isEdit?: boolean
  show?: boolean
  closeHandler?: () => void
}) {
  const router = useRouter()
  const user = useAuth()
  const {
    data: profile,
    isLoading: isLoadingProfile,
    isRequiredNames,
    refetch,
  } = useProfile()

  const updateProfileMutation = useMutation({
    mutationFn: ProfileService.updateProfile,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: profile?.first_name as string,
      last_name: profile?.last_name as string,
    },
  })

  const isLoading = form.formState.isSubmitting
  const isUserId = typeof user?.currentUser?.id === 'string'
  const isOpenModal = isUserId && isRequiredNames

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const variables = {
      userId: user.currentUser.id,
      payload: {
        first_name: values.first_name,
        last_name: values.last_name,
      },
    }

    return updateProfileMutation.mutateAsync(variables, {
      onSuccess: ({ data }) => {
        if (data) {
          form.reset()
          if (isEdit) {
            refetch()
            closeHandler?.()

            return
          }
          router.navigate({ to: '/events' })
        }
      },
    })
  }

  if ((!isEdit && !isOpenModal) || isLoadingProfile) {
    return null
  }

  return (
    <Modal
      size="2xl"
      isOpen={isEdit ? show : true}
      onClose={closeHandler}
      hideCloseButton={!isEdit}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Give Details
            </ModalHeader>
            <ModalBody>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div>
                  <div>
                    <label htmlFor="first_name" className={styles.label.base}>
                      First Name
                    </label>
                    <Input
                      id="first_name"
                      defaultValue={profile?.first_name}
                      disabled={isLoading}
                      className="focus-visible:ring-0 text-black focus-visible:ring-offset-0 placeholder:text-gray-400"
                      placeholder="First Name"
                      {...form.register('first_name', {
                        required: 'First Name is required.',
                      })}
                    />
                    {form.formState.errors.first_name && (
                      <p className="text-destructive text-xs mt-1">
                        {form.formState.errors.first_name.message}
                      </p>
                    )}
                  </div>

                  <div className="mt-2">
                    <label htmlFor="last_name" className={styles.label.base}>
                      Last Name
                    </label>
                    <Input
                      id="last_name"
                      defaultValue={profile?.last_name}
                      disabled={isLoading}
                      className="focus-visible:ring-0 text-black focus-visible:ring-offset-0 placeholder:text-gray-400"
                      placeholder="Last Name"
                      {...form.register('last_name', {
                        required: 'First Name is required.',
                      })}
                    />
                    {form.formState.errors.last_name && (
                      <p className="text-destructive text-xs mt-1">
                        {form.formState.errors.last_name.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end items-center mt-8 mb-4">
                  <Button
                    size="sm"
                    type="submit"
                    color="primary"
                    disabled={isLoading}
                    isLoading={isLoading}>
                    Save
                  </Button>
                </div>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
