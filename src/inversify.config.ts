import { ContainerModule } from "inversify";
import "reflect-metadata";
// Interfaces & Types
import TYPES from "./constant/types";
import { Container } from "inversify";
//DB
import { DbClient, getDatabaseClient } from '../src/Infrastructure/repository/config/MongooseConnector';

//Services
import { LinkService } from './Application/Services/LinkService'

//Domain Repo
import { IMediaLinkRepository, IPictureMediaLinkRepository, IVideoMediaLinkRepository } from './Domain/Repository/repositories';
//Domain Repo Interfaces
import {
	IMediaLinkRepository as MediaLinkRepositoryInterface,
	IPictureMediaLinkRepository as PictureMediaLinkRepositoryInterface,
	IVideoMediaLinkRepository as VideoMediaLinkRepositoryInterface
} from "./domain/repository/repositories";

// Intrastructure Repo

import { PictureMediaLinkRepository } from './Infrastructure/repository/picture_medialink_repository';
import { VideoMediaLinkRepository } from './Infrastructure/repository/video_medialink_repository';
import { MediaLinkRepository } from './Infrastructure/repository/medialink_repository';

//Controller
import "./Adapter/controller/LinkController"

export const referenceDataIoCModule = new ContainerModule((bind) => {
	// services
	bind<LinkService>(TYPES.LinkService).to(LinkService);

	// Repositories
	bind<IMediaLinkRepository>(TYPES.IMediaLinkRepository).to(MediaLinkRepository);
	bind<IPictureMediaLinkRepository>(TYPES.IPictureMediaLinkRepository).to(PictureMediaLinkRepository);
	bind<IVideoMediaLinkRepository>(TYPES.IVideoMediaLinkRepository).to(VideoMediaLinkRepository);

});
