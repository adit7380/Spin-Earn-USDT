import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface SpinResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  reward: number;
}

export default function SpinResultModal({ isOpen, onClose, reward }: SpinResultModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white rounded-2xl p-6 max-w-xs w-full mx-4 text-center">
        <AlertDialogHeader className="flex flex-col items-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <AlertDialogTitle className="text-xl font-bold mb-2">Congratulations!</AlertDialogTitle>
          <AlertDialogDescription className="mb-4">
            You won <span className="text-accent font-bold">{reward}</span> coins!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            onClick={onClose}
            className="bg-primary text-white font-bold py-3 px-6 rounded-lg w-full"
          >
            Awesome!
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
