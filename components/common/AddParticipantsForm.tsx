import * as yup from "yup"
import {
  Control,
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
} from "@chakra-ui/react"
import clsx from "clsx"
import { ReactElement } from "react"
import { useUserContext } from "@/hooks/useAuth"
import { Trash } from "lucide-react"

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
}: AddParticipantsFormProps<FormData>) {
  const userProfile = useUserContext()
  const participantsForm = useForm<ParticipantsFormData>({
    resolver: yupResolver(participantsValidationSchema),
    defaultValues: {
      participants: defaultValue || [
        {
          email: userProfile.currentUser.email,
        },
      ],
    },
  })

  const control = (formControl ||
    participantsForm.control) as Control<ParticipantsFormData>
  const participantsFieldArray = useFieldArray({
    control,
    name: "participants",
  })

  const FormContentJSX = (
    <div>
      <FormLabel>Participant Email(s)</FormLabel>
      {participantsFieldArray.fields.map((field, index) => (
        <Controller
          key={field.id}
          control={control}
          name={`participants.${index}.email`}
          render={({ field, fieldState }) => (
            <div className="">
              <FormControl
                size="xs"
                isInvalid={!!fieldState.error?.message}
                className={clsx("flex-1", "mb-4")}
              >
                <div className="flex">
                  <Input {...field} className="flex-1" />
                  <IconButton
                    className="ml-4"
                    aria-label="Delete participant"
                    icon={<Trash size={16} />}
                    onClick={() => participantsFieldArray.remove(index)}
                  />
                </div>
                <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
              </FormControl>

              <div className="flex">
                {index === participantsFieldArray.fields.length - 1 && (
                  <Button
                    onClick={() => participantsFieldArray.append({ email: "" })}
                    variant="outline"
                    colorScheme="gray"
                  >
                    + Add New Participant
                  </Button>
                )}
              </div>
            </div>
          )}
        />
      ))}

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
