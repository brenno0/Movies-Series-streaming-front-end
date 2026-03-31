"use client"

import {
  Modal,
  ModalTrigger,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@/components/ui/animated-modal" 
import { type JSX, type ReactNode } from "react"

interface IModalProps {
  modalTitle: string
  modalDescription: string
  children: ReactNode
  actions: JSX.Element
  modalBodyTemplate?: JSX.Element
  modalHeadTemplate?: JSX.Element
}

export const AnimatedModal = ({
  modalTitle,
  modalDescription,
  modalBodyTemplate,
  modalHeadTemplate,
  children,
  actions,
}: IModalProps) => {
  return (
    <Modal>
      <ModalTrigger>{children}</ModalTrigger>

      <ModalBody>
        <ModalContent className="gap-4">
          {modalHeadTemplate}
          <div className="text-center">
            <h2 className="text-2xl text-base-700 dark:text-white font-semibold">
              {modalTitle}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {modalDescription}
            </p>
          </div>
          {modalBodyTemplate}
        </ModalContent>

        <ModalFooter>{actions}</ModalFooter>
      </ModalBody>
    </Modal>
  )
}
