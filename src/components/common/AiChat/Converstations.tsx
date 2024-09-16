import { motion } from 'framer-motion'
import * as marked from 'marked'

import { useStoreSelector } from '@/hooks/useRedux'
import { cn } from '@/utils/utils'

export function Converstations() {
  const { messages, loading } = useStoreSelector((state) => state.ai.chat)

  const createMarkup = (content: string) => {
    if (!content) {
      return { __html: '' }
    }

    return { __html: marked.marked(content) }
  }

  const renderLoading = () => {
    if (!loading) return null

    return (
      <div className="relative flex items-center gap-1">
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: 10 }}
          transition={{
            duration: 2,
            type: 'spring',
            repeat: Infinity,
            ease: 'easeInOut',
            repeatType: 'loop',
            delay: 0,
          }}
          className="h-[.625rem] w-[.625rem] rounded-full bg-indigo-700"
        />
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: 10 }}
          transition={{
            duration: 2,
            type: 'spring',
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
            delay: 0.1,
          }}
          className="h-[.625rem] w-[.625rem] rounded-full bg-indigo-700"
        />

        <motion.div
          initial={{ y: 0 }}
          animate={{ y: 10 }}
          transition={{
            duration: 2,
            type: 'spring',
            repeat: Infinity,
            ease: 'easeInOut',
            repeatType: 'loop',
            delay: 0.2,
          }}
          className="h-[.625rem] w-[.625rem] rounded-full bg-indigo-700"
        />
      </div>
    )
  }

  return (
    <div className="grid gap-4 px-4 pb-20">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {messages.map((message: any) => (
        <div
          key={message.id}
          className={cn(
            'relative rounded-lg flex items-center before:absolute before:bottom-0 before:w-0 before:h-0 before:border-b-[10px] before:border-x-[10px] before:border-x-transparent before:border-solid',
            {
              'flex justify-end before:border-b-primary before:bottom-0 before:-right-[9px] bg-primary text-white max-w-[70%] ml-auto':
                message.role === 'user',
              'before:border-b-gray-100 before:bottom-0 before:-left-[9px] bg-gray-100 max-w-[70%]':
                message.role !== 'user',
            }
          )}>
          {message.status === 'processing' ? (
            <div className="pl-2">
              <svg
                width="38"
                height="38"
                viewBox="0 0 38 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <motion.path
                  animate={{ scale: [0.9, 1, 0.9] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'easeInOut',
                    delay: 0.5,
                  }}
                  d="M17.2679 9.59583C17.973 7.5325 20.8239 7.47001 21.6599 9.40836L21.7306 9.59701L22.6821 12.3796C22.9001 13.0177 23.2525 13.6016 23.7154 14.092C24.1783 14.5824 24.7411 14.9678 25.3656 15.2222L25.6215 15.3177L28.404 16.268C30.4673 16.9731 30.5298 19.824 28.5927 20.66L28.404 20.7307L25.6215 21.6822C24.9831 21.9001 24.3989 22.2524 23.9083 22.7154C23.4177 23.1783 23.0322 23.7411 22.7776 24.3657L22.6821 24.6204L21.7318 27.4041C21.0267 29.4674 18.1758 29.5299 17.341 27.5928L17.2679 27.4041L16.3176 24.6216C16.0997 23.9832 15.7474 23.399 15.2844 22.9084C14.8215 22.4178 14.2587 22.0323 13.6341 21.7777L13.3794 21.6822L10.5969 20.7319C8.53236 20.0268 8.46987 17.1759 10.4082 16.3411L10.5969 16.268L13.3794 15.3177C14.0176 15.0997 14.6015 14.7473 15.0919 14.2844C15.5823 13.8215 15.9677 13.2588 16.2221 12.6342L16.3176 12.3796L17.2679 9.59583Z"
                  fill="url(#paint0_linear_1309_28)"
                />
                <motion.path
                  animate={{
                    scale: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'easeInOut',
                  }}
                  d="M8.14968 4.60793C8.41828 3.8219 9.50436 3.7981 9.82281 4.53652L9.84976 4.60838L10.2122 5.6684C10.2953 5.9115 10.4295 6.13396 10.6059 6.32077C10.7822 6.50758 10.9966 6.6544 11.2345 6.75133L11.332 6.78771L12.392 7.14973C13.178 7.41833 13.2018 8.5044 12.4639 8.82285L12.392 8.8498L11.332 9.21227C11.0888 9.29528 10.8663 9.42949 10.6794 9.60587C10.4925 9.78221 10.3456 9.9966 10.2486 10.2346L10.2122 10.3316L9.85021 11.392C9.58161 12.1781 8.49553 12.2019 8.17753 11.4639L8.14968 11.392L7.78766 10.332C7.70464 10.0889 7.57043 9.86629 7.39408 9.6794C7.21772 9.4925 7.00333 9.34563 6.76537 9.24865L6.66835 9.21227L5.60833 8.85025C4.82185 8.58165 4.79805 7.49558 5.53647 7.17758L5.60833 7.14973L6.66835 6.78771C6.91145 6.70464 7.13391 6.5704 7.32072 6.39405C7.50753 6.2177 7.65435 6.00333 7.75128 5.76542L7.78766 5.6684L8.14968 4.60793Z"
                  fill="#743EE4"
                />
                <motion.path
                  animate={{ scale: [1, 0.2, 1] }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'easeInOut',
                  }}
                  d="M29.1497 27.6079C29.4183 26.8219 30.5044 26.7981 30.8228 27.5365L30.8498 27.6084L31.2122 28.6684C31.2953 28.9115 31.4295 29.134 31.6059 29.3208C31.7822 29.5076 31.9966 29.6544 32.2345 29.7513L32.332 29.7877L33.392 30.1497C34.178 30.4183 34.2018 31.5044 33.4639 31.8229L33.392 31.8498L32.332 32.2123C32.0888 32.2953 31.8663 32.4295 31.6794 32.6059C31.4925 32.7822 31.3456 32.9966 31.2486 33.2346L31.2122 33.3316L30.8502 34.392C30.5816 35.1781 29.4955 35.2019 29.1775 34.4639L29.1497 34.392L28.7877 33.332C28.7046 33.0889 28.5704 32.8663 28.3941 32.6794C28.2177 32.4925 28.0033 32.3456 27.7654 32.2487L27.6684 32.2123L26.6083 31.8502C25.8219 31.5817 25.798 30.4956 26.5365 30.1776L26.6083 30.1497L27.6684 29.7877C27.9114 29.7046 28.1339 29.5704 28.3207 29.3941C28.5075 29.2177 28.6544 29.0033 28.7513 28.7654L28.7877 28.6684L29.1497 27.6079Z"
                  fill="#743EE4"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_1309_28"
                    x1="17.5"
                    y1="8"
                    x2="21.5"
                    y2="31.0001"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7D26CD" />
                    <stop offset="1" stopColor="#B28CFF" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          ) : (
            ''
          )}
          <div
            className={cn('text-sm px-4 py-3 rounded-md tracking-tight', {
              'text-right self-end': message.role === 'user',
              ' text-gray-800 text-left self-start': message.role !== 'user',
              'pl-2': message.status === 'processing',
            })}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={createMarkup(message.content)}
          />
        </div>
      ))}
      {renderLoading()}
    </div>
  )
}
