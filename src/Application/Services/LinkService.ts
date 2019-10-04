import { inject, injectable } from 'inversify';
import TYPES from "../../constant/types";
import { validate } from "class-validator";
import { IMediaLinkRepository, IVideoMediaLinkRepository, IPictureMediaLinkRepository } from "../../Domain/Repository/repositories";
import ERRORS from "../../constant/error";
import { MediaLink } from "../../Domain/Model/medialink";
import { PictureMediaLink } from '../../Domain/Model/picture_medialink';
import { VideoMediaLink } from '../../Domain/Model/video_medialink';
import { MediaType } from '../../constant/enum';
import { isVimeoUrl, isFlickerUrl } from '../utils';
@injectable()
export class LinkService {

  private baseRepository: IMediaLinkRepository;
  private videoMediaLinkRepository: IVideoMediaLinkRepository;
  private pictureMediaLinkRepository: IPictureMediaLinkRepository;

  constructor(
    @inject(TYPES.IMediaLinkRepository) baseRepository: IMediaLinkRepository,
    @inject(TYPES.IPictureMediaLinkRepository) pictureMediaLinkRepository: IPictureMediaLinkRepository,
    @inject(TYPES.IVideoMediaLinkRepository) videoMediaLinkRepository: IVideoMediaLinkRepository
  ) {
    this.baseRepository = baseRepository;
    this.pictureMediaLinkRepository = pictureMediaLinkRepository;
    this.videoMediaLinkRepository = videoMediaLinkRepository;
  }

  //UseCase : Récupérer tous les medias du catalogue
  public findAll(): Promise<MediaLink[]> {
    return this.baseRepository.findAll();
  }

  //find detailled media by type
  public findMediaById(id: string): Promise<MediaLink> {
    return this.baseRepository.findById(id);
  }

  public findVideoLinks(): Promise<MediaLink[]> {
    console.log('findVideoLinks');
    return this.baseRepository.findManyByQuery(
      {
        type: {
          $regex: new RegExp(MediaType.Video)
        }
      });
  }

  public findPictureLinks(): Promise<MediaLink[]> {
    console.log('findPictureLinks');
    return this.baseRepository.findManyByQuery(
      {
        type: {
          $regex: new RegExp(MediaType.Picture)
        }
      });
  }

  public addMediaLink(media: any): Promise<MediaLink> {
    return new Promise<MediaLink>((resolve, reject) => {
      if (media.hasOwnProperty('url')
        && media.hasOwnProperty('title')
        && media.hasOwnProperty('author_name')
        && media.hasOwnProperty('type')
        && media.hasOwnProperty('width')
        && media.hasOwnProperty('height')
      ) {
        return this.baseRepository.findOneByFilter({ url: media.url }).then((res) => {
          // url already exist
          reject(new Error(ERRORS.URL_ALREADY_EXIST));
        }).catch(() => {
          // Same url not exist
          if (media.type === MediaType.Picture) {
            resolve(this.createPictureMediaLink(media));
          } else if (media.type === MediaType.Video) {
            resolve(this.createVideoMediaLink(media));
          } else {
            reject(new Error(ERRORS.INVALID_TYPE));
          }
        });
      } else {
        reject(new Error(ERRORS.INVALID_OBJECT));
      }
    });
  }

  public updateMediaLink(id: string, updatedMediaLink) {
    return new Promise<any>((resolve, reject) => {
      if (updatedMediaLink.hasOwnProperty('url')
        && updatedMediaLink.hasOwnProperty('title')
        && updatedMediaLink.hasOwnProperty('author_name')
        && updatedMediaLink.hasOwnProperty('type')
        && updatedMediaLink.hasOwnProperty('width')
        && updatedMediaLink.hasOwnProperty('height')
        && updatedMediaLink.hasOwnProperty('id')
      ) {
        if (id !== updatedMediaLink.id) {
          reject(new Error(ERRORS.ID_NOT_MATCH));
        }
        if (updatedMediaLink.type === MediaType.Picture && isFlickerUrl(updatedMediaLink.url)) {
          resolve(this.updatePictureMediaLink(updatedMediaLink));
        } else if (updatedMediaLink.type === MediaType.Video && isVimeoUrl(updatedMediaLink.url)) {
          resolve(this.updateVideoMediaLink(updatedMediaLink));
        } else {
          reject(new Error(ERRORS.INVALID_TYPE));
        }
      } else {
        reject(new Error(ERRORS.INVALID_OBJECT));
      }
    });
  }

  private updatePictureMediaLink(pictureMediaLink: any) {
    return this.pictureMediaLinkRepository.findOneAndUpdate(pictureMediaLink, pictureMediaLink.id)
      .then((res) => {
        return Promise.resolve(this.findMediaById(res.id));
      }).catch(err => {
        console.log('catched ' + err);
        return Promise.reject(new Error(err)); //url already exist, ... 
      });
  }

  private updateVideoMediaLink(videoMediaLink: any) {
    return this.videoMediaLinkRepository.findOneAndUpdate(videoMediaLink, videoMediaLink.id)
      .then((res) => {
        return Promise.resolve(this.findMediaById(res.id));
      }).catch(err => {
        return Promise.reject(new Error(err)); //url already exist, ... 
      });
  }

  public deleteMediaLink(id: string) {
    if (id) {
      return Promise.resolve(this.baseRepository.delete(id));
    } else {
      return Promise.reject(new Error(ERRORS.INVALID_OBJECT));
    }
  }

  private createPictureMediaLink(pictureMediaLinkObject: any) {
    return new Promise<MediaLink>((resolve, reject) => {
      if (!(isFlickerUrl(pictureMediaLinkObject.url))) {
        reject(new Error(ERRORS.INVALID_URL));
      } else {
        let pictureMediaLink = new PictureMediaLink(pictureMediaLinkObject.url, pictureMediaLinkObject.title, pictureMediaLinkObject.author_name, new Date(), pictureMediaLinkObject.tags, pictureMediaLinkObject.type, pictureMediaLinkObject.width, pictureMediaLinkObject.height)
        validate(pictureMediaLink).then(errors => {
          if (errors.length > 0) {
            let listErrors = [];
            for (let i = 0; i < errors.length; i++) {
              listErrors.push(JSON.stringify(errors[i].constraints));
            }
            reject(new Error("Format Error : " + listErrors));
          } else {
            this.pictureMediaLinkRepository.save(pictureMediaLink).then(function (res) {
              resolve(res);
            }).catch(err => {
              reject(new Error(err));
            });
          }
        });
      }
    });
  }

  private createVideoMediaLink(videoMediaLinkObject: any) {
    return new Promise<MediaLink>((resolve, reject) => {
      if (!(isVimeoUrl(videoMediaLinkObject.url))) {
        reject(new Error(ERRORS.INVALID_URL));
      } else {
        let videoMediaLink = new VideoMediaLink(videoMediaLinkObject.url, videoMediaLinkObject.title, videoMediaLinkObject.author_name, new Date(), videoMediaLinkObject.tags, videoMediaLinkObject.type, videoMediaLinkObject.width, videoMediaLinkObject.height, videoMediaLinkObject.duration)
        validate(videoMediaLink).then(errors => {
          if (errors.length > 0) {
            let listErrors = [];
            for (let i = 0; i < errors.length; i++) {
              listErrors.push(JSON.stringify(errors[i].constraints));
            }
            reject(new Error("Format Error : " + listErrors));
          } else {
            this.videoMediaLinkRepository.save(videoMediaLink).then(function (res) {
              resolve(res);
            }).catch(err => {
              reject(new Error(err));
            });
          }
        });
      }
    });
  }
}