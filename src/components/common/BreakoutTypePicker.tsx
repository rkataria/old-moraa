/* eslint-disable react-refresh/only-export-components */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Card,
  CardBody,
  ModalFooter,
} from '@heroui/react'
import { BsCircleSquare } from 'react-icons/bs'
import { FaPeopleGroup } from 'react-icons/fa6'
import { LuSquareStack } from 'react-icons/lu'

import { NumberInput } from './NumberInput'
import {
  AssignmentOption,
  AssignmentOptionSelector,
} from '../frames/frame-types/Breakout/AssignmentOptionSelector'
import { Button } from '../ui/Button'

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
    icon: <FaPeopleGroup size={32} />,
    description:
      'Split up participants into randomised groups automatically with no of participants per group',
    breakoutType: BREAKOUT_TYPES.GROUPS,
    templateType: CANVAS_TEMPLATE_TYPES.BLANK,
  },
  {
    name: 'Rooms',
    icon: <LuSquareStack size={32} />,
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
    breakoutRoomsGroupsTime?: number,
    assignmentOption?: AssignmentOption
  ) => void
}

export function BreakoutTypePicker({
  open,
  onClose,
  onChoose,
}: ChooseContentTypeProps) {
  const [selectedBreakoutType, setSelectedBreakoutType] =
    useState<BREAKOUT_TYPES>(BREAKOUT_TYPES.GROUPS)

  const [breakoutConfig, setBreakoutConfig] = useState<{
    [x in BREAKOUT_TYPES]: {
      duration: number
      groupSize?: number
      roomsCount?: number
      assignmentOption: AssignmentOption
    }
  }>({
    [BREAKOUT_TYPES.GROUPS]: {
      duration: 5,
      groupSize: 2,
      assignmentOption: 'auto',
    },
    [BREAKOUT_TYPES.ROOMS]: {
      duration: 5,
      roomsCount: 2,
      assignmentOption: 'auto',
    },
  })

  const onSubmit = () => {
    onChoose(
      selectedBreakoutType,
      breakoutConfig[selectedBreakoutType][
        selectedBreakoutType === BREAKOUT_TYPES.GROUPS
          ? 'groupSize'
          : 'roomsCount'
      ],
      breakoutConfig[selectedBreakoutType].duration,
      breakoutConfig[selectedBreakoutType].assignmentOption
    )
  }

  return (
    <Modal size="4xl" isOpen={open} onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-full bg-[#FCFAFF] flex items-center justify-center">
                    <span className="p-2 bg-[#E9D8FD] flex items-center rounded-full text-[#6947C3]">
                      <BsCircleSquare height={36} width={36} />
                    </span>
                  </span>
                  <h3 className="font-semibold text-xl text-black">
                    Create Breakout Rooms
                  </h3>
                </div>
              </div>
            </ModalHeader>
            <ModalBody className="p-8">
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
                        'flex-col items-start border-2 border-transparent bg-white ',
                        {
                          'border-primary':
                            breakoutType.breakoutType === selectedBreakoutType,
                        }
                      )}>
                      <CardBody className="p-2.5 flex flex-col place-items-center justify-center w-full gap-4 text-center">
                        <div className="flex flex-col gap-2">
                          <div className="w-full flex items-center justify-center">
                            <span className="p-1 rounded-full bg-[#E9D8FD] flex items-center">
                              <span className="flex items-center bg-[#B695F4] p-2 rounded-full text-white">
                                {breakoutType.icon}
                              </span>
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg w-full">
                              {breakoutType.name}
                            </h3>
                            <p className="text-sm w-full font-normal">
                              {breakoutType.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col justify-center items-center gap-1.5">
                          <span className="font-semibold">
                            {breakoutType.breakoutType === BREAKOUT_TYPES.ROOMS
                              ? 'No of rooms'
                              : 'No of participants per group'}
                          </span>
                          <span
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                            }}>
                            <NumberInput
                              min={2}
                              max={30}
                              allowNegative={false}
                              number={
                                breakoutConfig[breakoutType.breakoutType][
                                  breakoutType.breakoutType ===
                                  BREAKOUT_TYPES.GROUPS
                                    ? 'groupSize'
                                    : 'roomsCount'
                                ]
                              }
                              disabled={
                                selectedBreakoutType !==
                                breakoutType.breakoutType
                              }
                              onNumberChange={(count: number) =>
                                setBreakoutConfig({
                                  ...breakoutConfig,
                                  [breakoutType.breakoutType]: {
                                    ...breakoutConfig[
                                      breakoutType.breakoutType
                                    ],
                                    [breakoutType.breakoutType ===
                                    BREAKOUT_TYPES.GROUPS
                                      ? 'groupSize'
                                      : 'roomsCount']: count,
                                  },
                                })
                              }
                            />
                          </span>
                        </div>
                        <div className="flex flex-col justify-center items-center gap-1.5">
                          <span className="font-semibold">
                            Duration (in Min)
                          </span>
                          <span
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                            }}>
                            <NumberInput
                              min={2}
                              max={30}
                              allowNegative={false}
                              number={
                                breakoutConfig[breakoutType.breakoutType]
                                  .duration
                              }
                              disabled={
                                selectedBreakoutType !==
                                breakoutType.breakoutType
                              }
                              onNumberChange={(count: number) =>
                                setBreakoutConfig({
                                  ...breakoutConfig,
                                  [breakoutType.breakoutType]: {
                                    ...breakoutConfig[
                                      breakoutType.breakoutType
                                    ],
                                    duration: count,
                                  },
                                })
                              }
                            />
                          </span>
                        </div>
                        <div className="flex flex-col justify-center items-center gap-1.5 w-full">
                          <span className="font-semibold">
                            How participants can join
                          </span>
                          <div className="w-2/3">
                            <AssignmentOptionSelector
                              disabled={
                                breakoutType.breakoutType ===
                                BREAKOUT_TYPES.GROUPS
                              }
                              assignmentOption={
                                breakoutConfig[breakoutType.breakoutType]
                                  .assignmentOption
                              }
                              onChange={(option) =>
                                setBreakoutConfig({
                                  ...breakoutConfig,
                                  [breakoutType.breakoutType]: {
                                    ...breakoutConfig[
                                      breakoutType.breakoutType
                                    ],
                                    assignmentOption: option,
                                  },
                                })
                              }
                            />
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="flex items-end justify-center gap-4">
                <Button variant="bordered" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  variant="solid"
                  onClick={onSubmit}>
                  Create
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
