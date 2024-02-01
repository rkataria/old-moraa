"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useModal } from "@/stores/use-modal-store"
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { EventService } from "@/services/event.service";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required."
  }),
  description: z.string().optional()
});

export const CreateEventModal = () => {
  const router = useRouter()
  const { isOpen, onClose, type } = useModal()
  const isModalOpen = isOpen && type === "createEvent"

  const { currentUser } = useAuth()
  const { mutateAsync, data, error } = useMutation({
    mutationFn: EventService.createEvent,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: ""
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!currentUser) return
    const event = {
      name: values.name,
      description: values.description,
      type: "course", //formData.get("type"),
      owner_id: currentUser.id,
    }

    //@ts-ignore
    return await mutateAsync(event, {
      onSuccess: ({ data }) => {
        if (data) {
          onClose()
          router.push(`/events/${data.id}`)
        }
      }
    })
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="p-6 flex flex-col items-start bg-primary text-white">
          <DialogTitle className="text-lg text-center">
            New learning event
          </DialogTitle>
          <DialogDescription className="text-textIndigo">
          Give your event a name and an optional description to get going!        </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                    >
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Your awesome course or workshop name goes here"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                    >
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="This is what your learners would see. You could include high-level learning objectives or brief course overview here"
                        className="focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="default" disabled={isLoading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
