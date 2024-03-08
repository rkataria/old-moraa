/* eslint-disable jsx-a11y/label-has-associated-control */

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  Textarea,
  Button,
} from '@nextui-org/react'

import { useAuth } from '@/hooks/useAuth'
import { EventService } from '@/services/event.service'
import { useModal } from '@/stores/use-modal-store'
import { styles } from '@/styles/form-control'

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required.',
  }),
  description: z.string().optional(),
})

export function CreateEventModal() {
  const router = useRouter()
  const { isOpen, onClose, type } = useModal()
  const isModalOpen = isOpen && type === 'createEvent'

  const { currentUser } = useAuth()
  const createEventMutation = useMutation({
    mutationFn: EventService.createEvent,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!currentUser) return

    // eslint-disable-next-line consistent-return
    return createEventMutation.mutateAsync(
      {
        name: values.name,
        description: values.description || '',
        type: 'course', // formData.get("type"),
        owner_id: currentUser.id,
        start_date: null,
        end_date: null,
      },
      {
        onSuccess: ({ data }) => {
          if (data) {
            form.reset()
            onClose()
            router.push(`/events/${data.id}`)
          }
        },
      }
    )
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Modal size="2xl" isOpen={isModalOpen} onClose={handleClose}>
      <ModalHeader>
        <h2 className="text-lg font-bold">Create a new event</h2>
        <p>Give your event a name and an optional description to get going!</p>
      </ModalHeader>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="font-md text-gray-800 font-semibold">New Event</h2>
              <p className="text-gray-500 text-sm font-normal">
                Give your event a name and an optional description to get going!
              </p>
            </ModalHeader>
            <ModalBody>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div>
                  <div>
                    <label htmlFor="name" className={styles.label.base}>
                      Name
                    </label>
                    <Input
                      id="name"
                      disabled={isLoading}
                      className="focus-visible:ring-0 text-black focus-visible:ring-offset-0 placeholder:text-gray-400"
                      placeholder="Your awesome course or workshop name goes here"
                      {...form.register('name', {
                        required: 'Name is required.',
                      })}
                    />
                    {form.formState.errors.name && (
                      <p className="text-destructive text-xs mt-1">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="mt-4">
                    <label className={styles.label.base}>Description</label>
                    <Textarea
                      placeholder="This is what your learners would see. You could include high-level learning objectives or brief course overview here"
                      className="focus-visible:ring-0 text-black focus-visible:ring-offset-0 placeholder:text-gray-400"
                      {...form.register('description')}
                    />
                    {form.formState.errors.description && (
                      <p className="text-destructive text-xs mt-1">
                        {form.formState.errors.description.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end items-center mt-8 mb-4">
                  <Button
                    type="submit"
                    color="primary"
                    disabled={isLoading}
                    isLoading={isLoading}>
                    Create
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
