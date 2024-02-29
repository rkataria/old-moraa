import * as yup from "yup"
import {
  Control,
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Input } from "@nextui-org/react"
import { ReactElement } from "react"
import { useUserContext } from "@/hooks/useAuth"
import { Trash } from "lucide-react"
import { useMutation } from "@tanstack/react-query"

function getAllIndexes<T>(arr: Array<T>, val: T) {
  var indexes = [],
    i = -1
  while ((i = arr.indexOf(val, i + 1)) != -1) {
    indexes.push(i)
  }
  return indexes
}

export const participantsListValidationSchema = yup
  .array(
    yup.object({
      participantId: yup.string(),
      isHost: yup.boolean(),
      email: yup
        .string()
        .email()
        .test({
          name: "unique-email",
          test: function (email, context) {
            // @ts-ignore
            const currentIndex = context.options.index
            const allParticipants: string[] =
              context.from?.[1].value?.participants?.map(
                (p: { email: string }) => p.email
              ) || []
            const indexes = getAllIndexes(allParticipants, email)
            if (indexes.length !== 1 && indexes[0] === currentIndex) return true
            return indexes.length === 1
          },
          message: "Email addresses must be unique",
        })
        .label("Participant email")
        .required(),
    })
  )
  .required()

const participantsValidationSchema = yup.object({
  participants: participantsListValidationSchema,
})

export type ParticipantsFormData = yup.InferType<
  typeof participantsValidationSchema
>
export type AddParticipantsFormProps<
  FormData extends ParticipantsFormData = ParticipantsFormData,
> = {
  defaultValue?: FormData["participants"]
  onParticipantRemove?: (email: string) => Promise<void>
} & (
  | {
      formControl?: Control<FormData>
      onSubmit?: void
      renderAction?: void
    }
  | {
      formControl?: never
      onSubmit?: (participants: FormData) => void
      /**
       * The action is responsible for triggering the `onSubmit` handler
       * so a least one of the button rendered using the `renderAction` should have `type="submit"`
       * @returns {ReactElement}
       */
      renderAction?: () => ReactElement
    }
)

function AddParticipantsForm<
  FormData extends ParticipantsFormData = ParticipantsFormData,
>({
  formControl,
  defaultValue,
  onSubmit,
  renderAction,
  onParticipantRemove,
}: AddParticipantsFormProps<FormData>) {
  const userProfile = useUserContext()
  const participantsForm = useForm<ParticipantsFormData>({
    resolver: yupResolver(participantsValidationSchema),
    defaultValues: {
      participants: defaultValue || [
        {
          participantId: userProfile.currentUser.id,
          email: userProfile.currentUser.email,
          isHost: true,
        },
      ],
    },
  })
  const fakeDeleteParticipantMutation = useMutation({
    mutationFn: async (id: string) => await onParticipantRemove?.(id),
  })

  const control = (formControl ||
    participantsForm.control) as Control<ParticipantsFormData>
  const participantsFieldArray = useFieldArray({
    control,
    name: "participants",
  })

  console.log(participantsFieldArray.fields)

  const FormContentJSX = (
    <div>
      <p className="mb-2">Participant(s)</p>
      {participantsFieldArray.fields.map((arrayField, index) => (
        <Controller
          key={arrayField.id}
          control={control}
          name={`participants.${index}.email`}
          render={({ field, fieldState }) => (
            <div className="mb-4">
              <div className="flex items-center">
                <Input
                  {...field}
                  className="flex-1"
                  variant="bordered"
                  size="sm"
                  disabled={arrayField.isHost}
                  errorMessage={fieldState.error?.message}
                  isInvalid={!!fieldState.error}
                />
                {!arrayField.isHost && (
                  <Button
                    isIconOnly
                    className="ml-4"
                    aria-label="Delete participant"
                    variant="bordered"
                    isLoading={
                      fakeDeleteParticipantMutation.isPending &&
                      arrayField.participantId ===
                        fakeDeleteParticipantMutation.variables
                    }
                    onClick={async () => {
                      if (arrayField.participantId && !arrayField.isHost)
                        await fakeDeleteParticipantMutation.mutateAsync(
                          arrayField.participantId
                        )
                      participantsFieldArray.remove(index)
                    }}
                  >
                    <Trash size={16} />
                  </Button>
                )}
              </div>
            </div>
          )}
        />
      ))}
      <div className="flex">
        <Button
          className="mt-4"
          onClick={() => participantsFieldArray.append({ email: "" })}
          variant="bordered"
          color="default"
        >
          + Add New Participant
        </Button>
      </div>

      {renderAction?.()}
    </div>
  )

  return (
    <div>
      {onSubmit ? (
        <form
          onSubmit={participantsForm.handleSubmit(
            onSubmit as SubmitHandler<ParticipantsFormData>
          )}
        >
          {FormContentJSX}
        </form>
      ) : (
        FormContentJSX
      )}
    </div>
  )
}

export default AddParticipantsForm
