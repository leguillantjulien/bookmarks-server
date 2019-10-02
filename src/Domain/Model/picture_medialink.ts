import { injectable } from 'inversify';
import { MediaLink } from './medialink'
import { Tag } from './tag';

@injectable()
export class PictureMediaLink extends MediaLink {

  private width: Number;

  private height: Number;

  constructor(url: string, title: string, author_name: string, added_date: Date, tags: Tag[], type: string, width: Number, height: Number, id?: string, ) {
    super(url, title, author_name, added_date, tags, type, id);
    this.width = width;
    this.height = height;
  }

  public getWidth() {
    return this.width;
  }

  public getHeight() {
    return this.height;
  }

}
