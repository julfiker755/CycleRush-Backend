import { userRole, userStatus } from "./user.constants"

export type Trole = typeof userRole[number]
export type TuserStatus = typeof userStatus[number]

export type Tuser ={
  email:string,
  password:string,
  role:Trole,
  status:TuserStatus,
  needsPasswordChange?:boolean,
  isDeleted?:boolean
}