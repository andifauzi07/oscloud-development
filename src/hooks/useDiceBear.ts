interface DiceBearOptions {
    seed?: string;
    flip?: boolean;
    rotate?: number;
    scale?: number;
    radius?: number;
    size?: number;
    backgroundColor?: string;
}

export const useDiceBear = () => {
    const createAvatar = async (options: DiceBearOptions = {}) => {
        try {
            const baseUrl = 'https://api.dicebear.com/7.x/avataaars/svg';
            const params = new URLSearchParams({
                seed: options.seed || Math.random().toString(),
                flip: options.flip?.toString() || 'false',
                rotate: options.rotate?.toString() || '0',
                scale: options.scale?.toString() || '100',
                radius: options.radius?.toString() || '0',
                size: options.size?.toString() || '256',
                backgroundColor: options.backgroundColor || 'ffffff'
            });

            const response = await fetch(`${baseUrl}?${params}`);
            if (!response.ok) {
                throw new Error('Failed to fetch avatar from DiceBear API');
            }

            const svgContent = await response.text();
            const blob = new Blob([svgContent], { type: 'image/svg+xml' });
            const file = new File([blob], `avatar-${Date.now()}.svg`, { type: 'image/svg+xml' });
            
            return file;
        } catch (error) {
            console.error('Error creating avatar:', error);
            throw error;
        }
    };

    return { createAvatar };
};
