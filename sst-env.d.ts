/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    "TestBucket": {
      "name": string
      "type": "sst.aws.Bucket"
    }
  }
}
export {}
