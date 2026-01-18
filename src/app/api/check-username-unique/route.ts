import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod"
import { usernamevalidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
    username:usernamevalidation
})

export async function GET(request:Request){
// TODO: use this in all other routes

// if(request.method!=='GET'){
// return Response.json({
//   success:false,
//   message:'Method not allowed'
//   },{status:405})
// }

await dbConnect()
// localhost:3000/api/cuu?username=hitesh?phone=android

try {
    const {searchParams} = new URL(request.url)
    const queryParam = {
        username: searchParams.get('username')
    }
    // validate with zod
    const result = usernameQuerySchema.safeParse(queryParam)
    console.log(result)  // TODO: remove
    if(!result.success){
        // const usernameErrors=result.error.format().username?._errors
        //   const tree = z.treeifyError(result.error);
        const usernameErrors = result.error.format().username?._errors || [];
//   const usernameErrors = tree.username?._errors;
//   const usernameErrors = tree.properties?.username?.errors||[];
  return Response.json({
  success:false,
  message:usernameErrors?.length>0
  ?usernameErrors.join(',')
  :'Invalid query parameter'
  },{status:400})
    }
    const {username} = result.data
    const existingVerifiedUser = await UserModel.findOne({
        username,
        isVerified:true
    })
    if(existingVerifiedUser){
return Response.json({
  success:false,
  message:'Username is already taken'
  },{status:400})
    }
    return Response.json({
  success:true,
  message:'Username is unique'
  },{status:200})
} catch (error) {
    console.error("error checking username", error)
    return Response.json(
        {
            success:false,
            message:"Error checking username"
        },
        {status:500}
    )
}

}
















//    const {searchParams} = new URL(request.url)

// ->Parses the full request URL into a URL object and extracts its searchParams (an instance of URLSearchParams).

// searchParams provides methods like .get('username').


//     const queryParam = {
//         username: searchParams.get('username')
//     }

//     -> Builds an object queryParam with a username property set to the query param value from the URL.

// Important: searchParams.get(...) returns string | null. So queryParam.username may be null if the param is missing.


// const result = usernameQuerySchema.safeParse(queryParam)

// ->Validates queryParam against usernameQuerySchema.

// safeParse returns an object with shape:

// { success: true, data: parsedValue } if valid, or

// { success: false, error: ZodError } if invalid.



//     if(!result.success){
//           const tree = z.treeifyError(result.error);
//   const usernameErrors = tree.properties?.username?.errors||[];

//   -> If validation failed, the code transforms the ZodError into a tree-like structure (using z.treeifyError(...)) and extracts username-specific errors.

// tree.properties?.username?.errors — used to get an array of error messages for the username field. If not found, fall back to an empty array.

// Note: z.treeifyError is intended to produce a nested error representation. (Depending on your Zod version, equivalent utilities: error.format() or error.flatten(). This code assumes treeifyError returns a structure with properties.)


// from this onwards user is searched across databse and returned message