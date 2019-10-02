import { inject, injectable, unmanaged } from "inversify";
import { Document, Model } from "mongoose";
import { DbClient } from "./config/MongooseConnector";
import { CRUDRepository, Query } from "../../Domain/Repository/repositories";
import TYPES from '../../constant/types';

@injectable()
export class GenericRepository<TEntity, TModel extends Document> implements CRUDRepository<TEntity>{

  private _name: string;
  protected Model: Model<TModel>;

  constructor(
    @inject(TYPES.DbClient) dbClient: DbClient,
    @unmanaged() name: string,
    @unmanaged() Model: Model<TModel>) {
    this._name = name;
    this.Model = Model;
  }

  public async findAll() {
    return new Promise<TEntity[]>((resolve, reject) => {
      this.Model.find((err, res) => {
        if (err) {
          reject(err);
        } else {
          const result = res.map((r) => this._readMapper(r));
          resolve(result);
        }
      }).limit(1000);
    });
  }

  public async findById(id: string) {
    return new Promise<TEntity>((resolve, reject) => {
      this.Model.findById(id, (err, res) => {
        if (err) {
          reject(err);
        }
        if (res === null) {
          reject();
        } else {
          resolve(this._readMapper(res));
        }
      });
    });
  }

  public async findOneByFilter(filter: any) {
    return new Promise<TEntity>((resolve, reject) => {
      this.Model.findOne(filter, (err, res) => {
        if (err) {
          reject(err);
        }
        if (res === null) {
          reject();
        } else {
          resolve(this._readMapper(res));
        }
      });
    });
  }

  public count() {
    return new Promise<Number>((resolve, reject) => {
      this.Model.count((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  public async save(doc: TEntity) {
    return new Promise<TEntity>((resolve, reject) => {
      const instance = new this.Model(doc);
      return instance.save((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(this._readMapper(res));
        }
      });
    });
  }

  public async findOneAndUpdate(doc: TEntity) {
    return new Promise<TEntity>((resolve, reject) => {
      return this.Model.find().select("_id").exec((err, id) => {
        console.log(`id : ${id} \r`);
        return this.Model.findOneAndUpdate({ _id: id }, doc, { new: false, upsert: false }, (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(this._readMapper(res));
          }
        });
      });
    });
  }

  public update(filter: Object, set: Object) {
    return new Promise<TEntity>((resolve, reject) => {
      return this.Model.update(filter, { $set: set }, (err, res) => {
        if (err) reject(err);
        else {
          resolve();
        }
      });
    });
  }

  public delete(id: string) {
    return new Promise<TEntity>((resolve, reject) => {
      return this.Model.findOneAndRemove({ _id: id }, (err, res) => {
        if (err) reject(err);
        else {
          resolve();
        }
      });
    });
  }

  public findManyById(ids: string[]) {
    return new Promise<TEntity[]>((resolve, reject) => {
      const query = { _id: { $in: ids } };
      this.Model.find(query, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res.map((r) => this._readMapper(r)));
      });
    });
  }

  public findManyByQuery(
    query: Query<TEntity>
  ) {
    return new Promise<TEntity[]>((resolve, reject) => {
      this.Model.find(query as any, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res.map((r) => this._readMapper(r)));
      });
    });
  }

  protected _readMapper(model: TModel) {
    const obj: any = model.toJSON();
    Object.defineProperty(obj, "id", Object.getOwnPropertyDescriptor(obj, "_id"));
    delete obj["_id"];
    return obj as TEntity;
  }

}
