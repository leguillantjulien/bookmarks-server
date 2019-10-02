import { injectable } from 'inversify';
import { Tag } from './tag';

@injectable()
export class MediaLink {

  private url: string;

  private title: string;

  private author_name: string;

  private added_date: Date;

  public id?: string;

  private tags?: Tag[];

  public type: string;

  constructor(url: string, title: string, author_name: string, added_date: Date, tags: Tag[], type: string, id?: string, ) {
    this.url = url;
    this.title = title;
    this.author_name = author_name;
    this.added_date = added_date;
    this.id = id;
    this.tags = tags;
    this.type = type;
  }

  public getUrl() {
    return this.url;
  }

  public setUrl(newUrl: string) {
    this.url = newUrl;
  }

  public getTitle() {
    return this.title;
  }

  public getAuthorName() {
    return this.author_name;
  }

  public getAddedDate() {
    return this.added_date;
  }

  public getTags() {
    return this.tags;
  }

  public getType() {
    return this.type;
  }

  public getId() {
    return this.id;
  }

}
