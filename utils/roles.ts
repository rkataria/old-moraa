import { FaUser } from 'react-icons/fa'
import { IoShieldSharp } from 'react-icons/io5'

export const roles = [
  // {
  //   key: 'Co-creator',
  //   label: 'Co-creator',
  //   icon: FaPeopleArrows({ className: 'text-black/50' }),
  // },
  // {
  //   key: 'Co-host',
  //   label: 'Co-host',
  //   icon: MdPeopleAlt({ className: 'text-black/50' }),
  // },
  {
    key: 'Moderator',
    label: 'Moderator',
    icon: IoShieldSharp({ className: 'text-black/50' }),
  },
  {
    key: 'Participant',
    label: 'Participant',
    icon: FaUser({ className: 'text-black/50' }),
  },
]
