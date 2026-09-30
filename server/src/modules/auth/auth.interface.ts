export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "admin" | "manager";
  createdAt: Date;
  updatedAt: Date;
}
export interface ILoginUser {
  email: string;
  password: string;

}
