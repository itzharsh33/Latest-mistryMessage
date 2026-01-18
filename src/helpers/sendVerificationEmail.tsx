

// sendVerificationEmail.tsx
import { render } from '@react-email/components';
import VerificationEmail from '../../emails/VerificationEmail';
import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        // Use the new, asynchronous render function and await its result
        // here below is calling verification email format with parameter username and verifycode send with it which is send to this file by sign-up.route.js file
        const emailHtml = await render(
            <VerificationEmail username={username} otp={verifyCode} />,
            { pretty: true }
        );

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystry Message | Verification Code',
            html: emailHtml,
        });

        return { success: true, message: 'Verification email sent successfully' };
    } catch (emailError) {
        console.error("error sending verification email", emailError);
        return { success: false, message: 'Failed to send verification email' };
    }
}













// render(...): converts the VerificationEmail React component into HTML string.

// resend.emails.send(...): sends the email using the Resend service (or whatever abstraction resend is).

// The function returns an ApiResponse object ({ success, message }) so the caller can act accordingly.


// Here, render from @react-email/components is the key.

// render() takes a React component (like <VerificationEmail />) and converts the JSX tree into a raw HTML string.

// That string is stored in emailHtml.