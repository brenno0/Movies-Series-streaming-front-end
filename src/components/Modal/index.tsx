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

interface IModalProps {
  modalTitle: string
  modalDescription: string
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
}: IModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='min-w-[100vh]' >
        <DialogHeader>
          {modalHeadTemplate}
          <DialogTitle className="text-2xl text-center text-primary">
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
