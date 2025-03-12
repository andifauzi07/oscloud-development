import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export interface DurationInputProps {
  startDate?: string;
  endDate?: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function DurationInput({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  label = 'Duration',
  className = '',
  disabled = false,
}: DurationInputProps) {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="w-[150px] border rounded-none"
          disabled={disabled}
        />
        <span className="text-gray-500">-</span>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="w-[150px] border rounded-none"
          disabled={disabled}
        />
      </div>
    </div>
  );
}