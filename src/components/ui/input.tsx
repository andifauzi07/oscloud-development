import * as React from 'react';
import { cn } from '@/lib/utils';
import { Smile } from 'lucide-react'; // Icon for the emoji trigger button
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'; // Import the emoji picker

interface InputProps extends React.ComponentProps<'input'> {
	onEmojiSelect?: (emoji: string) => void; // Callback for when an emoji is selected
	enableEmoji?: boolean; // Optional prop to enable/disable emoji functionality
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{ className, type, onEmojiSelect, enableEmoji = true, ...props }, // Default enableEmoji to true
		ref
	) => {
		const [isEmojiPickerOpen, setIsEmojiPickerOpen] = React.useState(false);

		// Handle emoji selection
		const handleEmojiClick = (emojiData: EmojiClickData) => {
			if (onEmojiSelect) {
				onEmojiSelect(emojiData.emoji); // Pass the selected emoji to the parent
			}

			// Use the ref to access the input element and append the emoji
			if (ref && typeof ref !== 'function') {
				const inputElement = (ref as React.MutableRefObject<HTMLInputElement>).current;
				if (inputElement) {
					const start = inputElement.selectionStart || 0; // Get cursor position
					const end = inputElement.selectionEnd || 0; // Get cursor position
					const currentValue = inputElement.value;

					// Insert the emoji at the cursor position
					const newValue = currentValue.slice(0, start) + emojiData.emoji + currentValue.slice(end);
					inputElement.value = newValue;

					// Move the cursor after the inserted emoji
					inputElement.setSelectionRange(start + emojiData.emoji.length, start + emojiData.emoji.length);

					// Trigger an input event to notify React of the change
					const event = new Event('input', { bubbles: true });
					inputElement.dispatchEvent(event);

					inputElement.focus(); // Keep focus on the input field
				}
			}

			setIsEmojiPickerOpen(false); // Close the picker
		};

		return (
			<div className="relative w-full">
				<input
					type={type}
					className={cn(
						'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
						className
					)}
					ref={ref}
					{...props}
				/>
				{/* Render emoji trigger button only if enableEmoji is true */}
				{enableEmoji && (
					<>
						<button
							type="button"
							onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
							className="absolute transition-opacity -translate-y-1/2 opacity-50 right-2 top-1/2 hover:opacity-100"
							aria-label="Open emoji picker">
							<Smile size={16} />
						</button>
						{/* Emoji picker */}
						{isEmojiPickerOpen && (
							<div className="absolute right-0 z-10 mt-2">
								<EmojiPicker
									onEmojiClick={handleEmojiClick}
									lazyLoadEmojis={true}
									previewConfig={{ showPreview: false }} // Disable the preview section
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
