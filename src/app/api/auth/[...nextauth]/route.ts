import NextAuth from "next-auth";
import { authOptions } from "./options";

const handler = NextAuth(authOptions)

//ITS A framework, to use it , we must export as GET, POST
export {handler as GET , handler as POST}