import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
  const [feedbackContent, setFeedbackContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitFeedbackMutation = trpc.feedback.submit.useMutation({
    onSuccess: () => {
      toast.success("thx you for your feedback!");
      setFeedbackContent("");
      onOpenChange(false);
    },
    onError: error => {
      if (error.message.includes("limit reached")) {
        toast.error("you've reached the daily feedback limit (5 per day)");
      } else {
        toast.error("failed to submit feedback. pls try again.");
      }
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async () => {
    const trimmedContent = feedbackContent.trim();

    if (trimmedContent.length < 10) {
      toast.error("please provide at least 10 characters of feedback");
      return;
    }

    if (trimmedContent.length > 5000) {
      toast.error("feedback is too long (max 5000 characters)");
      return;
    }

    setIsSubmitting(true);
    submitFeedbackMutation.mutate({ content: trimmedContent });
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFeedbackContent("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="lowercase">send feedback</DialogTitle>
          <DialogDescription className="lowercase">
            help us improve the platform
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Textarea
            value={feedbackContent}
            onChange={e => setFeedbackContent(e.target.value)}
            placeholder="what were your expectations, what's not working, what are you missing?"
            className="min-h-[150px] lowercase placeholder:normal-case"
            disabled={isSubmitting}
            maxLength={5000}
          />
          {feedbackContent.length > 0 && (
            <p className="text-xs text-muted-foreground mt-2 text-right">
              {feedbackContent.length}/5000
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="lowercase"
          >
            close
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || feedbackContent.trim().length < 10}
            className="lowercase"
          >
            {isSubmitting ? "sending..." : "send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
