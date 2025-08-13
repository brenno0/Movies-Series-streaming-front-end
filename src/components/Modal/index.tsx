import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { type JSX, type ReactNode } from 'react'
import * as DialogPrimitive from "@radix-ui/react-dialog"

interface IModalProps extends  React.ComponentProps<typeof DialogPrimitive.Content> {
  modalTitle: string
  modalDescription?: string
  children: ReactNode
  actions?: JSX.Element
  modalBodyTemplate?: JSX.Element
  modalHeadTemplate?: JSX.Element
}

export const ModalComponent = ({
  modalTitle,
  modalDescription,
  modalBodyTemplate,
  modalHeadTemplate,
  children,
  actions,
  ...props
}: IModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent {...props} >
        <DialogHeader>
          {modalHeadTemplate}
          <DialogTitle className="text-3xl font-bold text-center">
            {modalTitle}
          </DialogTitle>
          <DialogDescription className="text-xs text-center">
            {modalDescription}
          </DialogDescription>
        </DialogHeader>
        {modalBodyTemplate}
        <DialogFooter>{actions}</DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
