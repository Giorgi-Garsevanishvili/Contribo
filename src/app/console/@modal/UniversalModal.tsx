import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogOverlay } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";

export const UniversalModal = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const handleOpenChange = () => {
    router.back();
  };

  return (
    <Dialog defaultOpen={true} open={true} onOpenChange={handleOpenChange}>
      <DialogOverlay className="overflow-y-hidden">
        <DialogContent>
          {children}
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};
