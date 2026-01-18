import { Message } from "@/model/User";

export interface ApiResponse{
    success:boolean,
    message:string,
    isAcceptingMessages?:boolean,
    messages?: Array<Message>
} 

// -> Defining a reusable interface (ApiResponse) for your API responses.
// Ensuring consistency: every API response in your app follows the same shape.
// Using TypeScript’s optional fields (?) to allow flexible responses.
// Reusing your existing Message interface so you don’t duplicate message structure.

// Where this file can be used
// Basically, anywhere you are dealing with API requests/responses in your project:

// In backend API routes (Next.js / Express / etc.)
// You can use it to make sure the object you send back to the client matches a fixed shape.

// In frontend API calls
// When fetching data, you can cast the result as ApiResponse to get autocomplete and type safety.
