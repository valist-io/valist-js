import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { VALIST_API_URL, formatBytes, isBrowser } from './utils';

export async function uploadFiles(folder: File[] | string, onProgress?: (progressEvent: any) => void): Promise<string> {
    let files: File[] | string[] = [];

    let keys: string[] = [];

    if (isBrowser()) {
        files = folder as File[];
    } else {
        const dirPath = folder as string;
        files = fs.readdirSync(dirPath).map(fileName => path.join(dirPath, fileName));
    }

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let filePath: string;
        let fileType: string;

        if (isBrowser()) {
            filePath = (file as File).webkitRelativePath;
            fileType = (file as File).type;
        } else {
            filePath = file as string;
            fileType = 'application/octet-stream';
        }

        const response = await axios.post(VALIST_API_URL, {
            body: {
                path: filePath,
            }
        });

        if (response.status !== 200) {
            throw new Error(`Failed to get pre-signed URL from API. Status: ${response.status}`);
        }

        const presignedUrl = response.data.url;

        const fileContent = isBrowser() ? (file as File) : fs.createReadStream(file as string);

        const key = await axios.put(presignedUrl, fileContent, {
            onUploadProgress: (progressEvent) => {
                onProgress && onProgress(progressEvent.total ? `${((progressEvent.loaded * 100) / progressEvent.total).toFixed(2)}%` : formatBytes(progressEvent.loaded.toString()));
            },
            headers: {
                'Content-Type': fileType
            }
        });

        keys.push(key.data?.result);
    }

    return keys[keys.length - 1];
}
