import bcrypt from "bcryptjs";
import { ILoginUser, IUser } from "./auth.interface";
import { User } from "./auth.model";
import appError from "../../utils/appError";
import config from "../../config";
import httpStatus from "http-status";
import { SignOptions } from "jsonwebtoken";
import { jwtUtils } from "../../utils/jwt";
const registerAuthService = async (payload: IUser) => {
  const { name, email, password, role } = payload;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new appError("User Aleady Exist with this email, try another email", httpStatus.NOT_FOUND);
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

const loginAuthService = async (payload: ILoginUser) => {
  const { email, password } = payload;
  const user = await User.findOne({ email }).select("password");
  if (!user) {
    throw new appError("User Not Found. Create New User", httpStatus.NOT_FOUND);
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new appError("Password is incrorrects", httpStatus.UNAUTHORIZED);
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};



export const authServices = {
  registerAuthService,
  loginAuthService,
};
