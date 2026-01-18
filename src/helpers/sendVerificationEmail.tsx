

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












