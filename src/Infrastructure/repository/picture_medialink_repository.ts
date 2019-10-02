import { inject, injectable } from "inversify";
import { DbClient } from "./config/MongooseConnector";
import { GenericRepository } from "./generic_repository";
import { Document, Model } from "mongoose";
import { PictureMediaLink } from "../../Domain/Model/picture_medialink";
import { IPictureMediaLinkRepository as PictureMediaLinkRepositoryInterface } from "../../Domain/Repository/repositories";
import TYPES from '../../constant/types';
import { pictureMediaLinkSchema } from './schemas/pictureMediaLinkSchema';

export interface PictureMediaLinkModel extends PictureMediaLink, Document {
  id: string;
}

@injectable()
export class PictureMediaLinkRepository
  extends GenericRepository<PictureMediaLink, PictureMediaLinkModel>
  implements PictureMediaLinkRepositoryInterface {
  protected model: Model<PictureMediaLinkModel>;
  public constructor(
    @inject(TYPES.DbClient) dbClient: DbClient
  ) {
    super(
      dbClient,
      "PictureMediaLink",
      dbClient.model("picturemedialink", pictureMediaLinkSchema, 'Bookmarks')
    );

  }
}
