import * as React from 'react';
import { cn } from '@/lib/utils';
import { Smile } from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

interface InputProps extends React.ComponentProps<'input'> {
	onEmojiSelect?: (emoji: string) => void;
	enableEmoji?: boolean;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, onEmojiSelect, enableEmoji = true, value, onChange, ...props }, ref) => {
		const [isEmojiPickerOpen, setIsEmojiPickerOpen] = React.useState(false);
		const inputRef = (ref as React.MutableRefObject<HTMLInputElement>) || React.useRef<HTMLInputElement>(null);

		const handleEmojiClick = (emojiData: EmojiClickData) => {
			if (onEmojiSelect) {
				onEmojiSelect(emojiData.emoji);
			}

			const input = inputRef.current;
			if (input) {
				const start = input.selectionStart || 0;
				const end = input.selectionEnd || 0;
				const newValue = (value || input.value).slice(0, start) + emojiData.emoji + (value || input.value).slice(end);

				// Create a synthetic event
				const syntheticEvent = {
					target: { value: newValue },
					currentTarget: { value: newValue },
				} as React.ChangeEvent<HTMLInputElement>;

				// Call the onChange handler if it exists
				if (onChange) {
					onChange(syntheticEvent);
				}

				// Update the input value directly if it's an uncontrolled component
				if (value === undefined) {
					input.value = newValue;
				}

				// Set cursor position after the inserted emoji
				requestAnimationFrame(() => {
					input.setSelectionRange(start + emojiData.emoji.length, start + emojiData.emoji.length);
				});
			}

			setIsEmojiPickerOpen(false);
		};

		return (
			<div className="relative w-full">
				<input
					type={type}
					className={cn(
						'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
						className
					)}
					ref={inputRef}
					value={value}
					onChange={onChange}
					{...props}
				/>
				{enableEmoji && (
					<>
						<button
							type="button"
							onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
							className="absolute transition-opacity -translate-y-1/2 opacity-50 right-2 top-1/2 hover:opacity-100"
							aria-label="Open emoji picker">
							<Smile size={16} />
						</button>
						{isEmojiPickerOpen && (
							<div className="absolute right-0 z-10 mt-2">
								<EmojiPicker
									onEmojiClick={handleEmojiClick}
									lazyLoadEmojis={true}
									previewConfig={{ showPreview: false }}
								/>
							</div>
						)}
					</>
				)}
			</div>
		);
	}
);

Input.displayName = 'Input';

export { Input };
