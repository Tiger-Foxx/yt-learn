import {
    FinishReason,
    GenerateContentConfig,
    GenerateContentParameters,
    HarmCategory,
    Part,
    SafetySetting
} from '@google/genai';

export interface GenerateTextOptions {
    modelName: string;
    prompt: string;
    videoUrl?: string;
    temperature?: number;
    safetySettings?: SafetySetting[];
}

export interface ValidationResult {
    isValid: boolean;
    id?: string;
    error?: string;
}

export interface YouTubeVideoInfo {
    id: string;
    title: string;
    description: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: {
        default: string;
        medium: string;
        high: string;
        standard?: string;
        maxres?: string;
    };
    duration?: string;
    durationInSeconds?: number;
    viewCount?: string;
}

export interface YouTubeTranscriptSegment {
    text: string;
    start: number;
    duration: number;
}

export interface TranscriptResult {
    success: boolean;
    transcript?: string;
    segments?: YouTubeTranscriptSegment[];
    error?: string;
}

export interface PdfExtractionResult {
    success: boolean;
    text?: string;
    pageCount?: number;
    title?: string;
    error?: string;
}