import { useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'
import { LiaHandshake } from 'react-icons/lia'

import { MoraaLogo } from '@/components/common/MoraaLogo'
import { cn } from '@/utils/utils'

const termsData = [
  {
    title: 'MORAA, INC. PRIVATE BETA AGREEMENT',
    content: [
      'This Private Beta Agreement ("Agreement") is entered into by and between Moraa, Inc. ("Moraa," "we," "us," or "our") and the undersigned user (“User,” “you,” or “your”). By participating in Moraa’s Private Beta, you agree to be bound by the terms of this Agreement.',
    ],
  },
  {
    title: 'Introduction',
    content: [
      'This Agreement governs your use of Moraa’s web application ("Platform") during the Private Beta phase ("Beta"), which will be available to you for free for the purpose of testing and providing feedback.',
      'The Beta phase allows trainers or facilitators ("Trainers"), participants ("Participants"), and other users required to manage learning events ("Event Managers") to use the Platform to create, host, or participate in virtual learning events.',
    ],
  },
  {
    title: 'Term',
    content: [
      'The Beta will be available for a period of 60 days, or until Moraa terminates the Beta phase. You may host at least one live virtual learning event during this period at no cost.',
      'Moraa reserves the right to end or extend the Beta period at its discretion. If the Beta is extended beyond the initial 60-day period, we may introduce a paid version of the Platform, and you will be notified in advance.',
    ],
  },
  {
    title: 'Access and Use',
    content: [
      'The Platform may be incomplete or contain bugs, errors, or other issues that may affect functionality.',
      'You agree that the Platform is provided "as-is" and "as-available" without any warranties.',
      'You understand that Moraa does not guarantee the availability of the Platform beyond the Beta period, and it may be terminated or transitioned into a paid version.',
    ],
  },
  {
    title: 'Feedback',
    content: [
      'We expect your active participation in providing feedback. Your insights are crucial in refining this Beta version and delivering an optimal experience for Trainers, Participants, and Event Managers.',
      'By providing feedback, you grant Moraa a royalty-free, perpetual, irrevocable, and transferable right to use, modify, share, and incorporate such feedback into our products and marketing materials.',
      'You agree that any feedback you provide may be used for improving the Platform and for promoting Moraa’s services.',
    ],
  },
  {
    title: 'Preferential Pricing',
    content: [
      'As a token of our appreciation for your participation in the Beta program, you will receive preferential pricing on future paid products and services offered by Moraa, Inc.. The specific terms and conditions of the preferential pricing, including any discounts or other benefits, will be communicated to you separately.',
    ],
  },
  {
    title: 'Data Usage',
    content: [
      'Your use of the Platform during the Beta phase is subject to our Privacy Policy. By using the Platform, you agree that we may collect and use certain information related to your usage for product improvements and marketing purposes.',
      'Moraa will not share personal data with third parties without your consent unless required by law.',
    ],
  },
  {
    title: 'Limitation of Liability',
    content: [
      'To the maximum extent permitted by law, Moraa shall not be liable for any damages arising out of or in connection with your use of the Platform, including but not limited to any direct, indirect, incidental, special, or consequential damages, even if Moraa has been advised of the possibility of such damages.',
      'The Platform is provided on a trial basis, and Moraa’s total liability for any claim under this Agreement shall not exceed the amount you paid (if any) to access the Platform during the Beta period.',
    ],
  },
  {
    title: 'Termination',
    content: [
      'Moraa reserves the right to terminate this Agreement and your access to the Platform at any time, with or without cause, during the Beta phase.',
      'Upon termination, you agree to stop using the Platform immediately.',
    ],
  },
  {
    title: 'Governing Law',
    content: [
      'This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law principles.',
    ],
  },
  {
    title: 'Entire Agreement',
    content: [
      'This Agreement constitutes the entire agreement between you and Moraa regarding the Beta and supersedes any prior agreements or understandings.',
    ],
  },
]

function TermsAndConditions() {
  const [scrollToId, setScrollToId] = useState(termsData[1].title)

  return (
    <div>
      <MoraaLogo color="primary" className="p-4 fixed top-0 left-0" />
      <div className="px-10 mx-auto py-10 grid grid-cols-[0.2fr_1fr] items-start gap-40 pt-[6rem]">
        <div className="sticky top-20 grid">
          {termsData.slice(1).map((section) => (
            <a
              className={cn('py-2 min-w-max duration-300 pl-6 border-l-3', {
                'text-primary font-medium border-primary':
                  scrollToId === section.title.replace(' ', '-'),
              })}
              href={`#${section.title.replace(' ', '-')}`}
              onClick={() => setScrollToId(section.title.replace(' ', '-'))}>
              {section.title}
            </a>
          ))}
        </div>

        <div className="grid gap-8 max-w-4xl">
          <div className="relative bg-gradient-to-r from-primary to-[#e9e9d2] p-10 rounded-t-xl">
            <p className="text-3xl text-white">Terms and conditions</p>
            <p className="text-white/40 mt-4">Last updated at Nov 18, 2024</p>

            <LiaHandshake
              size={160}
              className="absolute bottom-[-1.5rem] right-0 z-2 rotate-45 text-white/30"
            />
          </div>
          {termsData.map((section) => (
            <div key={section.title} id={section.title.replace(' ', '-')}>
              <p className="text-2xl font-semibold text-black/80 mb-2">
                {section.title}
              </p>
              {Array.isArray(section.content) ? (
                <ul className="list-disc grid gap-4 pl-6">
                  {section.content.map((item) => (
                    <li>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{section.content}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/terms/')({
  component: () => <TermsAndConditions />,
})
