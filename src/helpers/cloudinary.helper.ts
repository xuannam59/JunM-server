export const getPublicIdFromUrl = (url: string) => {
    try {
        const regex = /\/upload\/(?:v\d+\/)?(.+?)\.(jpg|jpeg|png|gif|webp|mp4|mov|pdf|docx|txt|mp3|wav|ogg)$/i;
        const match = url.match(regex);
        if (match && match[1]) {
            return match[1]; // Đây là publicId
        }
        return null;
    } catch (error) {
        console.error('Error extracting publicId:', error);
        return null;
    }
};

export const detectResourceTypeFromUrl = (url: string): 'image' | 'video' | 'raw' => {
    if (url.match(/\.(mp4|mov|avi|webm|mp3|wav|ogg)$/i)) return 'video';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return 'image';
    return 'raw';
};


export const detectResourceType = (mimeType: string): 'image' | 'video' | 'auto' => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'video'; // Cloudinary xử lý audio như video
    return 'auto';
}

export const getTransformations = (resourceType: string) => {
    if (resourceType === 'image') {
        return [
            { crop: 'scale' },
            { fetch_format: 'auto' },
            { quality: 'auto' },
        ];
    }

    if (resourceType === 'video') {
        return [
            { fetch_format: 'auto' },
            { quality: 'auto' },
            { video_codec: 'auto' },
            { audio_codec: 'aac' },
            { width: 1280, crop: 'limit' }, // Scale video/audio nếu quá lớn
        ];
    }

    return undefined;
}
