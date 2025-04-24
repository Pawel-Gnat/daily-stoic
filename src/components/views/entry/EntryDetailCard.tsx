"use client";
import React from "react";
import type { EntryDto } from "@/types";

interface EntryDetailCardProps {
  entry: EntryDto;
}

const EntryDetailCard: React.FC<EntryDetailCardProps> = ({ entry }) => {
  return (
    <div className="bg-white shadow rounded p-6">
      <h2 className="text-2xl font-bold mb-4">Entry Details</h2>
      <div className="mb-2">
        <strong>What matters most to you?</strong>
        <p>{entry.what_matters_most}</p>
      </div>
      <div className="mb-2">
        <strong>What are you afraid of losing?</strong>
        <p>{entry.fears_of_loss}</p>
      </div>
      <div className="mb-2">
        <strong>What are your goals?</strong>
        <p>{entry.personal_goals}</p>
      </div>
      <div className="mb-2">
        <strong>Generated sentence:</strong>
        <p>{entry.generated_sentence}</p>
      </div>
      <div className="mb-2">
        <strong>Generation duration:</strong>
        <p>{entry.generate_duration} seconds</p>
      </div>
      <div className="mb-2">
        <strong>Created at:</strong>
        <p>{new Date(entry.created_at).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default EntryDetailCard;
