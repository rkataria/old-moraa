import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'

import { useAuth } from './useAuth'

import { EventService } from '@/services/event.service'

export const useEventPermissions = () => {
  const { eventId } = useParams({ strict: false })
  const { currentUser } = useAuth()

  const userId = currentUser?.id

  const eventQuery = useQuery({
    queryKey: ['event-permissions', eventId, userId],
    queryFn: () =>
      EventService.getEventPermissions({
        eventId: eventId as string,
        userId,
      }),
    enabled: !!userId && !!eventId,
    refetchOnWindowFocus: false,
    refetchInterval: 30 * 60 * 1000,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const roles: any = eventQuery.data?.roles
  const entityLevelPermissions = roles?.permissions || []

  const checkPermission = (subject: string, action: string): boolean =>
    entityLevelPermissions.some(
      (permission: { subject: string; action: string }) =>
        permission.subject === subject && permission.action === action
    )

  const permissions = {
    canUpdateFrame: checkPermission('frame', 'UPDATE'),
    canDeleteFrame: checkPermission('frame', 'DELETE'),
    canCreateFrame: checkPermission('frame', 'CREATE'),
    canUpdateSection: checkPermission('section', 'UPDATE'),
    canDeleteSection: checkPermission('section', 'DELETE'),
    canCreateSection: checkPermission('section', 'CREATE'),
    canManageEnrollment: checkPermission('enrollment', 'UPDATE'),
    canUpdateMeeting: checkPermission('meeting', 'UPDATE'),
    canAccessSession: checkPermission('session', 'READ'),
    canAcessAllSessionControls: checkPermission('session_ui_controls', '*'),
    canUpdateNotes: checkPermission('notes', 'UPDATE'),
    canaccessNotes: checkPermission('notes', 'READ'),
  }

  return { permissions, isLoading: eventQuery.isLoading }
}
