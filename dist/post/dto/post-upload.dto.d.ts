/// <reference types="multer" />
export declare class PostUploadDto {
    readonly images: Array<Express.Multer.File>;
    readonly title: string;
    content: string;
    hashtag: string[];
}
