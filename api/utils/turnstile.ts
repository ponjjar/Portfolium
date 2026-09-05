export async function verifyTurnstileToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;

  const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    // If no secret key is configured, we assume Turnstile is bypassed (useful for local dev without env vars)
    // However, in production, this should be set. We log a warning and allow it.
    console.warn('CLOUDFLARE_TURNSTILE_SECRET_KEY is not set. Bypassing Turnstile validation.');
    return true;
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    console.log('Turnstile verify response:', data);
    return data.success === true;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}
