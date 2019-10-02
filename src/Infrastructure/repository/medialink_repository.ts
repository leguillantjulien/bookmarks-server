import { inject, injectable } from "inversify";
import { DbClient } from "./config/MongooseConnector";
import { GenericRepository } from "./generic_repository";
import { Document, Model } from "mongoose";
import { IMediaLinkRepository as MediaLinkRepositoryInterface } from "../../Domain/Repository/repositories";
import TYPES from '../../constant/types';
import { mediaLinkSchema } from './schemas/mediaLinkSchema';
import { MediaLink } from "../../Domain/Model/medialink";
export interface MediaLinkModel extends MediaLink, Document {
  id: string;
}

@injectable()
export class MediaLinkRepository
  extends GenericRepository<MediaLink, MediaLinkModel>
  implements MediaLinkRepositoryInterface {
  protected model: Model<MediaLinkModel>;
  public constructor(
    @inject(TYPES.DbClient) dbClient: DbClient
  ) {
    super(
      dbClient,
      "MediaLink",
      dbClient.model("medialink", mediaLinkSchema, 'Bookmarks')//last param is the collection name
    );

  }
}
