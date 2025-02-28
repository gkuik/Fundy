import { WithApiMetadata } from "./BaseApi";

export interface Member {
  name: string;
  income: number;
}

export type MemberApiResponse = WithApiMetadata<Member>;