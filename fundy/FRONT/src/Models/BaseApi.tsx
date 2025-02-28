export interface ApiEntity {
  readonly id: number;
  readonly createdAt: Date;
}


export type WithApiMetadata<T> = ApiEntity & T;