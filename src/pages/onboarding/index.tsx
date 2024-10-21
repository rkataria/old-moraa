/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react'

import { Image } from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useLocation, useRouter } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { FaCheck } from 'react-icons/fa6'
import { IoIosCheckmarkCircle } from 'react-icons/io'

import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { ProfileService } from '@/services/profile.service'
import { UserType } from '@/types/common'

export const Route = createFileRoute('/onboarding/')({
  component: () => <OnboardingPage />,
})

const UserTypes = [
  {
    title: 'Creator',
    role: UserType.CREATOR,
    image: '/images/website-creator.png',

    description:
      'As a Creator, you can design courses, host live sessions, and share your content with learners.',
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

    image: '/images/student.png',

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

  const { redirect } = location.search as {
    redirect: string
  }

  const updateProfileMutation = useMutation({
    mutationFn: ProfileService.updateProfile,
  })

  const handleContinue = () => {
    updateProfileMutation.mutateAsync(
      { userId: currentUser.id, payload: { user_type: userType } },
      {
        onSuccess: ({ data }) => {
          if (data) {
            router.navigate({ to: redirect })
          }
        },
      }
    )
  }

  return (
    <div className="h-screen w-screen grid place-items-center">
      <motion.div
        initial={{ x: 30 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-8">
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
                      <p className="flex items-center text-xs gap-2">
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
            onClick={handleContinue}>
            Continue
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
