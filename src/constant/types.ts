const TYPES = {
  App: Symbol.for('App'),
  DbClient: Symbol.for("DbClient"),
  //service
  LinkService: Symbol.for("LinkService"),
  //model
  IMediaLink: Symbol.for("MediaLink"),
  //IRepo
  IMediaLinkRepository: Symbol.for("MediaLinkRepository"),
  IVideoMediaLinkRepository: Symbol.for("VideoMediaLinkRepository"),
  IPictureMediaLinkRepository: Symbol.for("PictureMediaLinkRepository"),
};

export default TYPES;
