import React from "react";
import type { EntryDto } from "../../../types";
import { Icon } from "@/lib/icons";

interface EntryCardProps {
  entry: EntryDto;
}

const EntryCard: React.FC<EntryCardProps> = ({ entry }) => {
  return (
    <a
      href={`/entries/${entry.id}`}
      className="rounded-md flex gap-2 items-center w-fit bg-paper group/entry shadow-xl p-4"
    >
      <div className="relative w-6 h-6">
        <Icon
          name="empty-book"
          className="absolute inset-0 transition-opacity duration-200 opacity-100 group-hover/entry:opacity-0 w-6 h-6"
        />
        <Icon
          name="full-book"
          className="absolute inset-0 transition-opacity duration-200 opacity-0 group-hover/entry:opacity-100 w-6 h-6"
        />
      </div>
      <p className="text-sm font-cinzel text-gray-600">{new Date(entry.created_at).toLocaleDateString()}</p>
    </a>
  );
};

export default EntryCard;
