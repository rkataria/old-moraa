/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */

import { useState } from 'react'

import { Image, Input } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useLocation, useRouter } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Controller, useForm } from 'react-hook-form'
import { FaCheck } from 'react-icons/fa6'
import { IoIosCheckmarkCircle } from 'react-icons/io'
import userflow from 'userflow.js'
import * as z from 'zod'

import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { ProfileService } from '@/services/profile.service'
import { styles } from '@/styles/form-control'
import { UserType } from '@/types/common'

const formSchema = z.object({
  first_name: z.string().min(1, {
    message: 'First Name is required.',
  }),
  last_name: z.string().min(1, {
    message: 'Last Name is required.',
  }),
})

export const Route = createFileRoute('/onboarding/')({
  component: () => <OnboardingPage />,
})

const UserTypes = [
  {
    title: 'Educator',
    role: UserType.EDUCATOR,
    image: '/images/creator.png',

    description:
      'As a Educator, you can design courses, host live sessions, and share your content with learners.',
    benefits: [
      'Create and manage your own courses',
      'Host live sessions with learners',
      'Access advanced content creation tools',
      'Manage a dedicated workspace',
      'Invite and manage members',
    ],
  },
  {
    title: 'Learner',

    role: UserType.LEARNER,

    image: '/images/learner.png',

    description:
      'As a Learner, you can access courses, participate in live sessions, and enhance your knowledge.',
    benefits: [
      'Access a variety of courses',
      'Participate in live learning sessions',
      'Track your learning progress',
      'Engage with creators and peers',
      'Personalized learning experience',
    ],
  },
]

export function OnboardingPage() {
  const [userType, setUserType] = useState(UserType.LEARNER)
  const router = useRouter()
  const { currentUser } = useAuth()
  const location = useLocation()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { redirect, firstName, lastName, userPersona } = location.search as any

  const namesForm = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
    },
  })

  const updateProfileMutation = useMutation({
    mutationFn: ProfileService.updateProfile,
  })

  const isLoading = namesForm.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const variables = {
      userId: currentUser.id,
      payload: {
        first_name: values.first_name,
        last_name: values.last_name,
      },
    }

    return updateProfileMutation.mutateAsync(variables, {
      onSuccess: ({ data }) => {
        if (data) {
          namesForm.reset()

          if (userflow.isIdentified()) {
            // Update userflow with first and last name
            userflow.updateUser({
              first_name: values.first_name,
              last_name: values.last_name,
            })
          }

          if (userPersona) {
            router.navigate({
              search: {
                userPersona,
                firstName: false,
                lastName: false,
                redirect,
              },
            })

            return
          }
          router.navigate({ to: redirect })
        }
      },
    })
  }

  const handleContinue = () => {
    updateProfileMutation.mutateAsync(
      { userId: currentUser.id, payload: { user_type: userType } },
      {
        onSuccess: ({ data }) => {
          if (data) {
            if (userflow.isIdentified()) {
              // Update userflow with user type
              userflow.updateUser({ user_type: userType })
            }

            router.navigate({ to: redirect })
          }
        },
      }
    )
  }
  const renderForm = () => {
    if (firstName || lastName) {
      return (
        <>
          <div className="grid gap-4">
            <p className="font-semibold text-2xl text-center text-black/80">
              Tell us about yourself
            </p>
          </div>
          <form
            onSubmit={namesForm.handleSubmit(onSubmit)}
            className="w-[23rem]">
            <div>
              <label htmlFor="first_name" className={styles.label.base}>
                First Name
              </label>
              <Controller
                control={namesForm.control}
                name="first_name"
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    defaultValue=""
                    disabled={isLoading}
                    className="focus-visible:ring-0 text-black focus-visible:ring-offset-0 placeholder:text-gray-400"
                    placeholder="First Name"
                    isInvalid={!!fieldState.error?.message}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />
            </div>
            <div className="mt-2">
              <label htmlFor="last_name" className={styles.label.base}>
                Last Name
              </label>
              <Controller
                control={namesForm.control}
                name="last_name"
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    defaultValue=""
                    disabled={isLoading}
                    className="focus-visible:ring-0 text-black focus-visible:ring-offset-0 placeholder:text-gray-400"
                    placeholder="Last Name"
                    isInvalid={!!fieldState.error?.message}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />
            </div>
            <div className="flex justify-center items-center mt-8 mb-4">
              <Button
                size="md"
                type="submit"
                color="primary"
                disabled={isLoading}
                isLoading={isLoading}>
                Save
              </Button>
            </div>
          </form>
        </>
      )
    }
    if (userPersona) {
      return (
        <>
          <div className="grid gap-4">
            <p className="font-semibold text-2xl text-center text-black/80">
              How are you planning to use Moraa?
            </p>
            <p className="text-sm text-center text-black/60">
              We&apos;ll fit the experience to your needs.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {UserTypes.map((user) => (
              <div
                key={user.role}
                className="relative rounded-3xl p-0.5 shadow-sm overflow-hidden cursor-pointer"
                style={{
                  background:
                    userType === user.role
                      ? 'linear-gradient(107.56deg, rgb(181, 10, 193) 0%, rgb(137, 47, 255) 100%)'
                      : '',
                }}>
                <div
                  className="flex bg-white items-center gap-8 p-8 rounded-[22px]"
                  onClick={() => setUserType(user.role)}>
                  <span>
                    <RenderIf isTrue={userType === user.role}>
                      <IoIosCheckmarkCircle
                        size={20}
                        className="text-green-400 absolute right-4 top-4"
                      />
                    </RenderIf>
                  </span>

                  <Image
                    src={user.image}
                    className="w-[80px] h-[80px] rounded-none"
                  />
                  <div>
                    <p className="font-semibold text-xl">{user.title}</p>
                    <div className="mt-3 flex flex-col gap-1">
                      {user.benefits.map((benefit) => (
                        <p
                          key={benefit}
                          className="flex items-center text-xs gap-2">
                          <FaCheck />
                          {benefit}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full flex justify-center">
            <Button
              size="md"
              color="primary"
              className="w-fit"
              isLoading={updateProfileMutation.isPending}
              onClick={handleContinue}>
              Continue
            </Button>
          </div>
        </>
      )
    }

    return null
  }

  return (
    <div className="h-screen w-screen grid place-items-center">
      <motion.div
        key={firstName || lastName ? 'nameForm' : 'userTypeForm'}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-8">
        {renderForm()}
      </motion.div>
    </div>
  )
}
