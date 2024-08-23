import { Error } from "../definitions";

export type UserModel = {
  email: string;
  username: string;
  password: string;
  show_name?: string;
  contact_info?: string;
  custom_table?: string;
  share_collection?: boolean;
  share_pass?: string;
  _id?: string;
};

export type ArtPieceExportModel = {
  title: string;
  artist: string;
  medium: string;
  year_started: number;
  year_finished: number;
  size_x: number;
  size_y: number;
  size_z: number;
  owner_name: string;
  owner_contact: string;
  holder_name: string;
  holder_contact: string;
  forSale: boolean;
  price: number;
  price_currency: string;
  archival: boolean;
  description: string;
  catalogue_number: string;
  acquisition_date: Date;
  image_url_1: string;
  image_url_2: string;
  image_url_3: string;
  image_url_4: string;
};

export interface UserModelWithMongooseMethods extends UserModel {
  setPassword: (
    new_password: string,
    cb: (err: Error, u: UserModelWithMongooseMethods) => void
  ) => void;
  save: () => void;
}
