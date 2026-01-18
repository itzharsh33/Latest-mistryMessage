
import { NextResponse } from 'next/server';
// Imports Next.js helper to build server responses in App Router route files. NextResponse.json(...) creates a JSON response with status and headers.

export async function POST(request: Request) {
  // Exports an async handler for POST requests for this route. Next.js will call this function when a client POSTs to the route path.
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    // Reads the Gemini API key from environment variables. This must be set on the server (never commit to source).

    if (!geminiApiKey) {
      return NextResponse.json({ success: false, message: "API key is not configured." }, { status: 500 });
    }
    // If missing, returns a 500 JSON error immediately. This prevents any attempt to call the external API without credentials.

    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment and not of more than 18 words.";

      // This prompt string tells the LLM exactly what to produce:
 

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
    };
         // payload is the structured JSON that wraps your prompt string inside the format the Gemini API requires. Without this wrapping (contents → parts → text), the API wouldn’t understand your input.

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${geminiApiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Builds the full Gemini endpoint URL using the API key in the query string (?key=...).
    // Calls the endpoint with fetch, sending payload as JSON.
    // Uses await so the code pauses until the request completes.

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ success: false, message: errorData.error.message || 'API call failed' }, { status: response.status });
    }
    // If the HTTP response status is not 2xx, parse the error JSON from the API and return it to the client with the same status code.

    const result = await response.json();
    const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

// What is happening here?
// You’re reading the response from the Gemini API.
// When Gemini replies, it usually gives you JSON shaped like this:

// {
//   "candidates": [
//     {
//       "content": {
//         "parts": [
//           { "text": "Here is the generated suggestion..." }
//         ]
//       }
//     }
//   ]
// }


// So, you need to dig down to the text.

    if (!generatedText) {
      return NextResponse.json({ success: false, message: 'No suggestions were generated.' }, { status: 500 });
    }
    // The code expects the response to include candidates[0].content.parts[0].text. If not found, return a 500 error.

    let messages = generatedText.split('||').map((msg: string) => msg.trim()).filter((msg:string) => msg.length > 0);

    // Enforce max word count (≤ 18 words per message)
messages = messages.filter((msg: string) => msg.split(/\s+/).length <= 18);

// If more than 3, keep only first 3
if (messages.length > 3) {
  messages = messages.slice(0, 3);
}

// If fewer than 3, fallback: regenerate OR pad with defaults
if (messages.length < 3) {
  messages = [
    ...messages,
    "What's one thing that always makes you smile?",
    "If you could visit any place, where would you go?",
    "What's a small goal you're excited about?"
  ].slice(0, 3); // ensure exactly 3
}

    // Splits the single string from the model on the || delimiter into an array.
    // map(...trim()) removes whitespace around each piece.
    // filter(...length > 0) removes any empty strings (in case of trailing delimiters or blank parts).
    // The resulting messages array contains the suggested questions.

    return NextResponse.json({ success: true, messages });
    // Returns a JSON response with success: true and the messages array (HTTP status defaults to 200).

  } catch (error) {
    console.error('An error occurred:', error);
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });

  //  Any unexpected thrown errors are caught here, logged to the server console, and a 500 JSON response is returned with the error message.

  }
}






