import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface VerificationEmailRequest {
  email: string;
  confirmationUrl: string;
  userName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, confirmationUrl, userName }: VerificationEmailRequest = await req.json();

    if (!email || !confirmationUrl) {
      throw new Error("Email e URL de confirmação são obrigatórios");
    }

    const emailResponse = await resend.emails.send({
      from: "BDSM Brazil <noreply@YOUR-VERIFIED-DOMAIN.com>", // Substituir pelo domínio verificado
      to: [email],
      subject: "Confirme seu cadastro - BDSM Brazil",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirme seu e-mail</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0f; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0f; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 600px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; border: 1px solid rgba(255, 0, 128, 0.3);">
          <tr>
            <td style="padding: 40px; text-align: center;">
              <!-- Logo -->
              <h1 style="margin: 0 0 30px 0; font-size: 28px; font-weight: 900;">
                <span style="color: #ff0080;">BDSM</span><span style="color: #ffffff;">BRAZIL</span>
              </h1>
              
              <!-- Saudação -->
              <p style="color: #ffffff; font-size: 18px; margin-bottom: 20px;">
                Olá${userName ? `, ${userName}` : ''}! 👋
              </p>
              
              <!-- Mensagem principal -->
              <p style="color: #a0aec0; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Obrigado por se cadastrar no <strong style="color: #ff0080;">BDSM Brazil</strong>! 
                Para completar seu cadastro e começar a divulgar seu motel, 
                clique no botão abaixo para confirmar seu e-mail.
              </p>
              
              <!-- Botão CTA -->
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto 30px auto;">
                <tr>
                  <td style="background: linear-gradient(135deg, #ff0080 0%, #7928ca 100%); border-radius: 8px;">
                    <a href="${confirmationUrl}" 
                       style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                      Confirmar E-mail
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Aviso de expiração -->
              <p style="color: #718096; font-size: 14px; margin-bottom: 20px;">
                Este link expira em <strong>24 horas</strong>.
              </p>
              
              <!-- Link alternativo -->
              <p style="color: #718096; font-size: 12px; line-height: 1.6; margin-bottom: 20px;">
                Se o botão não funcionar, copie e cole este link no seu navegador:<br>
                <a href="${confirmationUrl}" style="color: #ff0080; word-break: break-all;">
                  ${confirmationUrl}
                </a>
              </p>
              
              <!-- Aviso de segurança -->
              <div style="background: rgba(255, 0, 128, 0.1); border-radius: 8px; padding: 15px; margin-top: 20px;">
                <p style="color: #a0aec0; font-size: 12px; margin: 0;">
                  Se você não solicitou este cadastro, pode ignorar este e-mail com segurança.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; border-top: 1px solid rgba(255, 255, 255, 0.1); text-align: center;">
              <p style="color: #718096; font-size: 12px; margin: 0;">
                © 2024 BDSM Brazil. Todos os direitos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    console.log("E-mail de verificação enviado:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Erro ao enviar e-mail de verificação:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
