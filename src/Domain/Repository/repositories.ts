import { VideoMediaLink } from "../Model/video_medialink";
import { PictureMediaLink } from "../Model/picture_medialink";
import { MediaLink } from "../Model/medialink";

export type Query<T> = {
  [P in keyof T]?: T[P] | { $regex: RegExp };
};

export interface CRUDRepository<T> {
  save(doc: T): Promise<T>;
  findOneAndUpdate(doc: T, id?: T): Promise<T>;
  findOneByFilter(filter: any): Promise<T>;
  count(): Promise<Number>;
  update(filter: any, set: any): Promise<T>;
  delete(id: string): Promise<any>;
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T>;
  findManyById(ids: string[]): Promise<T[]>;
  findManyByQuery(query?: Query<T>): Promise<T[]>;
}

export type IMediaLinkRepository = CRUDRepository<MediaLink>;
export type IPictureMediaLinkRepository = CRUDRepository<PictureMediaLink>;
export type IVideoMediaLinkRepository = CRUDRepository<VideoMediaLink>;