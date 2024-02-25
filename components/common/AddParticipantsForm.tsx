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
  Input,
} from "@chakra-ui/react"
import clsx from "clsx"
import { ReactElement } from "react"

export const participantsListValidationSchema = yup
  .array(
    yup.object({
      email: yup.string().email().label("Participant email").required(),
    })
  )
  .test({
    // TODO: Fix this validation. It is not working.
    name: "unique-emails",
    test: function (arr = []) {
      console.log("🚀 ~ arr:", arr)
      // Check for duplicate emails
      const uniqueEmails = new Set()
      for (const participant of arr) {
        if (uniqueEmails.has(participant.email)) {
          return true // Duplicate email found
        }
        uniqueEmails.add(participant.email)
      }
      return false // No duplicate emails found
    },
    message: "Email addresses must be unique",
  })
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
  const participantsForm = useForm<ParticipantsFormData>({
    resolver: yupResolver(participantsValidationSchema),
    defaultValues: {
      participants: defaultValue || [
        {
          email: "",
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
          control={control}
          name={`participants.${index}.email`}
          render={({ field, fieldState }) => (
            <div className="">
              <FormControl
                size="xs"
                isInvalid={!!fieldState.error?.message}
                className={clsx("flex-1", "mb-4")}
              >
                <Input {...field} />
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
