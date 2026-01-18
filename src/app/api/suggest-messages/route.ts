
import { NextResponse } from 'next/server';


export async function POST(request: Request) {
 
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;
   

    if (!geminiApiKey) {
      return NextResponse.json({ success: false, message: "API key is not configured." }, { status: 500 });
    }
   

    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment and not of more than 18 words.";

     
 

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
    };
        

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${geminiApiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });



    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ success: false, message: errorData.error.message || 'API call failed' }, { status: response.status });
    }


    const result = await response.json();
    const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text;



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

  

    return NextResponse.json({ success: true, messages });
    // Returns a JSON response with success: true and the messages array (HTTP status defaults to 200).

  } catch (error) {
    console.error('An error occurred:', error);
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });



  }
}






