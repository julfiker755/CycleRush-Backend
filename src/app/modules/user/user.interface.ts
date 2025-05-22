import { userRole, userStatus } from "./user.constants"

export type Trole = typeof userRole[number]
export type TuserStatus = typeof userStatus[number]

export type Tuser ={
  name:string,
  email:string,
  password:string,
  contactNumber?:string,
  role:Trole,
  status:TuserStatus,
  needsPasswordChange?:boolean,
  isDeleted?:boolean
}