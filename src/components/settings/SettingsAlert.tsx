import { memo, useRef } from 'react';
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from '@chakra-ui/react';

type SettingsAlertProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'RUNNING' | 'PAUSED';
};

const SettingsAlert = ({
  isOpen,
  onConfirm,
  onClose,
  type,
}: SettingsAlertProps) => {
  const cancelRef = useRef(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      id={`settings-alert-${type}`}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Changing timers
          </AlertDialogHeader>

          <AlertDialogBody>
            You have to reset the current timer before changing settings. The
            timer is currently {type.toLowerCase()}.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} aria-label="Cancel alert">
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={onConfirm}
              ml={3}
              aria-label="Reset the timer"
            >
              Reset the timer
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default memo(SettingsAlert);
