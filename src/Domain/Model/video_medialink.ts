import { injectable } from 'inversify';
import { MediaLink } from './medialink'
import { Tag } from './tag';

@injectable()
export class VideoMediaLink extends MediaLink {

  private width: Number;

  private height: Number;

  private duration: Number;

  constructor(url: string, title: string, author_name: string, added_date: Date, tags: Tag[], type: string, width: Number, height: Number, duration: Number, id?: string) {
    super(url, title, author_name, added_date, tags, type, id);
    this.width = width;
    this.height = height;
    this.duration = duration;
  }

  public getWidth() {
    return this.width;
  }

  public getHeight() {
    return this.height;
  }

  public getDuration() {
    return this.duration;
  }

}
