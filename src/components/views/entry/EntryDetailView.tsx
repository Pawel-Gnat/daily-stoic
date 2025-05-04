import { useEntryDetail } from "../../../hooks/useEntryDetail.ts";
import DeleteConfirmationModal from "./DeleteConfirmationModal.tsx";
import BackButton from "./BackButton.tsx";
import { toast } from "sonner";
import { useNavigate } from "../../../hooks/useNavigate.ts";
import { Spinner } from "@/components/shared/Spinner.tsx";
import { EntryDetailCard } from "./EntryDetailCard.tsx";
import { Container } from "@/components/shared/Container.tsx";
import type { UserDto } from "@/types";
import { Button } from "@/components/ui/button";
import { Icon } from "@/lib/icons/index.tsx";

interface EntryDetailViewProps {
  entryId: string;
  user: UserDto | undefined;
}

const EntryDetailView = ({ entryId, user }: EntryDetailViewProps) => {
  const { entry, loading, error, deleteEntry } = useEntryDetail({ entryId, user });
  const navigate = useNavigate();

  const handleDelete = async () => {
    const success = await deleteEntry();
    if (success) {
      toast.success("Entry deleted successfully");
      navigate("/entries");
    } else {
      toast.error("Failed to delete entry");
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div>Error: {error}</div>;
  if (!entry) return <div>Entry not found</div>;

  return (
    <Container>
      <div className="flex justify-between items-center">
        <BackButton />
        {user && (
          <DeleteConfirmationModal
            trigger={
              <Button variant="destructive">
                <Icon name="delete" /> Delete Entry
              </Button>
            }
            onConfirm={handleDelete}
          />
        )}
      </div>
      <EntryDetailCard entry={entry} />
    </Container>
  );
};

export default EntryDetailView;
