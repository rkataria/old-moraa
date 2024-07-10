/* eslint-disable react-refresh/only-export-components */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react'

import { PiSquaresFourLight } from 'react-icons/pi'
import { SiGoogleclassroom } from 'react-icons/si'
import { TbUsersGroup } from 'react-icons/tb'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Card,
  CardBody,
  ModalFooter,
  Button,
} from '@nextui-org/react'

import { TwoWayNumberCounter } from './content-types/Canvas/FontSizeControl'

import { cn } from '@/utils/utils'

interface IBreakoutType {
  name: string
  icon: React.ReactNode
  description: string
  breakoutType: BREAKOUT_TYPES
  disabled?: boolean
  templateType?: CANVAS_TEMPLATE_TYPES
}

export enum CANVAS_TEMPLATE_TYPES {
  BLANK = 'Blank',
  TEMPLATE_ONE = 'Template One',
  TEMPLATE_TWO = 'Template Two',
  TEMPLATE_THREE = 'Template Three',
}

export enum BREAKOUT_TYPES {
  GROUPS = 'groups',
  ROOMS = 'rooms',
}

export const breakoutTypes: IBreakoutType[] = [
  {
    name: 'Groups',
    icon: (
      <TbUsersGroup
        className="w-full h-full max-w-11 max-h-11"
        width={60}
        height={60}
      />
    ),
    description:
      'Split up participants into randomised groups automatically with no of participants per group',
    breakoutType: BREAKOUT_TYPES.GROUPS,
    templateType: CANVAS_TEMPLATE_TYPES.BLANK,
  },
  {
    name: 'Rooms',
    icon: <SiGoogleclassroom className="w-full h-full max-w-11 max-h-11" />,
    description:
      'You can allocate participants or let them choose based on the specific no of rooms',
    breakoutType: BREAKOUT_TYPES.ROOMS,
    templateType: CANVAS_TEMPLATE_TYPES.TEMPLATE_ONE,
  },
]

interface ChooseContentTypeProps {
  open: boolean
  onClose: () => void
  onChoose: (
    contentType: BREAKOUT_TYPES,
    breakoutRoomsGroupsCount?: number,
    breakoutRoomsGroupsTime?: number
  ) => void
}

export function BreakoutTypePicker({
  open,
  onClose,
  onChoose,
}: ChooseContentTypeProps) {
  const [selectedBreakoutType, setSelectedBreakoutType] =
    useState<BREAKOUT_TYPES>(BREAKOUT_TYPES.GROUPS)

  const [breakoutRoomsGroupsCount, setBreakoutRoomsGroupsCount] =
    useState<number>(1)

  const [breakoutRoomsGroupsTime, setBreakoutRoomsGroupsTime] =
    useState<number>(5)

  const onSubmit = () => {
    onChoose(
      selectedBreakoutType,
      breakoutRoomsGroupsCount,
      breakoutRoomsGroupsTime
    )
  }

  return (
    <Modal size="lg" isOpen={open} onClose={onClose} className="bg-white">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-full bg-[#FCFAFF] flex items-center justify-center">
                    <span className="p-2 bg-[#E9D8FD] flex items-center rounded-full text-[#6947C3]">
                      <PiSquaresFourLight height={36} width={36} />
                    </span>
                  </span>
                  <h3 className="font-semibold text-xl text-black">
                    Create Breakout Rooms
                  </h3>
                </div>
              </div>
            </ModalHeader>
            <ModalBody className="p-6">
              {/* New section for Cards */}
              <div className="w-full mt-2">
                <div className="grid grid-cols-2 gap-4">
                  {breakoutTypes.map((breakoutType) => (
                    <Card
                      shadow="sm"
                      key={breakoutType.breakoutType}
                      isPressable
                      onPress={() => {
                        if (!breakoutType.disabled) {
                          setSelectedBreakoutType(breakoutType.breakoutType)
                        }
                      }}
                      className={cn(
                        'hover:border hover:border-[#6947C3] border border-gray-100 flex-col items-start ',
                        {
                          'bg-[#E9D8FD]':
                            breakoutType.breakoutType === selectedBreakoutType,
                          'bg-gray-100':
                            breakoutType.breakoutType !== selectedBreakoutType,
                        }
                      )}>
                      <CardBody className="p-2.5 flex flex-col place-items-center justify-center w-full gap-4 text-center">
                        <div className="w-full flex items-center justify-center">
                          <span className="p-1 rounded-full bg-[#E9D8FD] flex items-center">
                            <span className="flex items-center bg-[#B695F4] p-2 rounded-full text-[#E9D8FD]">
                              {breakoutType.icon}
                            </span>
                          </span>
                        </div>
                        <h3 className="mt-2 font-semibold text-md w-full ">
                          {breakoutType.name}
                        </h3>
                        <p className="text-sm mt-1 w-full font-normal">
                          {breakoutType.description}
                        </p>
                        <span>No of {breakoutType.breakoutType}</span>
                        <span
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}>
                          <TwoWayNumberCounter
                            defaultCount={1}
                            onCountChange={(count) =>
                              setBreakoutRoomsGroupsCount(count)
                            }
                            isDisabled={
                              selectedBreakoutType !== breakoutType.breakoutType
                            }
                            noNegative
                          />
                        </span>
                        <span>Duration</span>
                        <span
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}>
                          <TwoWayNumberCounter
                            defaultCount={5}
                            incrementStep={5}
                            postfixLabel="min"
                            onCountChange={(count) =>
                              setBreakoutRoomsGroupsTime(count)
                            }
                            noNegative
                            isDisabled={
                              selectedBreakoutType !== breakoutType.breakoutType
                            }
                          />
                        </span>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="flex !justify-center">
              <div className="flex items-center justify-center">
                <Button
                  variant="bordered"
                  color="default"
                  className="mr-2"
                  onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  variant="solid"
                  onClick={onSubmit}
                  className="flex gap-2">
                  Create
                  <SiGoogleclassroom
                    className="text-white"
                    height={12}
                    width={12}
                  />
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
