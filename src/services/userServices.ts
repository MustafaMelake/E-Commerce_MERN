import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
//////// register

interface registerParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const register = async ({
  firstName,
  lastName,
  email,
  password,
}: registerParams) => {
  const findUser = await userModel.findOne({ email });

  if (findUser) {
    return { data: "The User Already Exists", statusCode: 400 };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new userModel({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });
  await newUser.save();

  return { data: generateJWT({ firstName, lastName, email }), statusCode: 200 };
};

///////////// login

interface loginParams {
  email: string;
  password: string;
}

export const login = async ({ email, password }: loginParams) => {
  const findUser = await userModel.findOne({ email });
  if (!findUser) {
    return { data: "The User Already Exists", statusCode: 400 };
  }
  const passwordMatch = await bcrypt.compare(password, findUser.password);

  if (passwordMatch) {
    return {
      data: generateJWT({
        firstName: findUser.firstName,
        lastName: findUser.lastName,
        email,
      }),
      statusCode: 200,
    };
  }

  return { data: "Incorrect Password or Email!", statusCode: 400 };
};

const generateJWT = (data: any) => {
  return jwt.sign(
    data,
    "T3X8MUtLy0zlF7iRDoYrykWIcPch9VhQ1yZmYsao7OA6wY8aslr3armnnwI0JdDJ"
  );
};
