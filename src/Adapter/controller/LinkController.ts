import { controller, httpGet, httpPost, httpPut, requestParam, httpDelete, response } from 'inversify-express-utils';
import { LinkService } from '../../Application/Services/LinkService';
import * as express from "express";
import { inject } from 'inversify';
import TYPES from '../../constant/types';
import { MediaLink } from '../../Domain/Model/medialink'
import ERRORS from '../../constant/error';

@controller("/links")
export class LinkController {

  constructor(@inject(TYPES.LinkService) private linkService: LinkService) {
    this.linkService = linkService;
  }

  @httpGet("/")
  public findAll(): Promise<MediaLink[]> {
    return this.linkService.findAll();
  }

  @httpGet("/:id")
  public findMediaLinkById(@requestParam("id") id: string): Promise<MediaLink> {
    return this.linkService.findMediaById(id);
  }


  @httpDelete("/:id")
  public deleteMediaLink(@requestParam("id") id: string, @response() res: express.Response): Promise<void> {
    return this.linkService.deleteMediaLink(id).then(() => {
      res.sendStatus(204);
    }).catch((err: Error) => {
      res.status(400).json({ error: err.message });
    });
  }

  @httpPost("/")
  public addMediaLink(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.body != null) {
      return this.linkService.addMediaLink(req.body).then((medialink) => {
        res.status(200).json(medialink);
      }).catch((err: Error) => {
        res.status(400).json({ error: err.message });
      });;
    } else {
      res.status(400).json({ error: ERRORS.INVALID_OBJECT });
    }
  }

  @httpPut("/:id")
  public updateMediaLink(@requestParam("id") id: string, req: express.Request, res: express.Response, next: express.NextFunction) {
    if (id != null && req.body != null) {
      return this.linkService.updateMediaLink(id, req.body).then((medialink) => {
        res.status(200).json(medialink);
      }).catch((err: Error) => {
        res.status(400).json({ error: err.message });
      });;
    } else {
      res.status(400).json({ error: ERRORS.INVALID_OBJECT });
    }
  }

}
