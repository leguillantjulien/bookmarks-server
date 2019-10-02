import { inject, injectable } from "inversify";
import { DbClient } from "./config/MongooseConnector";
import { GenericRepository } from "./generic_repository";
import { Document, Model } from "mongoose";
import { VideoMediaLink } from "../../Domain/Model/video_medialink";
import { IVideoMediaLinkRepository as VideoMediaLinkRepositoryInterface } from "../../Domain/Repository/repositories";
import TYPES from '../../constant/types';
import { videoMediaLinkSchema } from './schemas/videoMediaLinkSchema';
export interface VideoMediaLinkModel extends VideoMediaLink, Document {
  id: string;
}

@injectable()
export class VideoMediaLinkRepository
  extends GenericRepository<VideoMediaLink, VideoMediaLinkModel>
  implements VideoMediaLinkRepositoryInterface {
  protected model: Model<VideoMediaLinkModel>;
  public constructor(
    @inject(TYPES.DbClient) dbClient: DbClient
  ) {
    super(
      dbClient,
      "VideoMediaLink",
      dbClient.model("videomedialink", videoMediaLinkSchema, 'Bookmarks')
    );
  }
}
